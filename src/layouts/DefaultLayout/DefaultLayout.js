import UserHeader from "../headers/userHeader/UserHeader";
import BackToTop from "../../components/ui/BackToTop";
import "./DefaultLayout.scss";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function DefaultLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="layout-container">
      <a className="skip-link" href="#main-content">{t("skipToContent")}</a>
      <div className={`header ${isScrolled ? "scrolled" : ""}`}>
        <UserHeader />
      </div>
      <main id="main-content" className="children_container">{children}</main>
      <BackToTop />
    </div>
  );
}

export default DefaultLayout;
