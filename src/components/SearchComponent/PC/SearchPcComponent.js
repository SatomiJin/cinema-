import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./SearchPcComponent.scss";
import { useNavigate } from "react-router-dom";
function SearchPcComponent() {
  let { t } = useTranslation();
  let [searchInput, setSearchInput] = useState("");
  let navigate = useNavigate();
  const handleChangeSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchFilmBykey = async (keywords) => {
    let keywordsSearch = keywords.split(" ").join("-");
    navigate(`/tim-kiem/${keywordsSearch}/trang=1`);
    setSearchInput("");
  };

  return (
    <div className="search-container">
      <div className="search-input">
        <input
          onChange={(e) => handleChangeSearch(e)}
          className="search"
          type="text"
          placeholder={t("search")}
          value={searchInput}
          name="search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchFilmBykey(searchInput);
            }
          }}
        />
        <button className="search-button">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        {/* <div
          style={{ display: `${searchDebounce !== "" ? "block" : "none"}` }}
          className="result_container"
        >
          {searchData &&
            searchData?.length > 0 &&
            searchData?.map((item, index) => {
              return (
                <div className="search-item_info" key={index}>
                  <SearchItemComponent
                    setSearchInputPC={setSearchInput}
                    filmItem={item}
                    linkImage={linkImage}
                  />
                </div>
              );
            })}
        </div> */}
      </div>
    </div>
  );
}

export default SearchPcComponent;
