import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUiVersion } from "../../context/UiVersionContext";
import "./UiVersionToggle.scss";

function UiVersionToggle({ compact = false }) {
  const { t } = useTranslation();
  const { isClassic, toggleUiVersion } = useUiVersion();
  const currentLabel = isClassic ? t("classicUi") : t("modernUi");
  const targetLabel = isClassic ? t("modernUi") : t("classicUi");
  const actionLabel = t("switchUi", { ui: targetLabel });

  return (
    <button
      aria-label={actionLabel}
      aria-pressed={!isClassic}
      className={`ui-version-toggle${compact ? " ui-version-toggle--compact" : ""}`}
      onClick={toggleUiVersion}
      title={actionLabel}
      type="button"
    >
      <RefreshCw aria-hidden="true" size={17} />
      <span>{currentLabel}</span>
    </button>
  );
}

export default UiVersionToggle;
