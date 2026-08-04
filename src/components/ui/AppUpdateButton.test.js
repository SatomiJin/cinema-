import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  afterEach(() => jest.clearAllMocks());

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
});
