import SearchMobile from "../Search/SearchMobile";
import Menu from "./MobileOptions/Menu/Menu";
import DarkMode from "../../../../themes/DarkMode";
import LanguageComponent from "../../../../components/LanguageComponent/LanguageComponent";
import "./UserHeaderMobile.scss";

function UserHeaderMobile() {
  return (
    <div className="header-mobile-container">
      <div className="container">
        <div className="row">
          <input hidden type="checkbox" id="searchInput_mobile" className="input_search-mobile" />
          <div className="search_mobile_input">
            <SearchMobile />
          </div>
          <div className="menu col col-4">
            <Menu />
          </div>
          <div className="search col col-2">
            <label htmlFor="searchInput_mobile">
              <i className="fa-solid fa-magnifying-glass"></i>
            </label>
          </div>
          <div className="theme col col-2">
            <DarkMode />
          </div>
          <div className="language col col-2">
            <LanguageComponent />
          </div>
          <div className="user col col-2">
            <i className="fa-regular fa-user"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeaderMobile;
