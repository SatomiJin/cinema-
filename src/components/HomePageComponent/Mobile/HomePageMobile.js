import { useTranslation } from "react-i18next";
import ListFilmComponent from "../../ListFilmComponent/ListFilmComponent";
import SliderComponent from "../../SliderComponent/SliderComponent";
import { FilmContext } from "../../../context/filmContext";
import { useContext } from "react";
import "./HomePageMobile.scss";

function HomePageMobile() {
  let { t } = useTranslation();
  const { newFilmData, newSeriesData, newMovieFilmData, newAnimeData } = useContext(FilmContext);

  return (
    <div className="home-page-mobile">
      <div className="container">
        <div className="home-page-mobile_wrapper row">
          <div className="anime-recommend">
            <SliderComponent />
          </div>
          <div className="new-film">
            <ListFilmComponent data={newFilmData} name={t("newFilm")} path="/phim-bo/trang/1" />
          </div>
          <div className="series-film">
            <ListFilmComponent data={newSeriesData} name={t("newFilmSeries")} path="/phim-bo/trang/1" />
          </div>
          <div className="movies-film">
            <ListFilmComponent data={newMovieFilmData} name={t("newMovieFilm")} path="/phim-le/trang/1" />
          </div>
          <div className="anime-film">
            <ListFilmComponent data={newAnimeData} name={t("newAnimeFilm")} path="/hoat-hinh/trang/1" />
          </div>
          <div className="more-info">
            <div className="title">{t("contactMe")}</div>
            <div className="socials-connect">
              <ul className="list-item">
                <li className="item">
                  <i className="fa-brands fa-facebook"></i>
                </li>
                <li className="item">
                  <i className="fa-solid fa-envelope"></i>
                </li>
                <li className="item">
                  <i className="fa-brands fa-linkedin"></i>
                </li>
                <li className="item">
                  <i className="fa-brands fa-github"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageMobile;
