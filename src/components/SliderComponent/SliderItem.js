import "./SliderItem.scss";
function SliderItem(props) {
  return (
    <div className="slider-item-container">
      <div className="poster" style={{ backgroundImage: `url(${props?.addLink}/${props?.data?.thumb_url})` }}></div>
      <div className="item_info">
        <div className="name">{props?.data.name}</div>
        <div className="year">{props?.data.year}</div>
      </div>
    </div>
  );
}

export default SliderItem;
