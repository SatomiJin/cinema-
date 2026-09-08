import { useEffect, useRef, useState } from "react";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { BadgeCheck, CircleArrowUp, Download, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { checkForAppUpdate } from "../../services/appUpdate";
import {
  canInstallApk,
  clearDownloadedApk,
  downloadApk,
  installApk,
  requestInstallPermission,
} from "../../services/apkInstaller";
import "./AppUpdateButton.scss";

const UPDATE_ERROR_MESSAGES = {
  APP_INFO_UNAVAILABLE: "appInfoUnavailable",
  INVALID_RELEASE: "invalidAppRelease",
  UPDATE_CHECK_TIMEOUT: "updateCheckTimeout",
  UPDATE_NETWORK_ERROR: "updateNetworkError",
  UPDATE_RATE_LIMITED: "updateRateLimited",
  UPDATE_SERVICE_ERROR: "updateServiceError",
  UPDATE_SOURCE_UNAVAILABLE: "updateSourceUnavailable",
  DOWNLOAD_TIMEOUT: "downloadTimeout",
  DOWNLOAD_NETWORK_ERROR: "downloadNetworkError",
  DOWNLOAD_EMPTY: "downloadFailed",
  DOWNLOAD_FAILED: "downloadFailed",
  INSTALL_FAILED: "installFailed",
  INSTALL_PERMISSION_FAILED: "installFailed",
};

const AUTO_DISMISS_STATUSES = new Set(["current", "opened", "error"]);
const NOTICE_AUTO_DISMISS_MS = 7000;

function AppUpdateButton({ compact = false }) {
  const { t } = useTranslation();
  const [update, setUpdate] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const isMountedRef = useRef(true);
  const isAndroidApp =
    Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!message || !AUTO_DISMISS_STATUSES.has(status)) return undefined;

    const timeoutId = window.setTimeout(() => setMessage(""), NOTICE_AUTO_DISMISS_MS);
    return () => window.clearTimeout(timeoutId);
  }, [message, status]);

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

  // Falls back to the browser whenever the release has no direct APK, or the in-app
  // install path is unavailable, so the user can always finish the update by hand.
  const openInBrowser = async () => {
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

  const installInApp = async () => {
    if (!(await canInstallApk())) {
      setStatus("permission");
      setMessage(t("allowInstallMessage"));
      return;
    }

    setProgress(0);
    setStatus("downloading");
    setMessage(t("downloadingUpdate"));

    try {
      const path = await downloadApk(update.downloadUrl, {
        onProgress: (percent) => {
          if (!isMountedRef.current) return;
          setProgress(percent);
          setMessage(t("downloadingUpdatePercent", { percent }));
        },
      });

      if (!isMountedRef.current) return;

      setStatus("installing");
      setMessage(t("installingUpdate"));
      await installApk(path);

      if (!isMountedRef.current) return;
      setStatus("opened");
      setMessage(t("confirmInstallPrompt"));
    } catch (error) {
      void clearDownloadedApk();

      if (!isMountedRef.current) return;

      if (error?.code === "INSTALL_PERMISSION_DENIED") {
        setStatus("permission");
        setMessage(t("allowInstallMessage"));
        return;
      }

      setStatus("error");
      setMessage(t(UPDATE_ERROR_MESSAGES[error?.code] || "updateOpenFailed"));
    }
  };

  const grantPermission = async () => {
    try {
      const granted = await requestInstallPermission();

      if (granted) {
        void installInApp();
        return;
      }

      setMessage(t("allowInstallMessage"));
    } catch {
      setStatus("error");
      setMessage(t("installFailed"));
    }
  };

  const startUpdate = () => (update?.hasDirectApk ? installInApp() : openInBrowser());

  const handleClick = () => {
    if (status === "permission") return void grantPermission();
    if (status === "available" && update) return void startUpdate();
    return void checkUpdate();
  };

  const isBusy =
    status === "checking" ||
    status === "opening" ||
    status === "downloading" ||
    status === "installing";
  const isAvailable = status === "available";
  const busyLabelKey =
    status === "downloading"
      ? "downloadingUpdate"
      : status === "installing"
        ? "installingUpdate"
        : status === "checking"
          ? "checkingUpdate"
          : "openingUpdate";
  const buttonLabel = isAvailable
    ? t("updateToVersion", { version: update.latestVersion })
    : status === "permission"
      ? t("allowInstallAction")
      : isBusy
        ? t(busyLabelKey)
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
        : status === "error" || status === "permission"
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
      {status === "downloading" && (
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="app-update__progress"
          role="progressbar"
        >
          <span className="app-update__progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
      {message && (
        <div className={`app-update__message app-update__message--${status}`}>
          <span role={status === "error" ? "alert" : "status"}>{message}</span>
          <button
            aria-label={t("dismissUpdateMessage")}
            className="app-update__message-close"
            onClick={() => setMessage("")}
            type="button"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default AppUpdateButton;
