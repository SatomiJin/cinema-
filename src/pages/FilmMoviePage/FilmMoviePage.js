import { useEffect, useState } from "react";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useLocation } from "react-router-dom";
import * as FilmService from "../../services/FilmService";
import "./FilmMoviePage.scss";
import FilmMovieComponent from "../../components/FilmToTypeComponent/FilmMovieComponent/FilmMovieComponent";
function FilmMoviePage() {
  let mutation = useMutationHook((page, limit) => FilmService.getMovieFilm(page, limit));
  let { data } = mutation;
  let [movieFilm, setMovieFilm] = useState([]);
  let [pageCurrent, setPageCurrent] = useState(0);
  let location = useLocation();

  const getSeriesData = async (page, limit) => {
    await mutation.mutate(page, limit);
  };

  useEffect(() => {
    getSeriesData(Number(pageCurrent), 10);
    setPageCurrent(location?.pathname?.split("/")[3]);
  }, [location]);
  useEffect(() => {
    if (data && data?.status === "success") {
      setMovieFilm([...data?.data?.items]);
    }
  }, [data]);

  return (
    <div className="movie-page_container">
      <div className="film-movie_pc">
        {/* <FilmSeriesPcTablet pagination={data?.data?.params?.pagination} data={seriesFilm} pageCurrent={pageCurrent} /> */}
        <FilmMovieComponent pagination={data?.data?.params?.pagination} data={movieFilm} pageCurrent={pageCurrent} />
      </div>
    </div>
  );
}

export default FilmMoviePage;
