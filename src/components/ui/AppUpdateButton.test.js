import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import AppUpdateButton from "./AppUpdateButton";
import { checkForAppUpdate } from "../../services/appUpdate";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, values) => (values?.version ? `${key} ${values.version}` : key),
  }),
}));
jest.mock("@capacitor/app", () => ({ App: { getInfo: jest.fn() } }));
jest.mock("@capacitor/browser", () => ({ Browser: { open: jest.fn() } }));
jest.mock("@capacitor/core", () => ({ Capacitor: { getPlatform: jest.fn(), isNativePlatform: jest.fn() } }));
jest.mock("../../services/appUpdate", () => ({ checkForAppUpdate: jest.fn() }));

describe("AppUpdateButton", () => {
  beforeEach(() => {
    Capacitor.isNativePlatform.mockReturnValue(true);
    Capacitor.getPlatform.mockReturnValue("android");
    App.getInfo.mockResolvedValue({ version: "1.0.0" });
    Browser.open.mockResolvedValue(undefined);
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

  test("checks first, then opens the newer APK on the next click", async () => {
    checkForAppUpdate.mockResolvedValue({ available: true, downloadUrl: "https://example.com/app-release.apk", hasDirectApk: true, latestVersion: "v1.1.0" });
    render(<AppUpdateButton />);
    fireEvent.click(screen.getByRole("button", { name: "appUpdateAction" }));
    await waitFor(() => expect(checkForAppUpdate).toHaveBeenCalledWith({ currentVersion: "1.0.0" }));
    fireEvent.click(screen.getByRole("button", { name: "updateToVersion v1.1.0" }));
    await waitFor(() => expect(Browser.open).toHaveBeenCalledWith({ url: "https://example.com/app-release.apk" }));
    await screen.findByText("finishUpdateInstall");
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
