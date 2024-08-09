import { useEffect, useState } from "react";
import "./ListEpisodePcTablets.scss";
import { useLocation, useNavigate } from "react-router-dom";
function ListEpisodePcTablets(props) {
  let [episodes, setListEpisode] = useState([]);
  let [slug, setSlug] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    if (props?.episodes && props?.episodes.length > 0) setListEpisode([...props?.episodes]);
    if (props?.slug) setSlug(props?.slug);
  }, [props]);

  const watchFilm = (data) => {
    navigate(`/xem-phim/${slug}/${data?.slug}`);
  };
  return (
    <div className="list-episode-pc_container">
      {episodes && episodes?.length > 0 ? (
        episodes?.map((item, index) => {
          return (
            <button key={index} onClick={() => watchFilm(item)} type="button" className="btn episode_button">
              {index + 1}
            </button>
          );
        })
      ) : (
        <button type="button" className="btn episode_button"></button>
      )}
    </div>
  );
}

export default ListEpisodePcTablets;
