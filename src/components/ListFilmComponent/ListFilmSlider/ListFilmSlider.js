import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperComponent } from "swiper/react";
import { Navigation, Pagination, Grid } from "swiper/modules";
import "./ListFilmSlider.scss";
import FilmSliderItem from "../FilmSliderItem/FilmSliderItem";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../../LoadingComponent/LoadingComponent";
function ListFilmSlider(props) {
  let [listFilm, setListFilm] = useState([]);
  let { t } = useTranslation();
  // function
  let navigate = useNavigate();
  const moveToFilm = (item) => {
    navigate(`/${item?.type}/${item?.slug}`);
  };

  useEffect(() => {
    if (props && props?.listFilm && props?.listFilm?.length > 0) {
      setListFilm([...props?.listFilm]);
    }
  }, [props]);
  return (
    <div className="list-slider-component-container">
      <SwiperComponent
        className="list-slider_wrapper"
        modules={[Navigation, Pagination, Grid]}
        spaceBetween={10}
        grabCursor
        pagination={{ clickable: true, dynamicBullets: true, type: "bullets" }}
        breakpoints={{
          0: {
            slidesPerView: 3,
          },
          620: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
      >
        {listFilm && listFilm?.length > 5 ? (
          listFilm?.map((item, index) => {
            return (
              <SwiperSlide
                style={{ cursor: "pointer" }}
                onClick={() => moveToFilm(item)}
                key={index}
                className="list-slider_item"
              >
                <FilmSliderItem data={item} />
              </SwiperSlide>
            );
          })
        ) : (
          <div className="list-slider_item">
            <LoadingComponent />
          </div>
        )}
      </SwiperComponent>
    </div>
  );
}

export default ListFilmSlider;
