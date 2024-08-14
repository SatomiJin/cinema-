import { useNavigate } from "react-router-dom";
import "./EpisodesComponent.scss";
import { useEffect } from "react";
function EpisodesComponent(props) {
  let navigate = useNavigate();
  const handleChangeEp = (data) => {
    navigate(`/xem-phim/${props?.slug}/${data}`);
  };

  return (
    <div className="episodes-container">
      {props?.episodes &&
        props?.episodes?.length > 0 &&
        props?.episodes
          ?.slice()
          ?.reverse()
          ?.map((item, index) => {
            return (
              <button onClick={() => handleChangeEp(item.slug)} className="btn_episode" type="button" key={index}>
                {item?.slug === "full" ? "full" : props?.episodes?.length - index}
              </button>
            );
          })}
    </div>
  );
}

export default EpisodesComponent;
