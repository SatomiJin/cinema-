import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../language/language";
import "./LanguageComponent.scss";

function LanguageComponent() {
  const [language, setLanguage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const menuId = useId();
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const value = localStorage.getItem("language") || i18n.language;
    setLanguage(value);
    if (value !== i18n.language) i18n.changeLanguage(value);
  }, [i18n]);

  useEffect(() => {
    const outside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);

    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return (
    <div className="language-container" ref={ref}>
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={t("chooseLanguage")}
        className="language-trigger"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {language.toUpperCase()}
        <ChevronDown aria-hidden="true" size={14} />
      </button>
      {isOpen ? (
        <ul className="language-menu" id={menuId} role="menu">
          {LANGUAGES.map((item) => (
            <li key={item.code}>
              <button
                aria-current={language === item.code ? "true" : undefined}
                onClick={() => changeLanguage(item.code)}
                role="menuitem"
                type="button"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default LanguageComponent;
