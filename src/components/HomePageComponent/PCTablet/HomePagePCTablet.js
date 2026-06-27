import { useTranslation } from "react-i18next";
import { useCallback, useContext, useEffect } from "react";
import { useMutationHook } from "../../../hooks/useMutationHook";
import ListFilmComponent from "../../ListFilmComponent/ListFilmComponent";
import SliderComponent from "../../SliderComponent/SliderComponent";
import * as FilmService from "../../../services/FilmService";
import { FilmContext } from "../../../context/filmContext";
import "./HomePagePCTablet.scss";
import InfoMeComponent from "../../InfoMeComponent/InfoMeComponent";
import WatchHistoryComponent from "../../WatchHistoryComponent/WatchHistoryComponent";

function HomePagePCTablet() {
  let { t } = useTranslation();
  const {
    newFilmData,
    setNewFilmData,
    newSeriesData,
    setNewSeriesData,
    newMovieFilmData,
    setNewMovieFilmData,
    newAnimeData,
    setNewAnimeData,
  } = useContext(FilmContext);

  // get data
  let mutationGetNewFilm = useMutationHook(() => FilmService.getListNewFilm());
  let { data: newFilmDataMutation, mutate: mutateNewFilm } = mutationGetNewFilm;
  let mutationGetSeries = useMutationHook(() => FilmService.getListNewSeries());
  let { data: newSeriesFilmMutation, mutate: mutateSeries } = mutationGetSeries;
  let mutationGetMovies = useMutationHook(() => FilmService.getListNewMovie());
  let { data: newMovieFilmMutation, mutate: mutateMovies } = mutationGetMovies;
  let mutationGetAnime = useMutationHook(() => FilmService.getListAnime());
  let { data: newAnimeFilmMutation, mutate: mutateAnime } = mutationGetAnime;

  // function
  const getDataFilm = useCallback(() => {
    mutateNewFilm();
    mutateSeries();
    mutateMovies();
    mutateAnime();
  }, [mutateAnime, mutateMovies, mutateNewFilm, mutateSeries]);

  // useEffect
  useEffect(() => {
    getDataFilm();
  }, [getDataFilm]);
  useEffect(() => {
    if (newFilmDataMutation && newFilmDataMutation.status === true) {
      setNewFilmData([...newFilmDataMutation.items]);
    }
    if (newSeriesFilmMutation && newSeriesFilmMutation.status) {
      setNewSeriesData([...newSeriesFilmMutation?.data?.items]);
    }
    if (newMovieFilmMutation && newMovieFilmMutation.status) {
      setNewMovieFilmData([...newMovieFilmMutation?.data?.items]);
    }
    if (newAnimeFilmMutation && newAnimeFilmMutation.status) {
      setNewAnimeData([...newAnimeFilmMutation?.data?.items]);
    }
  }, [
    newFilmDataMutation,
    newSeriesFilmMutation,
    newMovieFilmMutation,
    newAnimeFilmMutation,
    setNewAnimeData,
    setNewFilmData,
    setNewMovieFilmData,
    setNewSeriesData,
  ]);

  useEffect(() => {
    const sections = document.querySelectorAll(".fade-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-page-container">
      <div className="container">
        <div className="home-page_pc-tb row">
          <div className="content-left col col-12">
            <div className="content-left_slider fade-section" style={{ "--section-index": "0" }}>
              <SliderComponent />
            </div>
            <div className="watch-history fade-section" style={{ "--section-index": "1" }}>
              <WatchHistoryComponent />
            </div>
            <div className="new-film fade-section" style={{ "--section-index": "2" }}>
              <ListFilmComponent
                data={newFilmData && newFilmData?.length > 0 && newFilmData}
                name={t("newFilm")}
                path="/phim-bo/trang/1"
              />
            </div>
            <div className="series-film fade-section" style={{ "--section-index": "3" }}>
              <ListFilmComponent
                data={newSeriesData}
                name={t("newFilmSeries")}
                path="/phim-bo/trang/1"
              />
            </div>
            <div className="movies-film fade-section" style={{ "--section-index": "4" }}>
              <ListFilmComponent
                data={newMovieFilmData}
                name={t("newMovieFilm")}
                path="/phim-le/trang/1"
              />
            </div>
            <div className="anime-film fade-section" style={{ "--section-index": "5" }}>
              <ListFilmComponent
                data={newAnimeData}
                name={t("newAnimeFilm")}
                path="/hoat-hinh/trang/1"
              />
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
