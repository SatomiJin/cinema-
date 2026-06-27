import { useTranslation } from "react-i18next";

import SearchPcComponent from "../../../../components/SearchComponent/PC/SearchPcComponent";
import LanguageComponent from "../../../../components/LanguageComponent/LanguageComponent";
import DarkMode from "../../../../themes/DarkMode";
import SearchTablet from "../Search/SearchTablet";
import "./UserHeaderPc.scss";
import { useNavigate } from "react-router-dom";
import {
  COUNTRY_OPTIONS,
  GENRE_OPTIONS,
  YEAR_OPTIONS,
} from "../../../../constants/filterOptions";

function UserHeaderPc() {
  let { t } = useTranslation();
  let navigate = useNavigate();

  const dropdowns = [
    {
      label: t("genre"),
      pathPrefix: "/the-loai",
      options: GENRE_OPTIONS,
      wide: true,
    },
    {
      label: t("country"),
      pathPrefix: "/quoc-gia",
      options: COUNTRY_OPTIONS,
    },
    {
      label: t("releaseYear"),
      pathPrefix: "/nam",
      options: YEAR_OPTIONS,
      wide: true,
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="user-header-container">
      <div className="container">
        <div className="row">
          <input
            type="checkbox"
            id="search_input_tm_cb"
            className="input_search-tm"
            hidden
          />
          <div className="search_input_tm">
            <SearchTablet />
          </div>
          <nav className="filter-nav col col-lg-6 col-md-6">
            {dropdowns.map((dropdown) => {
              return (
                <div className="filter-dropdown" key={dropdown.pathPrefix}>
                  <button type="button" className="filter-trigger">
                    {dropdown.label}
                    <i className="fa-solid fa-angle-down"></i>
                  </button>
                  <div
                    className={`filter-menu ${dropdown.wide ? "filter-menu--wide" : ""}`}
                  >
                    {dropdown.options.map((option) => {
                      return (
                        <button
                          className="filter-option"
                          key={option.slug}
                          onClick={() =>
                            handleNavigate(
                              `${dropdown.pathPrefix}/${option.slug}/trang/1`,
                            )
                          }
                          type="button"
                        >
                          {option.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
          <div className="search-input col col-lg-3">
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
            <i
              onClick={() => handleNavigate("/")}
              className="fa-solid fa-house"
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeaderPc;
