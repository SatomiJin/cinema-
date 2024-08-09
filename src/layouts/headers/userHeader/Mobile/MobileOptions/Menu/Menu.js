import { useTranslation } from "react-i18next";
import "./Menu.scss";
import { useNavigate } from "react-router-dom";
function Menu() {
  let { t } = useTranslation();
  let navigate = useNavigate();
  const handleOnclick = (data) => {
    if (data === "series") navigate(`/phim-bo/trang/1`);
    if (data === "movie") navigate(`/phim-le/trang/1`);
    if (data === "cartoon") navigate(`/hoat-hinh/trang/1`);
  };
  return (
    <div className="menu-container">
      <div className="dropdown">
        <div className="menu-text dropdown-toggle" id="mobileMenu" data-bs-toggle="dropdown" aria-expanded="false">
          {t("menu")}
        </div>
        <ul className="dropdown-menu" aria-labelledby="mobileMenu">
          <li className="dropdown-item" onClick={() => handleOnclick("series")}>
            {t("series")}
          </li>
          <li className="dropdown-item" onClick={() => handleOnclick("movie")}>
            {t("movie")}
          </li>
          <li className="dropdown-item" onClick={() => handleOnclick("cartoon")}>
            {t("cartoon")}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
