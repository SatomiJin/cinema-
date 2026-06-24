import UserHeader from "../headers/userHeader/UserHeader";
import "./DefaultLayout.scss";
import { useEffect, useState } from "react";

function DefaultLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);

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
      <div className={`header ${isScrolled ? "scrolled" : ""}`}>
        <UserHeader />
      </div>
      <div className="children_container">{children}</div>
    </div>
  );
}

export default DefaultLayout;
