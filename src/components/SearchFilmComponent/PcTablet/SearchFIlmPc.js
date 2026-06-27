import { useContext, useEffect, useState } from "react";
import "./SearchFilmPc.scss";
import FilmItemComponent from "../../FilmItemComponent/FilmItemComponent";
import Pagination from "rc-pagination";
import { useNavigate } from "react-router-dom";
import DotLoading from "../../LoadingComponent/DotLoading";
import { FilmContext } from "../../../context/filmContext";
function SearchFilmPc(props) {
  let [listFilm, setListFilm] = useState({});
  let [pageSize, setPageSize] = useState(10);
  let totalItems = props?.pagination?.totalItems || 0; // Tổng số mục
  let { searchLoading } = useContext(FilmContext);

  const [current, setCurrent] = useState(1);
  let navigate = useNavigate();
  const onChange = (page, pageSize) => {
    setCurrent(page);
    setPageSize(10);
    navigate(
      `/tim-kiem/${props?.searchKey}/trang=${page}${
        props?.searchCategory ? `?category=${props.searchCategory}` : ""
      }`
    );
  };
  useEffect(() => {
    if (props && props?.data && props?.data?.length > 0) {
      setListFilm([...props?.data]);
    } else {
      setListFilm([]);
    }
  }, [props]);

  return (
    <div className="search-film-pc_container row">
      <div className="search_content">
        {searchLoading ? (
          <DotLoading />
        ) : listFilm && listFilm.length > 0 ? (
          listFilm.map((item, index) => {
            return <FilmItemComponent dataFilm={item} key={index} />;
          })
        ) : (
          <p>No films found.</p>
        )}
      </div>
      {!searchLoading && listFilm && listFilm.length > 0 && (
        <div className="pagination">
          <Pagination
            onChange={onChange}
            current={current}
            total={totalItems}
            pageSize={pageSize}
            pageSizeOptions={["10", "20", "30"]}
          />
        </div>
      )}
    </div>
  );
}

export default SearchFilmPc;
