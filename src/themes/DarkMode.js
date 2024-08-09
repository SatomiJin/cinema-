import { useEffect, useState } from "react";
import dark from "../assets/image/dark-mode.png";
import light from "../assets/image/light-mode.png";
import "./DarkMode.scss";
function DarkMode() {
  let [theme, setTheme] = useState("light");

  // function
  const setDarkMode = () => {
    setTheme("dark");
    document.querySelector("body").setAttribute(`data-theme`, "dark");
    localStorage.setItem("theme", "dark");
  };
  const setLightMode = () => {
    setTheme("light");
    document.querySelector("body").setAttribute(`data-theme`, "light");
    localStorage.setItem("theme", "light");
  };
  const toggleMode = () => {
    if (theme === "light") setDarkMode();
    else setLightMode();
  };
  //useEffect
  useEffect(() => {
    let themeStorage = localStorage.getItem("theme");
    if (themeStorage) {
      if (themeStorage === "light") setLightMode();
      else setDarkMode();
    } else {
      document.querySelector("body").setAttribute(`data-theme`, "light");
    }
  }, []);
  return (
    <div className="dark-mode-container">
      <button className="theme-button" type="button" onClick={() => toggleMode()}>
        <img src={theme === "light" ? dark : light} alt="themeMode" />
      </button>
    </div>
  );
}

export default DarkMode;
