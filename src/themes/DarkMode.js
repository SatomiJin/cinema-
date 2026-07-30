import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./DarkMode.scss";
function DarkMode() {
  const [theme, setTheme] = useState("light");
  const { t } = useTranslation();
  const applyTheme = (nextTheme) => { setTheme(nextTheme); document.documentElement.setAttribute("data-theme", nextTheme); localStorage.setItem("theme", nextTheme); };
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const bootTheme = document.documentElement.getAttribute("data-theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = storedTheme || bootTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);
  const isLight = theme === "light";
  const nextThemeLabel = isLight ? t("darkMode", { defaultValue: "Switch to dark theme" }) : t("lightMode", { defaultValue: "Switch to light theme" });
  return <div className="dark-mode-container"><button className="theme-button" type="button" onClick={() => applyTheme(isLight ? "dark" : "light")} aria-label={nextThemeLabel} title={nextThemeLabel}>{isLight ? <Moon aria-hidden="true" size={19} /> : <Sun aria-hidden="true" size={19} />}</button></div>;
}
export default DarkMode;
