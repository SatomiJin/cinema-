import { useLocation } from "react-router-dom";
import FilmInfoPcTablet from "../../components/FilmInfoComponent/PcTablet/FilmInfoPcTablet";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as FilmService from "../../services/FilmService";
import { useEffect, useState } from "react";
import FilmInfoMobile from "../../components/FilmInfoComponent/Mobile/FilmInfoMobile";
import "./FilmInfoPage.scss";
function FilmInfoPage() {
  let location = useLocation();
  let slugFilm = location.pathname.split("/")[2];
  let mutationGetFilm = useMutationHook((data) => FilmService.getFilmInfo(data));
  let { data } = mutationGetFilm;
  let [filmData, setFilmData] = useState({});
  let [episodes, setEpisodes] = useState({});
  // function
  let getInfoFilm = async () => {
    await mutationGetFilm.mutate(slugFilm);
  };
  // useEffect
  useEffect(() => {
    getInfoFilm();
  }, [location]);

  useEffect(() => {
    if (data && data.status) {
      setFilmData(data?.movie);
      setEpisodes(data?.episodes[0]);
    }
  }, [data]);
  return (
    <div className="film-info-container">
      <div className="film-info-pc">
        <FilmInfoPcTablet data={filmData} episodes={episodes} />
      </div>
      <div className="film-info-mobile">
        <FilmInfoMobile data={filmData} episodes={episodes} />
      </div>
    </div>
  );
}

export default FilmInfoPage;
