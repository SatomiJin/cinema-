import "./SliderItem.scss";
import defaultPoster from "../../assets/image/poster-film.png";
function SliderItem(props) {
  const imageUrl =
    props?.addLink && props?.data?.thumb_url ? `${props?.addLink}/${props?.data?.thumb_url}` : defaultPoster;

  return (
    <div className="slider-item-container">
      <img
        className="poster"
        src={imageUrl}
        alt={props?.data?.name}
        loading={props?.priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={props?.priority ? "high" : "auto"}
      />
      <div className="item_info">
        <div className="name">{props?.data?.name}</div>
        <div className="year">{props?.data?.year}</div>
      </div>
    </div>
  );
}

export default SliderItem;
