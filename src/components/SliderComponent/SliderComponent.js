import "./SliderComponent.scss";
// import imageTest from "../../assets/image/poster-film.png";
import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperComponent } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useMutationHook } from "../../hooks/useMutationHook";
import SliderItem from "./SliderItem";
import * as FilmService from "../../services/FilmService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUiVersion } from "../../context/UiVersionContext";
import "./SliderSkeleton.scss";

function SliderComponent() {
  const { t } = useTranslation();
  const { isClassic } = useUiVersion();
  const [dataAnime, setDataAnime] = useState([]);
  const mutationGet = useMutationHook(() => FilmService.getListAnime());
  const { data, mutate, isIdle, isPending } = mutationGet;

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (data && data.status) {
      setDataAnime(data?.data?.items || []);
    }
  }, [data]);

  const isLoading = isIdle || isPending;
  const hasFilms = dataAnime.length > 0;

  return (
    <div className="slider-component-container" aria-labelledby="now-projecting-title">
      <div className="projection-heading">
        <span className="projection-heading__signal" aria-hidden="true"></span>
        <h1 id="now-projecting-title">{t("newAnimeFilm")}</h1>
      </div>
      <div className="slider-wrapper">
        <SwiperComponent
          modules={[Pagination]}
          slidesPerView={1}
          slidesPerGroup={1}
          spaceBetween={isClassic ? 10 : 0}
          speed={420}
          watchOverflow
          grabCursor
          preventInteractionOnTransition
          threshold={10}
          longSwipesRatio={0.25}
          longSwipesMs={300}
          resistanceRatio={0.25}
          touchReleaseOnEdges
          pagination={{
            clickable: true,
            dynamicBullets: true,
            type: "bullets",
          }}
          breakpoints={
            isClassic
              ? {
                  0: { slidesPerView: 1 },
                  620: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }
              : undefined
          }
          className="card-list"
        >
          {hasFilms ? (
            dataAnime.map((item, index) => {
              return (
                <SwiperSlide
                  key={item?.slug || index}
                  className="card-item"
                >
                  <Link
                    className="projection-link"
                    to={`/${item?.type}/${item?.slug}`}
                    aria-label={item?.name}
                  >
                    <SliderItem
                      data={item}
                      addLink={data?.data?.APP_DOMAIN_CDN_IMAGE}
                      priority={index === 0}
                    />
                  </Link>
                </SwiperSlide>
              );
            })
          ) : isLoading ? (
            [1, 2, 3].map((i) => (
              <SwiperSlide key={i} className="card-item">
                <div className="slider-skeleton">
                  <div className="slider-skeleton__poster"></div>
                  <div className="slider-skeleton__badge"></div>
                  <div className="slider-skeleton__line slider-skeleton__line--title"></div>
                  <div className="slider-skeleton__line slider-skeleton__line--sub"></div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className="card-item">
              <div className="projection-empty" role="status">
                <span aria-hidden="true">—</span>
                <p>{t("newAnimeFilm")}</p>
              </div>
            </SwiperSlide>
          )}
        </SwiperComponent>
      </div>
    </div>
  );
}

export default SliderComponent;
