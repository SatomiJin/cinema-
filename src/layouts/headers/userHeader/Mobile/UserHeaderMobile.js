import { useState } from "react";
import { Home, Search } from "lucide-react";
import SearchMobile from "../Search/SearchMobile";
import Menu from "./MobileOptions/Menu/Menu";
import DarkMode from "../../../../themes/DarkMode";
import LanguageComponent from "../../../../components/LanguageComponent/LanguageComponent";
import "./UserHeaderMobile.scss";
import { useNavigate } from "react-router-dom";
import UiVersionToggle from "../../../../components/ui/UiVersionToggle";

function UserHeaderMobile() {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  return (
    <div className="header-mobile-container">
      <div className="container"><div className="row">
        <Menu isOpen={isMenuOpen} onOpenChange={setMenuOpen} />
        <button className="mobile-brand" type="button" onClick={() => navigate("/")} aria-label="Satomi Movie home"><span aria-hidden="true">S</span>Satomi</button>
        <div className="mobile-header-actions">
          <button className="mobile-control" type="button" aria-label="Open search" aria-expanded={isSearchOpen} onClick={() => { setMenuOpen(false); setSearchOpen(true); }}><Search aria-hidden="true" size={20} /></button>
          <div className="theme"><DarkMode /></div>
          <div className="language"><LanguageComponent /></div>
          <UiVersionToggle compact />
          <button className="mobile-control classic-home-control" type="button" onClick={() => navigate("/")} aria-label="Satomi Movie home"><Home aria-hidden="true" size={20} /></button>
        </div>
        {isSearchOpen && <SearchMobile onClose={() => setSearchOpen(false)} />}
      </div></div>
    </div>
  );
}

export default UserHeaderMobile;
