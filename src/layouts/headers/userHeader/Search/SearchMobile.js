import { useTranslation } from "react-i18next";
import { useDebounce } from "../../../../hooks/useDebounceHook";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as FilmService from "../../../../services/FilmService";
import SearchItemComponent from "../../../../components/SearchItemComponent/SearchItemComponent";
import "./SearchMobile.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { getSearchCategoryByLocation, getSearchCategoryQuery } from "../../../../utils/searchScope";
function SearchMobile() {
  let { t } = useTranslation();
  let [searchInput, setSearchInput] = useState("");
  let [searchData, setSearchData] = useState([]);
  let [linkImage, setLinkImage] = useState("");
  let searchDebounce = useDebounce(searchInput, 500);
  let navigate = useNavigate();
  let location = useLocation();
  let searchCategory = getSearchCategoryByLocation(location);
  const handleChangeSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleGetFilmSearch = async (context) => {
    const limit = context && context.queryKey && context.queryKey[1];
    const search = context && context.queryKey && context.queryKey[2];
    const category = context && context.queryKey && context.queryKey[3];
    let res = await FilmService.searchFilm(search, limit, 1, { category });
    return res;
  };
  const clearInput = () => {
    setSearchInput("");
  };
  const handleSearchFilmBykey = (keywords) => {
    let searchValue = keywords.trim();

    if (!searchValue) return;

    let keywordsSearch = searchValue.split(" ").join("-");
    navigate(`/tim-kiem/${keywordsSearch}/trang=1${getSearchCategoryQuery(searchCategory)}`);
    setSearchInput("");
  };
  const { data } = useQuery({
    queryKey: ["film", 10, searchDebounce, searchCategory],
    queryFn: handleGetFilmSearch,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });
  // useEffect
  useEffect(() => {
    if (data && data?.status === "success") {
      setSearchData(data?.data?.items || []);
      setLinkImage(data?.data?.APP_DOMAIN_CDN_IMAGE);
    }
  }, [data]);
  return (
    <div className="search-mobile-container">
      <div className="container">
        <div className="row">
          <div className="input_wrapper col col-10">
            <input
              onChange={(e) => handleChangeSearch(e)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchFilmBykey(searchInput);
                }
              }}
              type="text"
              value={searchInput}
              className="input_search-mobile"
              placeholder={t("search")}
            />

            <i
              className="fa-solid fa-magnifying-glass"
              onClick={() => handleSearchFilmBykey(searchInput)}
            ></i>
            <div className="search-result" style={{ display: `${searchDebounce !== "" ? "block" : "none"}` }}>
              {searchData &&
                searchData?.length > 0 &&
                searchData?.map((item, index) => {
                  return (
                    <div className="search-item_info" key={index}>
                      <SearchItemComponent
                        setSearchInputMobile={setSearchInput}
                        filmItem={item}
                        linkImage={linkImage}
                      />
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="close_button-mobile col col-1">
            <label htmlFor="searchInput_mobile" onClick={() => clearInput()}>
              <i className="fa-solid fa-close"></i>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMobile;
