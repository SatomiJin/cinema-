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
  const mutationGetNewFilm = useMutationHook(() => FilmService.getListNewFilm());
  const {
    data: newFilmDataMutation,
    mutate: mutateNewFilm,
    isIdle: isNewFilmIdle,
    isPending: isNewFilmPending,
  } = mutationGetNewFilm;
  const mutationGetSeries = useMutationHook(() => FilmService.getListNewSeries());
  const {
    data: newSeriesFilmMutation,
    mutate: mutateSeries,
    isIdle: isSeriesIdle,
    isPending: isSeriesPending,
  } = mutationGetSeries;
  const mutationGetMovies = useMutationHook(() => FilmService.getListNewMovie());
  const {
    data: newMovieFilmMutation,
    mutate: mutateMovies,
    isIdle: isMoviesIdle,
    isPending: isMoviesPending,
  } = mutationGetMovies;
  const mutationGetAnime = useMutationHook(() => FilmService.getListAnime());
  const {
    data: newAnimeFilmMutation,
    mutate: mutateAnime,
    isIdle: isAnimeIdle,
    isPending: isAnimePending,
  } = mutationGetAnime;

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

  return (
    <div className="home-page-shell">
      <div className="container">
        <div className="home-page_pc-tb">
          <div className="content-left col col-12">
            <section className="content-left_slider cinema-section" style={{ "--section-index": "0" }}>
              <SliderComponent />
            </section>
            <section className="watch-history cinema-section" style={{ "--section-index": "1" }}>
              <WatchHistoryComponent />
            </section>
            <section className="new-film cinema-section" style={{ "--section-index": "2" }}>
              <ListFilmComponent
                data={newFilmData}
                name={t("newFilm")}
                path="/phim-bo/trang/1"
                loading={isNewFilmIdle || isNewFilmPending}
              />
            </section>
            <section className="series-film cinema-section" style={{ "--section-index": "3" }}>
              <ListFilmComponent
                data={newSeriesData}
                name={t("newFilmSeries")}
                path="/phim-bo/trang/1"
                loading={isSeriesIdle || isSeriesPending}
              />
            </section>
            <section className="movies-film cinema-section" style={{ "--section-index": "4" }}>
              <ListFilmComponent
                data={newMovieFilmData}
                name={t("newMovieFilm")}
                path="/phim-le/trang/1"
                loading={isMoviesIdle || isMoviesPending}
              />
            </section>
            <section className="anime-film cinema-section" style={{ "--section-index": "5" }}>
              <ListFilmComponent
                data={newAnimeData}
                name={t("newAnimeFilm")}
                path="/hoat-hinh/trang/1"
                loading={isAnimeIdle || isAnimePending}
              />
            </section>
          </div>
          <div className="more-info col col-12">
            <InfoMeComponent />
          </div>
          <footer className="contact-me col col-12">
            <span aria-hidden="true">©</span>
            <a
              className="portfolio-link"
              href="https://portfolio.satomijin.id.vn/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Satomi Jin <span aria-hidden="true">↗</span>
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default HomePagePCTablet;
