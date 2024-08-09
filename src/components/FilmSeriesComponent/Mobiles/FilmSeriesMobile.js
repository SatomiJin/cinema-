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
    if (props?.data && props?.data.length > 0) {
      setListFilm([...props?.data]);
    }
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
          <div className="title col col-12">{t("listSeries")}</div>
          <div className="list-film col col-12">
            {listFilm &&
              listFilm?.length > 0 &&
              listFilm.map((item, index) => {
                return <FilmItemComponent dataFilm={item} key={index} />;
              })}
          </div>
          <div className="pagination col col-12">
            <Pagination
              onChange={onChange}
              current={current}
              total={totalItems}
              pageSize={pageSize}
              // pageSizeOptions={["10", "20", "30"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilmSeriesMobile;
