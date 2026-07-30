import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "rc-pagination";

import "./FilmSeriesMobile.scss";
import FilmItemComponent from "../../FilmItemComponent/FilmItemComponent";
import { useTranslation } from "react-i18next";

function FilmSeriesMobile(props) {
  let [listFilm, setListFilm] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = props?.pagination?.totalItems; // Tổng số mục
  let { t } = useTranslation();
  const [current, setCurrent] = useState(props?.pageCurrent);
  let navigate = useNavigate();
  useEffect(() => {
    setListFilm(props?.data?.length > 0 ? [...props.data] : []);
    setCurrent(props?.pageCurrent);
  }, [props]);
  const onChange = (page, pageSize) => {
    setCurrent(page);
    setPageSize(10);
    navigate(`/phim-bo/trang/${page}`);
  };
  return (
    <div className="series-mobile_container">
      <div className="container">
        <div className="row">
          <header className="title col col-12"><span className="discovery-kicker">{t("movieArchive")}</span><h1>{t("listSeries")}</h1></header>
          {listFilm.length > 0 ? <><div className="list-film col col-12">
            {listFilm.map((item, index) => <FilmItemComponent dataFilm={item} key={index} />)}
          </div><div className="pagination col col-12">
            <Pagination
              aria-label="Series pages"
              onChange={onChange}
              current={current}
              total={totalItems}
              pageSize={pageSize}
              // pageSizeOptions={["10", "20", "30"]}
            />
          </div></> : <p className="discovery-empty col col-12" role="status">{t("noData")}</p>}
        </div>
      </div>
    </div>
  );
}

export default FilmSeriesMobile;
