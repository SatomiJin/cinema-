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
        country: "Quốc Gia",
        releaseYear: "Năm Phát Hành",
        cinemaFilm: "Phim Chiếu Rạp",
        voiceoverFilm: "Phim Thuyết Minh",
        search: "Tìm kiếm...",
        menu: "Danh mục",
        seeMore: "Xem thêm",
        backToTop: "Về đầu trang",
        chooseLanguage: "Chọn ngôn ngữ",
        skipToContent: "Đi đến nội dung chính",
        classicUi: "Cổ điển",
        modernUi: "Hiện đại",
        switchUi: "Chuyển sang giao diện {{ui}}",
        appUpdateAction: "Cập nhật ứng dụng",
        checkAppUpdate: "Kiểm tra cập nhật",
        checkUpdateAgain: "Kiểm tra lại",
        retryUpdateCheck: "Thử kiểm tra lại",
        dismissUpdateMessage: "Đóng thông báo cập nhật",
        checkingUpdate: "Đang kiểm tra bản cập nhật...",
        updateToVersion: "Cập nhật {{version}}",
        updateAvailableMessage: "Đã có {{version}}. Bấm lại để tải và cập nhật.",
        appUpToDate: "Bạn đang dùng bản mới nhất ({{version}}).",
        noAppRelease: "Chưa có bản phát hành để cập nhật.",
        appInfoUnavailable: "Không đọc được phiên bản ứng dụng trên thiết bị.",
        invalidAppRelease: "Thông tin bản cập nhật không hợp lệ.",
        updateCheckTimeout: "Máy chủ cập nhật phản hồi quá lâu. Hãy thử lại.",
        updateNetworkError: "Không kết nối được máy chủ cập nhật. Hãy kiểm tra mạng.",
        updateRateLimited: "Máy chủ đang giới hạn lượt kiểm tra. Hãy thử lại sau.",
        updateServiceError: "Máy chủ cập nhật đang gặp sự cố. Hãy thử lại sau.",
        updateSourceUnavailable:
          "Kênh cập nhật chưa sẵn sàng hoặc chưa có bản phát hành công khai.",
        updateCheckFailed: "Không thể kiểm tra cập nhật do lỗi không xác định.",
        openingUpdate: "Đang mở bản cập nhật...",
        finishUpdateInstall: "Đã mở tệp cập nhật. Hãy xác nhận cài đặt trong Android.",
        chooseReleaseApk: "Trang phát hành đã mở. Hãy chọn tệp APK để cập nhật.",
        updateOpenFailed: "Không thể mở bản cập nhật. Vui lòng thử lại.",

        newFilm: "Phim mới cập nhật",
        newFilmSeries: "Phim bộ mới cập nhật",
        newMovieFilm: "Phim lẻ mới cập nhật",
        newAnimeFilm: "Hoạt hình mới cập nhật",
        watchHistory: "Phim xem gần đây",

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
        movieArchive: "Kho phim tuyển chọn",

        //search film
        keywordSearch: "Từ khóa tìm kiếm",
      },
    },
    en: {
      translation: {
        series: "Series Movie",
        movie: "Movie",
        cartoon: "Anime",
        genre: "Movie Genre",
        country: "Country",
        releaseYear: "Release Year",
        cinemaFilm: "Cinema Movies",
        voiceoverFilm: "Voiceover Movies",
        search: "Search...",
        menu: "Menu",
        seeMore: "See more",
        backToTop: "Back to top",
        chooseLanguage: "Choose language",
        skipToContent: "Skip to main content",
        classicUi: "Classic",
        modernUi: "Modern",
        switchUi: "Switch to {{ui}} interface",
        appUpdateAction: "Update app",
        checkAppUpdate: "Check for updates",
        checkUpdateAgain: "Check again",
        retryUpdateCheck: "Retry update check",
        dismissUpdateMessage: "Dismiss update notification",
        checkingUpdate: "Checking for updates...",
        updateToVersion: "Update to {{version}}",
        updateAvailableMessage: "{{version}} is available. Tap again to download and update.",
        appUpToDate: "You are using the latest version ({{version}}).",
        noAppRelease: "No app release is available yet.",
        appInfoUnavailable: "The installed app version could not be read.",
        invalidAppRelease: "The update information is invalid.",
        updateCheckTimeout: "The update server took too long to respond. Try again.",
        updateNetworkError: "The update server could not be reached. Check your connection.",
        updateRateLimited: "The update server is limiting checks. Try again later.",
        updateServiceError: "The update server is unavailable. Try again later.",
        updateSourceUnavailable:
          "The update channel is not ready or has no public release yet.",
        updateCheckFailed: "The update check failed because of an unknown error.",
        openingUpdate: "Opening the update...",
        finishUpdateInstall: "The update file is open. Confirm installation in Android.",
        chooseReleaseApk: "The release page is open. Select the APK to update.",
        updateOpenFailed: "Unable to open the update. Please try again.",
        newFilm: "Newly updated movies",
        newFilmSeries: "Newly updated series film",
        newMovieFilm: "Newly updated movie film",
        newAnimeFilm: "Newly updated anime",
        watchHistory: "Recently watched",
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
        listMovie: "List movies",
        listAnime: "List anime",
        movieArchive: "Curated movie archive",

        //search film
        keywordSearch: "Keyword Searching",
      },
    },
  },
});

export default i18next;
