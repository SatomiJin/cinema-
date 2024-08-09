import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../../hooks/useDebounceHook";
import * as FilmService from "../../../services/FilmService";
import "./SearchPcComponent.scss";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import SearchItemComponent from "../../SearchItemComponent/SearchItemComponent";
function SearchPcComponent() {
  let { t } = useTranslation();
  let [searchInput, setSearchInput] = useState("");
  let [searchData, setSearchData] = useState([]);
  let [linkImage, setLinkImage] = useState("");
  let searchDebounce = useDebounce(searchInput, 500);
  const handleChangeSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleGetFilmSearch = async (context) => {
    const limit = context && context.queryKey && context.queryKey[1];
    const search = context && context.queryKey && context.queryKey[2];
    let res = await FilmService.searchFilm(search, limit);
    return res;
  };
  const { data } = useQuery({
    queryKey: ["film", 10, searchDebounce],
    queryFn: handleGetFilmSearch,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });
  // useEffect
  useEffect(() => {
    if (data && data?.status === "success") {
      setSearchData([...data?.data?.items]);
      setLinkImage(data?.data?.APP_DOMAIN_CDN_IMAGE);
    }
  }, [data]);
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
        />
        <button className="search-button">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <div style={{ display: `${searchDebounce !== "" ? "block" : "none"}` }} className="result_container">
          {searchData &&
            searchData?.length > 0 &&
            searchData?.map((item, index) => {
              return (
                <div className="search-item_info" key={index}>
                  <SearchItemComponent setSearchInputPC={setSearchInput} filmItem={item} linkImage={linkImage} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default SearchPcComponent;
