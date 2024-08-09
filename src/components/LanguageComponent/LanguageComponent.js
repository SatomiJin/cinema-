import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../language/language";

import "./LanguageComponent.scss";
function LanguageComponent() {
  let [language, setLanguage] = useState("");
  let { i18n } = useTranslation();
  //   function
  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };
  //   useEffect
  useEffect(() => {
    let value = localStorage.getItem("language");
    if (value) {
      setLanguage(value);
      i18n.changeLanguage(value);
    } else {
      setLanguage(i18n.language);
      //   i18n.changeLanguage(i18n.language);
    }
  }, []);
  return (
    <div className="language-container">
      <div className="dropdown">
        <div className="language-text" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          {language}
        </div>
        <ul className="dropdown-menu" aria-labelledby="languageDropdown">
          {LANGUAGES &&
            LANGUAGES.length > 0 &&
            LANGUAGES.map((item, index) => {
              return (
                <li
                  className="dropdown-item"
                  //   value={item.code}
                  key={index}
                  onClick={() => handleChangeLanguage(item.code)}
                >
                  {item.label}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default LanguageComponent;
