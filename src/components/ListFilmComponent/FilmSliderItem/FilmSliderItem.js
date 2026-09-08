import "./FilmSliderItem.scss";
import { getImageUrl, handleImageError } from "../../../utils/imageUrl";

function FilmSliderItem(props) {
  const data = props?.data || {};

  const posterUrl = getImageUrl(data?.poster_url);

  return (
    <div className="slider-film-container">
      <div className="slider-item_poster">
        <img
          className="image"
          src={posterUrl}
          alt={data?.name}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
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
