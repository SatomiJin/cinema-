import { useEffect, useRef, useState } from "react";
import { ChevronDown, Home, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SearchPcComponent from "../../../../components/SearchComponent/PC/SearchPcComponent";
import LanguageComponent from "../../../../components/LanguageComponent/LanguageComponent";
import DarkMode from "../../../../themes/DarkMode";
import SearchTablet from "../Search/SearchTablet";
import { COUNTRY_OPTIONS, GENRE_OPTIONS, YEAR_OPTIONS } from "../../../../constants/filterOptions";
import UiVersionToggle from "../../../../components/ui/UiVersionToggle";
import "./UserHeaderPc.scss";

function UserHeaderPc() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [isTabletSearchOpen, setTabletSearchOpen] = useState(false);
  const navRef = useRef(null);

  const dropdowns = [
    { label: t("genre"), pathPrefix: "/the-loai", options: GENRE_OPTIONS, wide: true },
    { label: t("country"), pathPrefix: "/quoc-gia", options: COUNTRY_OPTIONS },
    { label: t("releaseYear"), pathPrefix: "/nam", options: YEAR_OPTIONS, wide: true },
  ];

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) setOpenMenu(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setTabletSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleNavigate = (path) => {
    setOpenMenu(null);
    navigate(path);
  };

  return (
    <div className="user-header-container">
      <div className="container">
        <div className="row">
          <button className="brand-mark" type="button" onClick={() => navigate("/")} aria-label="Satomi Movie home">
            <span className="brand-mark__frame" aria-hidden="true">S</span>
            <span><strong>Satomi</strong> Movie</span>
          </button>
          <nav className="filter-nav" aria-label="Movie filters" ref={navRef}>
            {dropdowns.map((dropdown) => {
              const menuId = `filter-${dropdown.pathPrefix.replace("/", "")}`;
              const isOpen = openMenu === dropdown.pathPrefix;
              return (
                <div className="filter-dropdown" key={dropdown.pathPrefix}>
                  <button type="button" className="filter-trigger" aria-expanded={isOpen} aria-controls={menuId} onClick={() => setOpenMenu(isOpen ? null : dropdown.pathPrefix)}>
                    {dropdown.label}<ChevronDown aria-hidden="true" size={15} />
                  </button>
                  <div id={menuId} className={`filter-menu ${dropdown.wide ? "filter-menu--wide" : ""} ${isOpen ? "is-open" : ""}`}>
                    {dropdown.options.map((option) => (
                      <button className="filter-option" key={option.slug} onClick={() => handleNavigate(`${dropdown.pathPrefix}/${option.slug}/trang/1`)} type="button">{option.name}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
          <div className="header-actions">
            <div className="search-input"><SearchPcComponent /></div>
            <div className="search-tablet">
              <button type="button" aria-label="Open search" aria-expanded={isTabletSearchOpen} onClick={() => setTabletSearchOpen(true)}><Search aria-hidden="true" size={19} /></button>
            </div>
            <div className="language"><LanguageComponent /></div>
            <div className="theme"><DarkMode /></div>
            <UiVersionToggle />
            <button className="home-control classic-home-control" type="button" onClick={() => navigate("/")} aria-label="Satomi Movie home"><Home aria-hidden="true" size={19} /></button>
          </div>
          {isTabletSearchOpen && <SearchTablet onClose={() => setTabletSearchOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

export default UserHeaderPc;
