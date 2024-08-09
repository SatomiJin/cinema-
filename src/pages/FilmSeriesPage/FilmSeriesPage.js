import { useEffect, useState } from "react";
import FilmSeriesPcTablet from "../../components/FilmSeriesComponent/PcTablet/FilmSeriesPcTablet";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as FilmService from "../../services/FilmService";
import { useLocation } from "react-router-dom";
import FilmSeriesMobile from "../../components/FilmSeriesComponent/Mobiles/FilmSeriesMobile";
function FilmSeriesPage() {
  let mutation = useMutationHook((page, limit) => FilmService.getSeriesFilm(page, limit));
  let { data } = mutation;
  let [seriesFilm, setSeriesFilm] = useState([]);
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
      setSeriesFilm([...data?.data?.items]);
    }
  }, [data]);

  return (
    <div className="film-series-container">
      <div className="film-series_pc">
        <FilmSeriesPcTablet pagination={data?.data?.params?.pagination} data={seriesFilm} pageCurrent={pageCurrent} />
      </div>
      {/* <div className="film-series_mobile">
        <FilmSeriesMobile pagination={data?.data?.params?.pagination} data={seriesFilm} pageCurrent={pageCurrent} />
      </div> */}
    </div>
  );
}

export default FilmSeriesPage;
