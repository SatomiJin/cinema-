import { useParams } from "react-router-dom";
import FilmInfoPcTablet from "../../components/FilmInfoComponent/PcTablet/FilmInfoPcTablet";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as FilmService from "../../services/FilmService";
import { useCallback, useEffect, useState } from "react";
import FilmInfoMobile from "../../components/FilmInfoComponent/Mobile/FilmInfoMobile";
import "./FilmInfoPage.scss";
function FilmInfoPage() {
  const { tenPhim: slugFilm } = useParams();
  let mutationGetFilm = useMutationHook((data) => FilmService.getFilmInfo(data));
  let { data, error, isError, isPending, mutate } = mutationGetFilm;
  let [filmData, setFilmData] = useState({});
  let [episodes, setEpisodes] = useState({});
  // function
  let getInfoFilm = useCallback(() => {
    mutate(slugFilm);
  }, [mutate, slugFilm]);
  // useEffect
  useEffect(() => {
    getInfoFilm();
  }, [getInfoFilm]);

  useEffect(() => {
    if (data && data.status) {
      setFilmData(data?.movie);
      setEpisodes(data?.episodes[0]);
    }
  }, [data]);

  const errorMessage = error?.response?.data?.msg || error?.message;

  if (isError) {
    return (
      <div className="film-info-container">
        <p role="alert">Không tải được thông tin phim: {errorMessage || "Phim không tồn tại."}</p>
      </div>
    );
  }

  if (!isPending && data && !data.status) {
    return (
      <div className="film-info-container">
        <p role="alert">Không tải được thông tin phim: {data.msg || "Phim không tồn tại."}</p>
      </div>
    );
  }

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
