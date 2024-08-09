import axios from "axios";

export const getListNewFilm = async () => {
  let res = await axios.get(`${process.env.FILM_API}/danh-sach/phim-moi-cap-nhat?page=1`);
  return res.data;
};

export const getListNewSeries = async () => {
  let res = await axios.get(`${process.env.FILM_API}/v1/api/danh-sach/phim-bo`);
  return res.data;
};

export const getListNewMovie = async () => {
  let res = await axios.get(`${process.env.FILM_API}/v1/api/danh-sach/phim-le`);
  return res.data;
};

export const getListAnime = async () => {
  let res = await axios.get(`${process.env.FILM_API}/v1/api/danh-sach/hoat-hinh`);
  return res.data;
};

export const getFilmInfo = async (slug) => {
  let res = await axios.get(`${process.env.FILM_API}/phim/${slug}`);
  return res.data;
};

//  https://phimapi.com/v1/api/tim-kiem?keyword={Từ khóa}&limit={number}
export const searchFilm = async (keywords, limit) => {
  let res = await axios.get(`${process.env.FILM_API}/v1/api/tim-kiem?keyword=${keywords}&limit=${limit}`);
  return res.data;
};

export const getSeriesFilm = async (page, limit = 10) => {
  let res = await axios.get(`${process.env.FILM_API}/v1/api/danh-sach/phim-bo?page=${page}&limit=${limit}`);
  return res.data;
};

export const getMovieFilm = async (page, limit = 10) => {
  let res = await axios.get(`${process.env.FILM_API}/v1/api/danh-sach/phim-le?page=${page}&limit=${limit}`);
  return res.data;
};
export const getAnimeFilm = async (page, limit = 10) => {
  let res = await axios.get(`${process.env.FILM_API}/v1/api/danh-sach/hoat-hinh?page=${page}&limit=${limit}`);
  return res.data;
};
