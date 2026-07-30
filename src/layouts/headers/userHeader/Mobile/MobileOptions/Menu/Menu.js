import { useEffect, useRef } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { COUNTRY_OPTIONS, GENRE_OPTIONS, YEAR_OPTIONS } from "../../../../../../constants/filterOptions";
import "./Menu.scss";

function Menu({ isOpen, onOpenChange }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const triggerRef = useRef(null);
  const menuGroups = [
    { title: t("genre"), pathPrefix: "/the-loai", options: GENRE_OPTIONS },
    { title: t("country"), pathPrefix: "/quoc-gia", options: COUNTRY_OPTIONS },
    { title: t("releaseYear"), pathPrefix: "/nam", options: YEAR_OPTIONS.slice(0, 15) },
  ];
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onOpenChange]);
  const handleNavigate = (path) => {
    onOpenChange(false);
    navigate(path);
  };
  return (
    <div className="menu-container">
      <button ref={triggerRef} className="menu-trigger" type="button" aria-label="Open movie filters" aria-expanded={isOpen} aria-controls="mobile-filter-sheet" onClick={() => onOpenChange(!isOpen)}><MenuIcon aria-hidden="true" size={21} /><span>{t("menu")}</span></button>
      {isOpen && <div className="mobile-menu-backdrop" onClick={() => onOpenChange(false)} aria-hidden="true" />}
      {isOpen && <section id="mobile-filter-sheet" className="mobile-menu-panel is-open" aria-label="Movie filters">
        <header className="mobile-menu-panel_header"><span>{t("menu")}</span><button className="mobile-menu-close" type="button" aria-label="Close movie filters" onClick={() => onOpenChange(false)}><X aria-hidden="true" size={20} /></button></header>
        <div className="menu-groups">{menuGroups.map((group) => <section className="menu-group" key={group.pathPrefix}><h2 className="menu-group_title">{group.title}</h2><div className="menu-group_options">{group.options.map((option) => <button className="menu-group_option" key={option.slug} onClick={() => handleNavigate(`${group.pathPrefix}/${option.slug}/trang/1`)} type="button">{option.name}</button>)}</div></section>)}</div>
      </section>}
    </div>
  );
}
export default Menu;
