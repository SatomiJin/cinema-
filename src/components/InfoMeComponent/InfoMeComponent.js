import { useTranslation } from "react-i18next";
import "./InfoMeComponent.scss";
function InfoMeComponent() {
  let { t } = useTranslation();
  return (
    <div className="info-me-container">
      <div className="row">
        <div className="content-left col col-5">
          <div className="logo"></div>
          <div className="information">
            <a href="https://portfolio.satomijin.id.vn/">Satomi Jin</a> - <span className="info">{t("intro")}</span>
          </div>
        </div>
        <div className="content-right col col-7"></div>
      </div>
    </div>
  );
}

export default InfoMeComponent;
