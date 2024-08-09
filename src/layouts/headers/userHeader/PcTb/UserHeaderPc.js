import { useTranslation } from "react-i18next";

import SearchPcComponent from "../../../../components/SearchComponent/PC/SearchPcComponent";
import LanguageComponent from "../../../../components/LanguageComponent/LanguageComponent";
import DarkMode from "../../../../themes/DarkMode";
import SearchTablet from "../Search/SearchTablet";
import "./UserHeaderPc.scss";
import { useNavigate } from "react-router-dom";

function UserHeaderPc() {
  let { t } = useTranslation();
  let navigate = useNavigate();
  const handleOnclick = (data) => {
    if (data === "series") navigate(`/phim-bo/trang/1`);
    if (data === "movie") navigate(`/phim-le/trang/1`);
    if (data === "cartoon") navigate(`/hoat-hinh/trang/1`);
    if (data === "home") navigate(`/`);
  };
  return (
    <div className="user-header-container">
      <div className="container">
        <div className="row">
          <input type="checkbox" id="search_input_tm_cb" className="input_search-tm" hidden />
          <div className="search_input_tm">
            <SearchTablet />
          </div>
          <ul className="list-item col col-lg-5 col-md-6">
            <li className="item" onClick={() => handleOnclick("series")}>
              {t("series")}
            </li>
            <li className="item" onClick={() => handleOnclick("movie")}>
              {t("movie")}
            </li>
            <li className="item" onClick={() => handleOnclick("cartoon")}>
              {t("cartoon")}
            </li>
          </ul>
          <div className="search-input col col-lg-4">
            <SearchPcComponent />
          </div>
          <div className="search-tablet col col-lg-0 col-md-3">
            <label htmlFor="search_input_tm_cb">
              <i className="fa-solid fa-magnifying-glass"></i>
            </label>
          </div>
          <div className="language col col-lg-1 col-md-1">
            <LanguageComponent />
          </div>
          <div className="theme col col-lg-1 col-md-1">
            <DarkMode />
          </div>
          <div className="user col col-lg-1 col-md-1 col-sm-1">
            <i onClick={() => handleOnclick("home")} className="fa-solid fa-house"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeaderPc;
