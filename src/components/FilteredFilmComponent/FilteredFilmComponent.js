import { useEffect, useState } from "react";
import Pagination from "rc-pagination";
import { useNavigate } from "react-router-dom";
import FilmItemComponent from "../FilmItemComponent/FilmItemComponent";
import DotLoading from "../LoadingComponent/DotLoading";
import "../FilmSeriesComponent/PcTablet/FilmSeriesPcTablet.scss";

function FilteredFilmComponent(props) {
  let [listFilm, setListFilm] = useState([]);
  let [pageSize, setPageSize] = useState(10);
  let [current, setCurrent] = useState(props?.pageCurrent);
  let navigate = useNavigate();
  let totalItems = props?.pagination?.totalItems;

  useEffect(() => {
    if (props?.data && props?.data.length > 0) {
      setListFilm([...props.data]);
    } else {
      setListFilm([]);
    }

    setCurrent(props?.pageCurrent);
  }, [props]);

  const onChange = (page) => {
    setCurrent(page);
    setPageSize(10);
    navigate(`${props?.basePath}/trang/${page}`);
  };

  return (
    <div className="series-pc_container">
      <div className="container">
        <div className="row">
          <div className="title col col-12">{props?.title}</div>
          {props?.loading ? (
            <div className="loading-component">
              <DotLoading />
            </div>
          ) : listFilm && listFilm.length > 0 ? (
            <>
              <div className="list-film col col-12">
                {listFilm.map((item, index) => {
                  return <FilmItemComponent dataFilm={item} key={index} />;
                })}
              </div>
              <div className="pagination col col-12">
                <Pagination
                  onChange={onChange}
                  current={current}
                  total={totalItems}
                  pageSize={pageSize}
                  pageSizeOptions={["10", "20", "30"]}
                />
              </div>
            </>
          ) : (
            <p>{props?.emptyText}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilteredFilmComponent;
