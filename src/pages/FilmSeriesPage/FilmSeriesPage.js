import { useCallback, useEffect, useState } from "react";
import FilmSeriesPcTablet from "../../components/FilmSeriesComponent/PcTablet/FilmSeriesPcTablet";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as FilmService from "../../services/FilmService";
import { useLocation } from "react-router-dom";
function FilmSeriesPage() {
  let mutation = useMutationHook((page, limit) =>
    FilmService.getSeriesFilm(page, limit)
  );
  let { data, mutate } = mutation;
  let [seriesFilm, setSeriesFilm] = useState([]);
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
      setSeriesFilm([...data?.data?.items]);
    }
  }, [data]);

  return (
    <div className="film-series-container">
      <div className="film-series_pc">
        <FilmSeriesPcTablet
          pagination={data?.data?.params?.pagination}
          data={seriesFilm}
          pageCurrent={pageCurrent}
        />
      </div>
      {/* <div className="film-series_mobile">
        <FilmSeriesMobile pagination={data?.data?.params?.pagination} data={seriesFilm} pageCurrent={pageCurrent} />
      </div> */}
    </div>
  );
}

export default FilmSeriesPage;
