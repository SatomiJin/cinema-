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
        <div className="content-right col col-7">
          <div className="category">
            <div className="title">Phim mới</div>
            <ul className="genres">
              <li className="genre-item">Phim kinh di</li>
              <li className="genre-item">Phim kinh di</li>
              <li className="genre-item">Phim kinh di</li>
            </ul>
          </div>
          <div className="category">
            <div className="title">Phim mới</div>
            <ul className="genres">
              <li className="genre-item">Phim kinh di</li>
              <li className="genre-item">Phim kinh di</li>
              <li className="genre-item">Phim kinh di</li>
            </ul>
          </div>
          <div className="category">
            <div className="title">Phim mới</div>
            <ul className="genres">
              <li className="genre-item">Phim kinh di</li>
              <li className="genre-item">Phim kinh di</li>
              <li className="genre-item">Phim kinh di</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoMeComponent;
