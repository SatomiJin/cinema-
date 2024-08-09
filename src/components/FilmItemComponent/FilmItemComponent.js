import { useEffect, useState } from "react";
import "./FilmItemComponent.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
function FilmItemComponent(props) {
  // "https://phimimg.com"
  let [data, setData] = useState({});
  let { i18n } = useTranslation();
  let navigate = useNavigate();
  useEffect(() => {
    if (props && props?.dataFilm) {
      setData({ ...props?.dataFilm });
    }
  }, [props]);
  const changeUrl = (url) => {
    let splitUrl = url?.split("/");
    let testUrl = splitUrl?.some((item) => item === "phimimg.com");
    if (testUrl) return url;
    if (!testUrl) return `https://phimimg.com/${url}`;
  };

  const goToInfo = (data) => {
    // console.log(data);
    navigate(`/${data?.type}/${data?.slug}`);
  };
  return (
    <div className="film-item_container" onClick={() => goToInfo(data)}>
      <div className="item_wrapper">
        <div className="poster">
          <div
            className="image"
            style={{ backgroundImage: `url("${data && data?.poster_url && changeUrl(data?.poster_url)}")` }}
          ></div>
          <div className="overlay"></div>
          <i className="fa-solid fa-play play-icon"></i>
        </div>
        <div className="name-info">
          <div className="name" title={i18n.language === "en" ? data?.origin_name : data?.name}>
            {i18n.language === "en" ? data?.origin_name : data?.name}
          </div>
          <div className="origin_name" title={data?.origin_name}>
            {data?.origin_name}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilmItemComponent;
