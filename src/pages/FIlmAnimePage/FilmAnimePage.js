import { useCallback, useEffect, useState } from "react";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useLocation } from "react-router-dom";
import * as FilmService from "../../services/FilmService";
import FilmAnimeComponent from "../../components/FilmToTypeComponent/FilmAnimeComponent/FilmAnimeComponent";
function FilmAnimePage() {
  let mutation = useMutationHook((page, limit) =>
    FilmService.getAnimeFilm(page, limit)
  );
  let { data, mutate } = mutation;
  let [animeFilm, setAnimeFilm] = useState([]);
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
      setAnimeFilm([...data?.data?.items]);
    }
  }, [data]);

  return (
    <div className="anime-page_container">
      <div className="film-anime_pc">
        <FilmAnimeComponent
          pagination={data?.data?.params?.pagination}
          data={animeFilm}
          pageCurrent={pageCurrent}
        />
        {/* <FilmSeriesPcTablet pagination={data?.data?.params?.pagination} data={seriesFilm} pageCurrent={pageCurrent} /> */}
        {/* <FilmMovieComponent pagination={data?.data?.params?.pagination} data={movieFilm} pageCurrent={pageCurrent} /> */}
      </div>
    </div>
  );
}

export default FilmAnimePage;
