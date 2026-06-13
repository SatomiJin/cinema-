import { useTranslation } from "react-i18next";
import "./ListFilmComponent.scss";
import ListFilmSlider from "./ListFilmSlider/ListFilmSlider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function ListFilmComponent(props) {
  let { t } = useTranslation();
  let [data, setData] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    if (props && props?.data && props?.data?.length > 0) {
      setData(props);
    }
  }, [props]);

  const handleSeeMore = () => {
    if (props?.path) navigate(props.path);
  };

  return (
    <div className="list-film-container">
      <div className="row">
        <div className="content-top col-12">
          <div className="content-top_title">{data?.name}</div>
          <div className="content-top_buttons">
            <button type="button" className="btn btn-primary see-more" onClick={handleSeeMore}>
              {t("seeMore")}
            </button>
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
