import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./SearchPcComponent.scss";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getSearchCategoryByLocation,
  getSearchCategoryQuery,
} from "../../../utils/searchScope";
function SearchPcComponent() {
  let { t } = useTranslation();
  let [searchInput, setSearchInput] = useState("");
  let [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();
  let location = useLocation();
  let searchCategory = getSearchCategoryByLocation(location);
  let containerRef = useRef(null);

  const handleChangeSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchFilmBykey = async (keywords) => {
    let searchValue = keywords.trim();

    if (!searchValue) return;

    let keywordsSearch = searchValue.split(" ").join("-");
    navigate(
      `/tim-kiem/${keywordsSearch}/trang=1${getSearchCategoryQuery(searchCategory)}`,
    );
    setSearchInput("");
    setIsOpen(false);
  };

  const toggleSearchPopup = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`search-container ${isOpen ? "open" : ""}`}
      ref={containerRef}
    >
      <button type="button" className="search-icon" onClick={toggleSearchPopup}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
      {isOpen && (
        <div className="search-popup">
          <input
            onChange={handleChangeSearch}
            className="search"
            type="text"
            placeholder={t("search")}
            value={searchInput}
            name="search"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchFilmBykey(searchInput);
              }
            }}
          />
          <button
            className="search-button"
            onClick={() => handleSearchFilmBykey(searchInput)}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchPcComponent;
