import FilmAnimePage from "../pages/FIlmAnimePage/FilmAnimePage";
import FilmInfoPage from "../pages/FilmInfoPage/FilmInfoPage";
import FilmMoviePage from "../pages/FilmMoviePage/FilmMoviePage";
import FilmSeriesPage from "../pages/FilmSeriesPage/FilmSeriesPage";
import HomePage from "../pages/HomePage/HomePage";
import WatchFilmPage from "../pages/WatchFilmPage/WatchFilmPage";

export let routes = [
  {
    path: "/",
    page: HomePage,
    layout: "L1",
    isLogin: false,
  },
  {
    path: "/:loai-phim/:ten-phim",
    page: FilmInfoPage,
    layout: "l1",
    isLogin: false,
  },
  {
    path: "/xem-phim/:ten-phim/:tap",
    page: WatchFilmPage,
    layout: "l1",
    isLogin: false,
  },
  {
    path: "/phim-bo/trang/:so-trang",
    page: FilmSeriesPage,
    layout: "l1",
    isLogin: false,
  },
  {
    path: "/phim-le/trang/:so-trang",
    page: FilmMoviePage,
    layout: "l1",
    isLogin: false,
  },
  {
    path: "/hoat-hinh/trang/:so-trang",
    page: FilmAnimePage,
    layout: "l1",
    isLogin: false,
  },
  // {
  //   path: "*",
  //   page: "Not Found 404",
  //   layout: "l1",
  //   isLogin: false,
  // },
];
