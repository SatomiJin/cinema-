import { useNavigate } from "react-router-dom";
import "./EpisodesComponent.scss";
function EpisodesComponent(props) {
  let navigate = useNavigate();
  const handleChangeEp = (data) => {
    navigate(`/xem-phim/${props?.slug}/${data}`);
  };

  const episodes = props?.episodes || [];

  return (
    <div className="episodes-container" aria-label="Episode selector">
      {episodes.length > 0 &&
        episodes
          .slice()
          .reverse()
          .map((item, index) => {
            const label = item?.slug === "full" ? "full" : episodes.length - index;
            const isActive = item?.slug === props?.activeEpisode;

            return (
              <button
                aria-current={isActive ? "true" : undefined}
                aria-label={isActive ? `Currently watching episode ${label}` : `Watch episode ${label}`}
                className={`btn_episode${isActive ? " button_film_active" : ""}`}
                key={item?.slug || index}
                onClick={() => handleChangeEp(item.slug)}
                type="button"
              >
                {label}
              </button>
            );
          })}
    </div>
  );
}

export default EpisodesComponent;
