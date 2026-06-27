import { useEffect, useState } from "react";
import WatchPcTablet from "../../components/WatchFilmComponent/WatchPcTablet/WatchPcTablet";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useLocation } from "react-router-dom";
import * as FilmService from "../../services/FilmService";
import "./WatchFilmPage.scss";
import WatchMobile from "../../components/WatchFilmComponent/Mobile/WatchMobile";
import { saveWatchHistory } from "../../utils/watchHistory";

function WatchFilmPage() {
  let mutation = useMutationHook((data) => FilmService.getFilmInfo(data));
  let location = useLocation();
  let splitLocation = location.pathname.split("/");
  let { data, mutate } = mutation;
  let [episodes, setEpisodes] = useState([]);
  let [filmInfo, setFilmInfo] = useState({});
  let [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  let filmEp = {
    slug: splitLocation[2],
    ep: splitLocation[3],
  };

  // useEffect
  useEffect(() => {
    mutate(filmEp.slug);
  }, [filmEp.slug, mutate]);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    if (data && data?.movie) {
      setFilmInfo(data?.movie);
    }
    if (data && data?.episodes && data?.episodes[0]?.server_data?.length > 0)
      setEpisodes([...data?.episodes[0]?.server_data]);
  }, [data]);

  let epInfo = episodes && episodes.length > 0 && episodes.find((item) => item.slug === filmEp.ep);

  useEffect(() => {
    if (filmInfo?.slug && epInfo?.slug && epInfo?.link_embed) {
      saveWatchHistory({ filmInfo, epInfo });
    }
  }, [epInfo, filmInfo]);
  // function

  return (
    <div className="watch-film-page_container">
      {isMobile ? (
        <WatchMobile filmInfo={filmInfo} epInfo={epInfo} episodes={episodes} />
      ) : (
        <WatchPcTablet filmInfo={filmInfo} epInfo={epInfo} episodes={episodes} />
      )}
    </div>
  );
}

export default WatchFilmPage;
