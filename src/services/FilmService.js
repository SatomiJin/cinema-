import axios from "axios";

const SEARCH_TIMEOUT = 12000;

const buildSearchParams = (keywords, limit = 10, page = 1, filters = {}) => {
  const searchParams = new URLSearchParams({
    keyword: keywords,
    limit,
    page: page || 1,
  });

  if (filters?.category) {
    searchParams.set("category", filters.category);
  }

  return searchParams;
};

const filterSearchDataByCategory = (data, category) => {
  const filteredItems = (data?.data?.items || []).filter((film) =>
    film?.category?.some((item) => item?.slug === category)
  );

  return {
    ...data,
    isClientCategoryFallback: true,
    data: {
      ...data?.data,
      items: filteredItems,
      params: {
        ...data?.data?.params,
        pagination: {
          ...data?.data?.params?.pagination,
          totalItems: filteredItems.length,
          totalPages: filteredItems.length > 0 ? 1 : 0,
        },
      },
    },
  };
};

export const getListNewFilm = async () => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/danh-sach/phim-moi-cap-nhat?page=1`
  );
  return res.data;
};

export const getListNewSeries = async () => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/v1/api/danh-sach/phim-bo`
  );

  return res.data;
};

export const getListNewMovie = async () => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/v1/api/danh-sach/phim-le`
  );
  return res.data;
};

export const getListAnime = async () => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/v1/api/danh-sach/hoat-hinh`
  );

  return res.data;
};

export const getFilmInfo = async (slug) => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/phim/${slug}`
  );

  return res.data;
};

//  https://phimapi.com/v1/api/tim-kiem?keyword={Từ khóa}&limit={number}
export const searchFilm = async (keywords, limit = 10, page = 1, filters = {}) => {
  const searchParams = buildSearchParams(keywords, limit, page, filters);
  const searchUrl = `${process.env.REACT_APP_API_FILM_URL}/v1/api/tim-kiem?${searchParams.toString()}`;

  try {
    let res = await axios.get(searchUrl, { timeout: SEARCH_TIMEOUT });

    return res.data;
  } catch (error) {
    if (!filters?.category) throw error;

    const fallbackParams = buildSearchParams(keywords, limit, page);
    const fallbackUrl = `${process.env.REACT_APP_API_FILM_URL}/v1/api/tim-kiem?${fallbackParams.toString()}`;
    const fallbackRes = await axios.get(fallbackUrl, { timeout: SEARCH_TIMEOUT });

    return filterSearchDataByCategory(fallbackRes.data, filters.category);
  }
};

export const getSeriesFilm = async (page, limit = 10) => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/v1/api/danh-sach/phim-bo?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getMovieFilm = async (page, limit = 10) => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/v1/api/danh-sach/phim-le?page=${page}&limit=${limit}`
  );
  return res.data;
};
export const getAnimeFilm = async (page, limit = 10) => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/v1/api/danh-sach/hoat-hinh?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getGenreFilm = async (genre, page, limit = 10) => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/v1/api/the-loai/${genre}?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getCountryFilm = async (country, page, limit = 10) => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/v1/api/quoc-gia/${country}?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getYearFilm = async (year, page, limit = 10) => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/v1/api/nam/${year}?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getListFilmByType = async (typeList, page, limit = 10) => {
  let res = await axios.get(
    `${process.env.REACT_APP_API_FILM_URL}/v1/api/danh-sach/${typeList}?page=${page}&limit=${limit}`
  );
  return res.data;
};
