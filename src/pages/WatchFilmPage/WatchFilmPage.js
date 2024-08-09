import { useEffect, useState } from "react";
import WatchPcTablet from "../../components/WatchFilmComponent/WatchPcTablet/WatchPcTablet";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import * as FilmService from "../../services/FilmService";
import "./WatchFilmPage.scss";
import WatchMobile from "../../components/WatchFilmComponent/Mobile/WatchMobile";

function WatchFilmPage() {
  let mutation = useMutationHook((data) => FilmService.getFilmInfo(data));
  let location = useLocation();
  let splitLocation = location.pathname.split("/");
  let { i18n } = useTranslation();
  let { data } = mutation;
  let [episodes, setEpisodes] = useState([]);
  let [filmInfo, setFilmInfo] = useState({});
  let filmEp = {
    slug: splitLocation[2],
    ep: splitLocation[3],
  };
  // function
  const handleGetFilm = async () => {
    await mutation.mutate(filmEp.slug);
  };
  // useEffect
  useEffect(() => {
    handleGetFilm();
  }, []);
  useEffect(() => {
    if (data && data?.movie) {
      setFilmInfo(data?.movie);
    }
    if (data && data?.episodes && data?.episodes[0]?.server_data?.length > 0)
      setEpisodes([...data?.episodes[0]?.server_data]);
  }, [data]);

  let epInfo = episodes && episodes.length > 0 && episodes.find((item) => item.slug === filmEp.ep);
  // function

  return (
    <div className="watch-film-page_container">
      <div className="wrapper-pc_container">
        <WatchPcTablet filmInfo={filmInfo} epInfo={epInfo} episodes={episodes} />
      </div>
      <div className="wrapper-mobile_container">
        <WatchMobile filmInfo={filmInfo} epInfo={epInfo} episodes={episodes} />
      </div>
    </div>
  );
}

export default WatchFilmPage;
