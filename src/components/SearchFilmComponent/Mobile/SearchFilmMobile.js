import { useContext, useEffect, useState } from "react";
import Pagination from "rc-pagination";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { FilmContext } from "../../../context/filmContext";
import DotLoading from "../../LoadingComponent/DotLoading";
import FilmItemComponent from "../../FilmItemComponent/FilmItemComponent";
import "./SearchFilmMobile.scss";

function SearchFilmMobile(props) {
  let [listFilm, setListFilm] = useState([]);
  let [pageSize, setPageSize] = useState(10);
  let totalItems = props?.pagination?.totalItems || 0;
  let currentPage = Number(props?.pageCurrent) || 1;
  let { searchLoading } = useContext(FilmContext);
  let { t } = useTranslation();
  let navigate = useNavigate();

  const onChange = (page) => {
    setPageSize(10);
    navigate(
      `/tim-kiem/${props?.searchKey}/trang=${page}${
        props?.searchCategory ? `?category=${props.searchCategory}` : ""
      }`
    );
  };

  useEffect(() => {
    if (props?.data && props?.data?.length > 0) {
      setListFilm([...props.data]);
    } else {
      setListFilm([]);
    }
  }, [props]);

  return (
    <div className="search-film-mobile_container">
      <div className="container">
        <div className="row">
          <div className="search_content col col-12">
            {searchLoading ? (
              <DotLoading />
            ) : listFilm && listFilm.length > 0 ? (
              listFilm.map((item, index) => {
                return <FilmItemComponent dataFilm={item} key={index} />;
              })
            ) : (
              <p className="discovery-empty" role="status">{t("noData")}</p>
            )}
          </div>
          {!searchLoading && listFilm && listFilm.length > 0 && (
            <div className="pagination col col-12">
              <Pagination
                aria-label="Search results pages"
                onChange={onChange}
                current={currentPage}
                total={totalItems}
                pageSize={pageSize}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchFilmMobile;
