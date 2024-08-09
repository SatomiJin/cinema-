import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import * as FilmService from "../../../../services/FilmService";
import "./SearchTablet.scss";
import { useDebounce } from "../../../../hooks/useDebounceHook";
import SearchItemComponent from "../../../../components/SearchItemComponent/SearchItemComponent";
function SearchTM() {
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
  const clearInput = () => {
    setSearchInput("");
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
    <div className="search_tm-container">
      <div className="container">
        <div className="row">
          <div className="search_input col-10">
            <input
              onChange={(e) => handleChangeSearch(e)}
              type="text"
              value={searchInput}
              placeholder={t("search")}
              name="search_value"
            />
            <i className="fa-solid fa-magnifying-glass"></i>
            <div className="result_container" style={{ display: `${searchDebounce !== "" ? "block" : "none"}` }}>
              {searchData &&
                searchData?.length > 0 &&
                searchData?.map((item, index) => {
                  return (
                    <div className="search-item_info" key={index}>
                      <SearchItemComponent
                        setSearchInputTablet={setSearchInput}
                        filmItem={item}
                        linkImage={linkImage}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="close_button col-1">
            <label htmlFor="search_input_tm_cb" onClick={() => clearInput()}>
              <i className="fa-solid fa-close"></i>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchTM;
