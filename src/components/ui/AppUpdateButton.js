import { useState } from "react";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { BadgeCheck, CircleArrowUp, Download, LoaderCircle, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { checkForAppUpdate } from "../../services/appUpdate";
import "./AppUpdateButton.scss";

const UPDATE_ERROR_MESSAGES = {
  APP_INFO_UNAVAILABLE: "appInfoUnavailable",
  INVALID_RELEASE: "invalidAppRelease",
  UPDATE_CHECK_TIMEOUT: "updateCheckTimeout",
  UPDATE_NETWORK_ERROR: "updateNetworkError",
  UPDATE_RATE_LIMITED: "updateRateLimited",
  UPDATE_SERVICE_ERROR: "updateServiceError",
  UPDATE_SOURCE_UNAVAILABLE: "updateSourceUnavailable",
};

function AppUpdateButton({ compact = false }) {
  const { t } = useTranslation();
  const [update, setUpdate] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const isAndroidApp =
    Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";

  if (!isAndroidApp) return null;

  const checkUpdate = async () => {
    setStatus("checking");
    setMessage(t("checkingUpdate"));
    try {
      let appInfo;

      try {
        appInfo = await App.getInfo();
      } catch {
        const appInfoError = new Error("APP_INFO_UNAVAILABLE");
        appInfoError.code = "APP_INFO_UNAVAILABLE";
        throw appInfoError;
      }

      const result = await checkForAppUpdate({ currentVersion: appInfo.version });
      setUpdate(result);
      setStatus(result.available ? "available" : "current");
      setMessage(
        result.available
          ? t("updateAvailableMessage", { version: result.latestVersion })
          : t("appUpToDate", { version: appInfo.version }),
      );
    } catch (error) {
      setStatus("error");
      const errorCode = error?.code || error?.message;
      const messageKey = UPDATE_ERROR_MESSAGES[errorCode] || "updateCheckFailed";
      setMessage(t(messageKey));
    }
  };

  const openUpdate = async () => {
    setStatus("opening");
    setMessage(t("openingUpdate"));
    try {
      await Browser.open({ url: update.downloadUrl });
      setStatus("opened");
      setMessage(update.hasDirectApk ? t("finishUpdateInstall") : t("chooseReleaseApk"));
    } catch {
      setStatus("error");
      setMessage(t("updateOpenFailed"));
    }
  };

  const handleClick = () => {
    void (status === "available" && update ? openUpdate() : checkUpdate());
  };

  const isBusy = status === "checking" || status === "opening";
  const isAvailable = status === "available";
  const buttonLabel = isAvailable
    ? t("updateToVersion", { version: update.latestVersion })
    : isBusy
      ? t(status === "checking" ? "checkingUpdate" : "openingUpdate")
      : status === "error"
        ? t("retryUpdateCheck")
        : status === "current"
          ? t("checkUpdateAgain")
          : t("appUpdateAction");
  const Icon = isBusy
    ? LoaderCircle
    : isAvailable
      ? Download
      : status === "current"
        ? BadgeCheck
        : status === "error"
          ? TriangleAlert
          : CircleArrowUp;

  return (
    <div className={`app-update${compact ? " app-update--compact" : ""}`}>
      <button
        aria-label={buttonLabel}
        className={`app-update__button app-update__button--${status}`}
        disabled={isBusy}
        onClick={handleClick}
        title={buttonLabel}
        type="button"
      >
        <span className="app-update__icon" aria-hidden="true">
          <Icon className={isBusy ? "is-spinning" : ""} size={17} />
        </span>
        <span>{buttonLabel}</span>
      </button>
      {message && (
        <span
          className={`app-update__message app-update__message--${status}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </span>
      )}
    </div>
  );
}

export default AppUpdateButton;
