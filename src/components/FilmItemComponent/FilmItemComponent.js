import "./FilmItemComponent.scss";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getImageUrl, handleImageError } from "../../utils/imageUrl";

function FilmItemComponent(props) {
  const data = props?.dataFilm || {};
  const { i18n } = useTranslation();

  const posterUrl = getImageUrl(data?.poster_url);
  const displayName = i18n.language === "en" ? data?.origin_name : data?.name;

  return (
    <Link
      className="film-item_container"
      to={`/${data?.type}/${data?.slug}`}
      aria-label={displayName}
    >
      <div className="item_wrapper">
        <div className="poster">
          <img
            className="image"
            src={posterUrl}
            alt={displayName || data?.origin_name || ""}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
          <div className="overlay"></div>
          <i className="fa-solid fa-play play-icon"></i>
        </div>
        <div className="name-info">
          <div
            className="name"
            title={displayName}
          >
            {displayName}
          </div>
          <div className="origin_name" title={data?.origin_name}>
            {data?.origin_name}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default FilmItemComponent;
