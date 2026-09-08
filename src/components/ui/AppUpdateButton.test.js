import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import AppUpdateButton from "./AppUpdateButton";
import { checkForAppUpdate } from "../../services/appUpdate";
import {
  canInstallApk,
  clearDownloadedApk,
  downloadApk,
  installApk,
  requestInstallPermission,
} from "../../services/apkInstaller";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, values) => (values?.version ? `${key} ${values.version}` : key),
  }),
}));
jest.mock("@capacitor/app", () => ({ App: { getInfo: jest.fn() } }));
jest.mock("@capacitor/browser", () => ({ Browser: { open: jest.fn() } }));
jest.mock("@capacitor/core", () => ({ Capacitor: { getPlatform: jest.fn(), isNativePlatform: jest.fn() } }));
jest.mock("../../services/appUpdate", () => ({ checkForAppUpdate: jest.fn() }));
jest.mock("../../services/apkInstaller", () => ({
  canInstallApk: jest.fn(),
  clearDownloadedApk: jest.fn(),
  downloadApk: jest.fn(),
  installApk: jest.fn(),
  requestInstallPermission: jest.fn(),
}));

describe("AppUpdateButton", () => {
  beforeEach(() => {
    Capacitor.isNativePlatform.mockReturnValue(true);
    Capacitor.getPlatform.mockReturnValue("android");
    App.getInfo.mockResolvedValue({ version: "1.0.0" });
    Browser.open.mockResolvedValue(undefined);
    canInstallApk.mockResolvedValue(true);
    clearDownloadedApk.mockResolvedValue(undefined);
    downloadApk.mockResolvedValue("file:///cache/cinema-update.apk");
    installApk.mockResolvedValue(undefined);
    requestInstallPermission.mockResolvedValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test("stays hidden outside the native Android app", () => {
    Capacitor.isNativePlatform.mockReturnValue(false);
    render(<AppUpdateButton />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("checks first, then installs the newer APK in-app on the next click", async () => {
    checkForAppUpdate.mockResolvedValue({ available: true, downloadUrl: "https://example.com/app-release.apk", hasDirectApk: true, latestVersion: "v1.1.0" });
    render(<AppUpdateButton />);
    fireEvent.click(screen.getByRole("button", { name: "appUpdateAction" }));
    await waitFor(() => expect(checkForAppUpdate).toHaveBeenCalledWith({ currentVersion: "1.0.0" }));
    fireEvent.click(screen.getByRole("button", { name: "updateToVersion v1.1.0" }));

    await waitFor(() => expect(installApk).toHaveBeenCalledWith("file:///cache/cinema-update.apk"));
    expect(downloadApk).toHaveBeenCalledWith("https://example.com/app-release.apk", expect.any(Object));
    expect(Browser.open).not.toHaveBeenCalled();
    await screen.findByText("confirmInstallPrompt");
  });

  test("falls back to the browser when the release has no direct APK", async () => {
    checkForAppUpdate.mockResolvedValue({ available: true, downloadUrl: "https://example.com/releases/tag/v1.1.0", hasDirectApk: false, latestVersion: "v1.1.0" });
    render(<AppUpdateButton />);

    fireEvent.click(screen.getByRole("button", { name: "appUpdateAction" }));
    await waitFor(() => expect(checkForAppUpdate).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: "updateToVersion v1.1.0" }));

    await waitFor(() => expect(Browser.open).toHaveBeenCalledWith({ url: "https://example.com/releases/tag/v1.1.0" }));
    expect(downloadApk).not.toHaveBeenCalled();
    await screen.findByText("chooseReleaseApk");
  });

  test("asks for install permission before downloading, then retries once granted", async () => {
    canInstallApk.mockResolvedValueOnce(false).mockResolvedValue(true);
    checkForAppUpdate.mockResolvedValue({ available: true, downloadUrl: "https://example.com/app-release.apk", hasDirectApk: true, latestVersion: "v1.1.0" });
    render(<AppUpdateButton />);

    fireEvent.click(screen.getByRole("button", { name: "appUpdateAction" }));
    await waitFor(() => expect(checkForAppUpdate).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: "updateToVersion v1.1.0" }));

    await screen.findByText("allowInstallMessage");
    expect(downloadApk).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "allowInstallAction" }));

    await waitFor(() => expect(requestInstallPermission).toHaveBeenCalled());
    await waitFor(() => expect(installApk).toHaveBeenCalled());
  });

  test("reports a failed download and clears the partial file", async () => {
    downloadApk.mockRejectedValue({ code: "DOWNLOAD_NETWORK_ERROR" });
    checkForAppUpdate.mockResolvedValue({ available: true, downloadUrl: "https://example.com/app-release.apk", hasDirectApk: true, latestVersion: "v1.1.0" });
    render(<AppUpdateButton />);

    fireEvent.click(screen.getByRole("button", { name: "appUpdateAction" }));
    await waitFor(() => expect(checkForAppUpdate).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: "updateToVersion v1.1.0" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("downloadNetworkError");
    expect(clearDownloadedApk).toHaveBeenCalled();
    expect(installApk).not.toHaveBeenCalled();
  });

  test("uses a distinct app-update affordance", () => {
    const { container } = render(<AppUpdateButton compact />);
    const button = screen.getByRole("button", { name: "appUpdateAction" });

    expect(button).toHaveAttribute("title", "appUpdateAction");
    expect(container.querySelector(".lucide-circle-arrow-up")).toBeInTheDocument();
    expect(container.querySelector(".lucide-refresh-cw")).not.toBeInTheDocument();
  });

  test("explains when the public update source is unavailable", async () => {
    checkForAppUpdate.mockRejectedValue({ code: "UPDATE_SOURCE_UNAVAILABLE" });
    render(<AppUpdateButton />);

    fireEvent.click(screen.getByRole("button", { name: "appUpdateAction" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("updateSourceUnavailable");
    expect(screen.getByRole("button", { name: "retryUpdateCheck" })).toBeInTheDocument();
  });

  test("lets the user dismiss an actionable update notice without losing the update action", async () => {
    checkForAppUpdate.mockResolvedValue({ available: true, downloadUrl: "https://example.com/app-release.apk", hasDirectApk: true, latestVersion: "v1.1.0" });
    render(<AppUpdateButton />);

    fireEvent.click(screen.getByRole("button", { name: "appUpdateAction" }));
    expect(await screen.findByText("updateAvailableMessage v1.1.0")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "dismissUpdateMessage" }));

    expect(screen.queryByText("updateAvailableMessage v1.1.0")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "updateToVersion v1.1.0" })).toBeInTheDocument();
  });

  test("auto-hides a successful no-update notice", async () => {
    jest.useFakeTimers();
    checkForAppUpdate.mockResolvedValue({ available: false });
    render(<AppUpdateButton />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "appUpdateAction" }));
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByText("appUpToDate 1.0.0")).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(7000));

    expect(screen.queryByText("appUpToDate 1.0.0")).not.toBeInTheDocument();
  });

  test("keeps an actionable update notice visible until it is dismissed", async () => {
    jest.useFakeTimers();
    checkForAppUpdate.mockResolvedValue({ available: true, downloadUrl: "https://example.com/app-release.apk", hasDirectApk: true, latestVersion: "v1.1.0" });
    render(<AppUpdateButton />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "appUpdateAction" }));
      await Promise.resolve();
      await Promise.resolve();
    });
    act(() => jest.advanceTimersByTime(7000));

    expect(screen.getByText("updateAvailableMessage v1.1.0")).toBeInTheDocument();
  });

  test("auto-hides an error notice while keeping the retry action", async () => {
    jest.useFakeTimers();
    checkForAppUpdate.mockRejectedValue({ code: "UPDATE_NETWORK_ERROR" });
    render(<AppUpdateButton />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "appUpdateAction" }));
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByRole("alert")).toHaveTextContent("updateNetworkError");

    act(() => jest.advanceTimersByTime(7000));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "retryUpdateCheck" })).toBeInTheDocument();
  });
});
