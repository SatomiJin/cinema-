import { useLocation } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";

import { FilmContext } from "../../context/filmContext";
import SearchFilmPc from "../../components/SearchFilmComponent/PcTablet/SearchFIlmPc";
import SearchFilmMobile from "../../components/SearchFilmComponent/Mobile/SearchFilmMobile";
import * as FilmService from "../../services/FilmService";
import "./SearchFilmPage.scss";
import { useTranslation } from "react-i18next";
import { SEARCH_CATEGORY_QUERY_KEY } from "../../utils/searchScope";
function SearchFilmPage() {
  let [searchDataFilm, setSearchDataFilm] = useState([]);
  const { setSearchLoading } = useContext(FilmContext);

  let location = useLocation();
  let { t } = useTranslation();

  let originKeyword = decodeURIComponent(location?.pathname?.split("/")[2]);
  let originPage = location?.pathname?.split("/")[3].split("=")[1];
  let searchParams = new URLSearchParams(location.search);
  let searchCategory = searchParams.get(SEARCH_CATEGORY_QUERY_KEY) || "";

  let searchKeyword = originKeyword.split("-").join(" ");

  const searchFilmData = useCallback(
    async (keyword) => {
      setSearchLoading(true);
      const res = await FilmService.searchFilm(keyword, 10, originPage, {
        category: searchCategory,
      });

      if (res && res.status === "success" && res?.data.items) {
        setSearchDataFilm({ ...res?.data });
        setSearchLoading(false);
      } else {
        setSearchDataFilm([]);
        setSearchLoading(false);
      }
    },
    [originPage, searchCategory, setSearchLoading]
  );

  useEffect(() => {
    searchFilmData(searchKeyword);
  }, [searchFilmData, searchKeyword]);

  return (
    <div className="search-film-page_container">
      <div className="search-film-page_content container">
        <div className="search-title">
          {t("keywordSearch")}: {`${searchKeyword}`}
          {searchCategory ? ` (${searchCategory})` : ""}
        </div>
        <div className="search-film-pc">
          <SearchFilmPc
            data={
              searchDataFilm && searchDataFilm?.items?.length > 0
                ? searchDataFilm.items
                : []
            }
            pagination={searchDataFilm?.params?.pagination}
            searchKey={originKeyword}
            searchCategory={searchCategory}
          />
        </div>
        <div className="search-film-mobile">
          <SearchFilmMobile
            data={
              searchDataFilm && searchDataFilm?.items?.length > 0
                ? searchDataFilm.items
                : []
            }
            pagination={searchDataFilm?.params?.pagination}
            searchKey={originKeyword}
            pageCurrent={originPage}
            searchCategory={searchCategory}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchFilmPage;
