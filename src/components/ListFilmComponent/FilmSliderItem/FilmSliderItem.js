import { useEffect, useState } from "react";
import "./FilmSliderItem.scss";
import defaultPoster from "../../../assets/image/poster-film.png";
function FilmSliderItem(props) {
  let [data, setData] = useState({});

  useEffect(() => {
    if (props && props?.data && props?.data?.name !== "") {
      setData({ ...props?.data });
    }
  }, [props]);
  const changeUrl = (url) => {
    let splitUrl = url.split("/");
    let testUrl = splitUrl?.some((item) => item === "phimimg.com");
    if (testUrl) return url;
    if (!testUrl) return `https://img.phimapi.com/${url}`;
  };
  const posterUrl = data && data?.poster_url ? changeUrl(data?.poster_url) : defaultPoster;

  return (
    <div className="slider-film-container">
      <div className="slider-item_poster">
        <img
          className="image"
          src={posterUrl}
          alt={data?.name}
          loading="lazy"
          decoding="async"
        />
        <div className="play_hover">
          <i className="fa-solid fa-caret-right"></i>
        </div>
      </div>
      <div className="slider-item_info">
        <div className="name">{data?.name}</div>
        <div className="original_name">{data?.episodeName || data?.origin_name}</div>
      </div>
    </div>
  );
}

export default FilmSliderItem;
