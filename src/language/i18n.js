import i18next from "i18next";

import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
  fallbackLng: "vi",
  lng: "vi",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    vi: {
      translation: {
        series: "Phim Bộ",
        movie: "Phim lẻ",
        cartoon: "Hoạt hình",
        genre: "Thể loại",
        search: "Tìm kiếm...",
        menu: "Danh mục",
        seeMore: "Xem thêm",

        newFilm: "Phim mới cập nhật",
        newFilmSeries: "Phim bộ mới cập nhật",
        newMovieFilm: "Phim lẻ mới cập nhật",

        // intro
        intro:
          "Xin chào, Tôi là Đồng Hữu Trọng (Satomi Jin), Một lập trình viên Front-end đến từ Thành Phố Hồ Chí Minh. Tôi sử dụng ReactJS cho Front-end và NodeJS cho Back-end.",
        contactMe: "Liên hệ",
        // thông tin phim
        originName: "Tên gốc",
        filmCategory: "Thể loại",
        filmStatus: "Trạng thái",
        yearRelease: "Phát hành",
        time: "Thời lượng",
        episode: "Tập",
        listEp: "Danh sách tập",
        filmDesc: "Nội dung",
        // filmStatus
        filmCompleted: "Hoàn thành",
        filmGoingOn: "Đang cập nhật",
        // xem phim
        watching: "Đang xem",
        prevEp: "Tập trước",
        nextEp: "Tập sau",
        // Một số chúc năng khác
        noData: "Không có dữ liệu",
        // Danh sách phim
        listSeries: "Danh sách phim bộ",
        listMovie: "Danh sách phim lẻ",
        listAnime: "Danh sách anime",
      },
    },
    en: {
      translation: {
        series: "Series Movie",
        movie: "Movie",
        cartoon: "Anime",
        genre: "Movie Genre",
        search: "Search...",
        menu: "Menu",
        seeMore: "See more",
        newFilm: "Newly updated movies",
        newFilmSeries: "Newly updated series film",
        newMovieFilm: "Newly updated movie film",
        // intro
        intro:
          "Hello, I'm Đồng Hữu Trọng (Satomi Jin) a Front-end developer from Ho Chi Minh City. Specializing in Frontend with ReactJS and Backend with NodeJS.",
        contactMe: "Contact Me",
        // film information
        originName: "Origin name",
        filmCategory: "Category",
        filmStatus: "Status",
        yearRelease: "Year of release",
        time: "Time",
        episode: "Episode",
        listEp: "Episodes",
        filmDesc: "Description",
        // film status
        filmCompleted: "Completed",
        filmGoingOn: "Updating",

        // watch film
        watching: "Watching",
        prevEp: "Prev episode",
        nextEp: "Next episode",
        // More option
        noData: "No data",

        // list film
        listSeries: "List series film",
        listSMovie: "List Movie film",
        listSAnime: "List Anime film",
      },
    },
  },
});

export default i18next;
