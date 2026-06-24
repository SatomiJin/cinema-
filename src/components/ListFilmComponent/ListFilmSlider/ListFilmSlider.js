import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperComponent } from "swiper/react";
import { Navigation, Pagination, Grid } from "swiper/modules";
import "./ListFilmSlider.scss";
import FilmSliderItem from "../FilmSliderItem/FilmSliderItem";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function ListFilmSlider(props) {
  let [listFilm, setListFilm] = useState([]);
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
                onClick={() => moveToFilm(item)}
                key={index}
                className="list-slider_item"
                style={{ "--index": `${index}`, cursor: "pointer" }}
              >
                <FilmSliderItem data={item} index={index} />
              </SwiperSlide>
            );
          })
        ) : (
          [...Array(5)].map((_, index) => (
            <SwiperSlide
              key={index}
              className="list-slider_item list-slider_item--skeleton"
              style={{ "--index": `${index}` }}
            >
              <div className="skeleton-film-item">
                <div className="skeleton-poster"></div>
                <div className="skeleton-line skeleton-line--name"></div>
                <div className="skeleton-line skeleton-line--origin"></div>
              </div>
            </SwiperSlide>
          ))
        )}
      </SwiperComponent>
    </div>
  );
}

export default ListFilmSlider;
