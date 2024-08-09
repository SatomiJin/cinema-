import { useTranslation } from "react-i18next";
import "./ListFilmComponent.scss";
import ListFilmSlider from "./ListFilmSlider/ListFilmSlider";
import { useEffect, useState } from "react";
function ListFilmComponent(props) {
  let { t } = useTranslation();
  let [data, setData] = useState([]);

  useEffect(() => {
    if (props && props?.data && props?.data?.length > 0) {
      setData(props);
    }
  }, [props]);
  return (
    <div className="list-film-container">
      <div className="row">
        <div className="content-top col-12">
          <div className="content-top_title">{data?.name}</div>
          <div className="content-top_buttons">
            <button type="button" className="btn btn-primary see-more">
              {t("seeMore")}
            </button>
            {/* <i className="fa-solid fa-caret-left"></i>
            <i className="fa-solid fa-caret-right"></i> */}
          </div>
        </div>
        <div className="content-bottom">
          <ListFilmSlider listFilm={data?.data} />
        </div>
      </div>
    </div>
  );
}

export default ListFilmComponent;
