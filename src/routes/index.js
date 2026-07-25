import FilmAnimePage from "../pages/FIlmAnimePage/FilmAnimePage";
import FilmInfoPage from "../pages/FilmInfoPage/FilmInfoPage";
import FilmMoviePage from "../pages/FilmMoviePage/FilmMoviePage";
import FilmSeriesPage from "../pages/FilmSeriesPage/FilmSeriesPage";
import FilteredFilmPage from "../pages/FilteredFilmPage/FilteredFilmPage";
import HomePage from "../pages/HomePage/HomePage";
import SearchFilmPage from "../pages/SearchFilmPage/SearchFilmPage";
import WatchFilmPage from "../pages/WatchFilmPage/WatchFilmPage";

export let routes = [
  {
    path: "/",
    page: HomePage,
    layout: "L1",
    isLogin: false,
  },
  {
    path: "/the-loai/:slug/trang/:so-trang",
    page: FilteredFilmPage,
    layout: "l1",
    isLogin: false,
  },
  {
    path: "/quoc-gia/:slug/trang/:so-trang",
    page: FilteredFilmPage,
    layout: "l1",
    isLogin: false,
  },
  {
    path: "/nam/:slug/trang/:so-trang",
    page: FilteredFilmPage,
    layout: "l1",
    isLogin: false,
  },
  {
    path: "/danh-sach/:slug/trang/:so-trang",
    page: FilteredFilmPage,
    layout: "l1",
    isLogin: false,
  },
  {
    path: "/:loaiPhim/:tenPhim",
    page: FilmInfoPage,
    layout: "l1",
    isLogin: false,
  },
  {
    path: "/xem-phim/:tenPhim/:tap",
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
  {
    path: "/tim-kiem/:name/:page",
    page: SearchFilmPage,
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
