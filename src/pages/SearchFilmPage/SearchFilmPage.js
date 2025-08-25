import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { FilmContext } from "../../context/filmContext";
import SearchFilmPc from "../../components/SearchFilmComponent/PcTablet/SearchFIlmPc";
import * as FilmService from "../../services/FilmService";
import "./SearchFilmPage.scss";
import { useTranslation } from "react-i18next";
function SearchFilmPage() {
  let [searchDataFilm, setSearchDataFilm] = useState([]);
  const { searchLoading, setSearchLoading } = useContext(FilmContext);

  let location = useLocation();
  let { t } = useTranslation();

  let originKeyword = decodeURIComponent(location?.pathname?.split("/")[2]);
  let originPage = location?.pathname?.split("/")[3].split("=")[1];

  let searchKeyword = originKeyword.split("-").join(" ");

  const searchFilmData = async (keyword, limit) => {
    setSearchLoading(true);
    const res = await FilmService.searchFilm(keyword, limit, originPage);

    if (res && res.status === "success" && res?.data.items) {
      setSearchDataFilm({ ...res?.data });
      setSearchLoading(false);
    } else {
      setSearchDataFilm([]);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    searchFilmData(searchKeyword);
  }, [searchKeyword, location]);

  return (
    <div className="search-film-page_container">
      <div className="search-film-page_content container">
        <div className="search-title">
          {t("keywordSearch")}: {`${searchKeyword}`}
        </div>
        <SearchFilmPc
          data={
            searchDataFilm && searchDataFilm?.items?.length > 0
              ? searchDataFilm.items
              : []
          }
          pagination={searchDataFilm?.params?.pagination}
          searchKey={originKeyword}
        />
      </div>
    </div>
  );
}

export default SearchFilmPage;
