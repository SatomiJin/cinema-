import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { useMutationHook } from "../../../hooks/useMutationHook";
import ListFilmComponent from "../../ListFilmComponent/ListFilmComponent";
import SliderComponent from "../../SliderComponent/SliderComponent";
import * as FilmService from "../../../services/FilmService";
import { FilmContext } from "../../../context/filmContext";
import "./HomePagePCTablet.scss";
import InfoMeComponent from "../../InfoMeComponent/InfoMeComponent";

function HomePagePCTablet() {
  let { t } = useTranslation();
  const { newFilmData, setNewFilmData, newSeriesData, setNewSeriesData, newMovieFilmData, setNewMovieFilmData } =
    useContext(FilmContext);

  // get data
  let mutationGetNewFilm = useMutationHook(() => FilmService.getListNewFilm());
  let newFilmDataMutation = mutationGetNewFilm.data;
  let mutationGetSeries = useMutationHook(() => FilmService.getListNewSeries());
  let newSeriesFilmMutation = mutationGetSeries.data;

  let mutationGetMovies = useMutationHook(() => FilmService.getListNewMovie());
  let newMovieFilmMutation = mutationGetMovies.data;
  // function
  const getDataFilm = async () => {
    await mutationGetNewFilm.mutate();
    await mutationGetSeries.mutate();
    await mutationGetMovies.mutate();
  };
  // useEffect
  useEffect(() => {
    getDataFilm();
  }, []);
  // console.log("newFilmDataMutation", newFilmDataMutation);
  useEffect(() => {
    if (newFilmDataMutation && newFilmDataMutation.status === true) {
      setNewFilmData([...newFilmDataMutation.items]);
    }
    if (newSeriesFilmMutation && newSeriesFilmMutation.status === "success") {
      setNewSeriesData([...newSeriesFilmMutation?.data?.items]);
    }
    if (newMovieFilmMutation && newMovieFilmMutation.status === "success") {
      setNewMovieFilmData([...newMovieFilmMutation?.data?.items]);
    }
  }, [newFilmDataMutation, newSeriesFilmMutation, newMovieFilmMutation]);
  return (
    <div className="home-page-container">
      <div className="container">
        <div className="home-page_pc-tb row">
          <div className="content-left col col-12">
            <div className="content-left_slider">
              <SliderComponent />
            </div>
            <div className="new-film">
              <ListFilmComponent data={newFilmData && newFilmData?.length > 0 && newFilmData} name={t("newFilm")} />
            </div>
            <div className="series-film">
              <ListFilmComponent data={newSeriesData} name={t("newFilmSeries")} />
            </div>
            <div className="movies-film">
              <ListFilmComponent data={newMovieFilmData} name={t("newMovieFilm")} />
            </div>
          </div>
          {/* <div className="content-right col col-4">baaaaa</div> */}
          <div className="more-info col col-12">
            <InfoMeComponent />
          </div>
          <div className="contact-me col col-12">
            <div className="copyright">&#174; CopyRight by Satomi Jin</div>
            <ul className="social-connect">
              <li className="social-item">
                <i className="fa-brands fa-facebook"></i>
              </li>
              <li className="social-item">
                <i className="fa-solid fa-envelope"></i>
              </li>
              <li className="social-item">
                <i className="fa-brands fa-linkedin"></i>
              </li>
              <li className="social-item">
                <i className="fa-brands fa-github"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePagePCTablet;
