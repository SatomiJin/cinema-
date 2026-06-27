import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FilteredFilmComponent from "../../components/FilteredFilmComponent/FilteredFilmComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as FilmService from "../../services/FilmService";

const getFilterRequest = (filterType, filterSlug) => {
  if (filterType === "the-loai") return FilmService.getGenreFilm;
  if (filterType === "quoc-gia") return FilmService.getCountryFilm;
  if (filterType === "nam") return FilmService.getYearFilm;
  if (filterType === "danh-sach") return FilmService.getListFilmByType;

  return null;
};

function FilteredFilmPage() {
  let [listFilm, setListFilm] = useState([]);
  let [pageCurrent, setPageCurrent] = useState(1);
  let [title, setTitle] = useState("");
  let location = useLocation();
  let { t } = useTranslation();

  let pathParts = useMemo(() => location.pathname.split("/").filter(Boolean), [location.pathname]);
  let filterType = pathParts[0];
  let filterSlug = pathParts[1];
  let pageFromPath = pathParts[3] || 1;
  let basePath = `/${filterType}/${filterSlug}`;

  let mutation = useMutationHook((data) => {
    let request = getFilterRequest(data.filterType, data.filterSlug);

    if (!request) return Promise.resolve(null);

    return request(data.filterSlug, data.page);
  });
  let { data, mutate, isPending } = mutation;

  const getFilteredData = useCallback(() => {
    setPageCurrent(Number(pageFromPath));
    mutate({
      filterType,
      filterSlug,
      page: Number(pageFromPath),
    });
  }, [filterSlug, filterType, mutate, pageFromPath]);

  useEffect(() => {
    getFilteredData();
  }, [getFilteredData]);

  useEffect(() => {
    if (data && data?.status) {
      setListFilm(data?.data?.items || []);
      setTitle(data?.data?.titlePage || "");
    }
  }, [data]);

  return (
    <div className="filtered-film-page_container">
      <FilteredFilmComponent
        basePath={basePath}
        data={listFilm}
        emptyText={t("noData")}
        loading={isPending}
        pageCurrent={pageCurrent}
        pagination={data?.data?.params?.pagination}
        title={title || filterSlug}
      />
    </div>
  );
}

export default FilteredFilmPage;
