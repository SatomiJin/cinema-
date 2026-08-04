import { useState } from "react";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { Check, Download, LoaderCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { checkForAppUpdate } from "../../services/appUpdate";
import "./AppUpdateButton.scss";

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
      const appInfo = await App.getInfo();
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
      setMessage(error.message === "NO_RELEASE" ? t("noAppRelease") : t("updateCheckFailed"));
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
      : t("checkAppUpdate");
  const Icon = isBusy ? LoaderCircle : isAvailable ? Download : status === "current" ? Check : RefreshCw;

  return (
    <div className={`app-update${compact ? " app-update--compact" : ""}`}>
      <button
        aria-label={buttonLabel}
        className={`app-update__button${isAvailable ? " is-available" : ""}`}
        disabled={isBusy}
        onClick={handleClick}
        title={buttonLabel}
        type="button"
      >
        <Icon aria-hidden="true" className={isBusy ? "is-spinning" : ""} size={17} />
        <span>{buttonLabel}</span>
      </button>
      {message && (
        <span className={`app-update__message app-update__message--${status}`} role="status">
          {message}
        </span>
      )}
    </div>
  );
}

export default AppUpdateButton;
