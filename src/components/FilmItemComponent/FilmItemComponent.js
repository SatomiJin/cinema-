import { useEffect, useState } from "react";
import "./FilmItemComponent.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import defaultPoster from "../../assets/image/poster-film.png";
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

  const handleCardClick = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);

    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    card.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());

    setTimeout(() => goToInfo(data), 120);
  };

  const posterUrl = data && data?.poster_url ? changeUrl(data?.poster_url) : defaultPoster;

  return (
    <div className="film-item_container" onClick={handleCardClick}>
      <div className="item_wrapper">
        <div className="poster">
          <img
            className="image"
            src={posterUrl}
            alt={i18n.language === "en" ? data?.origin_name : data?.name}
            loading="lazy"
            decoding="async"
          />
          <div className="overlay"></div>
          <i className="fa-solid fa-play play-icon"></i>
        </div>
        <div className="name-info">
          <div
            className="name"
            title={i18n.language === "en" ? data?.origin_name : data?.name}
          >
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
