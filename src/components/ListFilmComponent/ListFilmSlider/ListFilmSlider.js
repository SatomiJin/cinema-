import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperComponent } from "swiper/react";
import { Pagination } from "swiper/modules";
import "./ListFilmSlider.scss";
import FilmSliderItem from "../FilmSliderItem/FilmSliderItem";
import { Link } from "react-router-dom";
import { useUiVersion } from "../../../context/UiVersionContext";

function ListFilmSlider(props) {
  const { isClassic } = useUiVersion();
  const listFilm = Array.isArray(props?.listFilm) ? props.listFilm : [];
  const renderFilmLink = (item, index) => {
    const content = <FilmSliderItem data={item} index={index} />;

    if (props?.onItemClick) {
      return (
        <button
          type="button"
          className="film-card-action"
          onClick={() => props.onItemClick(item)}
          aria-label={item?.name}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        className="film-card-action"
        to={`/${item?.type}/${item?.slug}`}
        aria-label={item?.name}
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="list-slider-component-container">
      <SwiperComponent
        className="list-slider_wrapper"
        modules={[Pagination]}
        spaceBetween={10}
        slidesPerGroup={1}
        speed={380}
        grabCursor
        preventInteractionOnTransition
        threshold={10}
        longSwipesRatio={0.25}
        longSwipesMs={300}
        resistanceRatio={0.25}
        touchReleaseOnEdges
        pagination={{ clickable: true, dynamicBullets: true, type: "bullets" }}
        breakpoints={
          isClassic
            ? {
                0: { slidesPerView: 3 },
                620: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }
            : {
                0: { slidesPerView: 2.15 },
                620: { slidesPerView: 3.25 },
                1024: { slidesPerView: 5.2 },
                1440: { slidesPerView: 6.2 },
              }
        }
      >
        {listFilm.length > 0 ? (
          listFilm.map((item, index) => {
            return (
              <SwiperSlide
                key={item?.slug || index}
                className="list-slider_item"
                style={{ "--index": `${index}` }}
              >
                {renderFilmLink(item, index)}
              </SwiperSlide>
            );
          })
        ) : props?.loading ? (
          [...Array(7)].map((_, index) => (
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
        ) : (
          <SwiperSlide className="list-slider_item list-slider_item--empty">
            <div className="film-rail-empty" role="status">
              <span aria-hidden="true">—</span>
              <p>{props?.emptyLabel}</p>
            </div>
          </SwiperSlide>
        )}
      </SwiperComponent>
    </div>
  );
}

export default ListFilmSlider;
