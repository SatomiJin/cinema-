import { useCallback, useEffect, useState } from "react";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useLocation } from "react-router-dom";
import * as FilmService from "../../services/FilmService";
import "./FilmMoviePage.scss";
import FilmMovieComponent from "../../components/FilmToTypeComponent/FilmMovieComponent/FilmMovieComponent";
function FilmMoviePage() {
  let mutation = useMutationHook((page, limit) =>
    FilmService.getMovieFilm(page, limit)
  );
  let { data, mutate } = mutation;
  let [movieFilm, setMovieFilm] = useState([]);
  let [pageCurrent, setPageCurrent] = useState(0);
  let location = useLocation();

  const getSeriesData = useCallback(
    (page) => {
      mutate(page);
    },
    [mutate]
  );

  useEffect(() => {
    const pageFromPath = location?.pathname?.split("/")[3] || 1;

    setPageCurrent(pageFromPath);
    getSeriesData(Number(pageFromPath));
  }, [getSeriesData, location?.pathname]);
  useEffect(() => {
    if (data && data?.status) {
      setMovieFilm([...data?.data?.items]);
    }
  }, [data]);

  return (
    <div className="movie-page_container">
      <div className="film-movie_pc">
        {/* <FilmSeriesPcTablet pagination={data?.data?.params?.pagination} data={seriesFilm} pageCurrent={pageCurrent} /> */}
        <FilmMovieComponent
          pagination={data?.data?.params?.pagination}
          data={movieFilm}
          pageCurrent={pageCurrent}
        />
      </div>
    </div>
  );
}

export default FilmMoviePage;
