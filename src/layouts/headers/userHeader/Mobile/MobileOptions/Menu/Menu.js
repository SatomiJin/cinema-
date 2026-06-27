import { useTranslation } from "react-i18next";
import "./Menu.scss";
import { useNavigate } from "react-router-dom";
import {
  COUNTRY_OPTIONS,
  GENRE_OPTIONS,
  YEAR_OPTIONS,
} from "../../../../../../constants/filterOptions";
function Menu() {
  let { t } = useTranslation();
  let navigate = useNavigate();
  const handleNavigate = (path) => {
    const checkbox = document.getElementById("mobileMenuInput");
    if (checkbox) {
      checkbox.checked = false;
    }
    navigate(path);
  };

  const menuGroups = [
    { title: t("genre"), pathPrefix: "/the-loai", options: GENRE_OPTIONS },
    { title: t("country"), pathPrefix: "/quoc-gia", options: COUNTRY_OPTIONS },
    {
      title: t("releaseYear"),
      pathPrefix: "/nam",
      options: YEAR_OPTIONS.slice(0, 15),
    },
  ];

  return (
    <div className="menu-container">
      <label className="menu-text" htmlFor="mobileMenuInput">
        <i className="fa-solid fa-bars"></i>
        <span>{t("menu")}</span>
      </label>
      <div className="mobile-menu-panel">
        <div className="mobile-menu-panel_header">
          {t("menu")}
          <label className="mobile-menu-close" htmlFor="mobileMenuInput">
            <i className="fa-solid fa-xmark"></i>
          </label>
        </div>
        <div className="menu-groups">
          {menuGroups.map((group) => {
            return (
              <div className="menu-group" key={group.pathPrefix}>
                <div className="menu-group_title">{group.title}</div>
                <div className="menu-group_options">
                  {group.options.map((option) => {
                    return (
                      <button
                        className="menu-group_option"
                        key={option.slug}
                        onClick={() =>
                          handleNavigate(
                            `${group.pathPrefix}/${option.slug}/trang/1`,
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
        </div>
      </div>
    </div>
  );
}

export default Menu;
