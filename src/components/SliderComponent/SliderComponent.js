import "./SliderComponent.scss";
// import imageTest from "../../assets/image/poster-film.png";
import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperComponent } from "swiper/react";
import { Navigation, Pagination, Grid, Autoplay } from "swiper/modules";
import { useMutationHook } from "../../hooks/useMutationHook";
import SliderItem from "./SliderItem";
import * as FilmService from "../../services/FilmService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
function SliderComponent() {
  let [dataAnime, setDataAnime] = useState([]);
  let navigate = useNavigate();
  let mutationGet = useMutationHook(() => FilmService.getListAnime());
  let { data } = mutationGet;

  // function
  const getAnimeData = async () => {
    await mutationGet.mutate();
  };
  const moveToFilm = (slug, type) => {
    navigate(`/${type}/${slug}`);
  };

  // useEffect
  useEffect(() => {
    getAnimeData();
  }, []);

  useEffect(() => {
    if (data && data.status === "success") {
      setDataAnime(data?.data.items);
    }
  }, [data]);
  return (
    <div className="slider-component-container">
      <div className="slider-wrapper">
        <SwiperComponent
          modules={[Navigation, Pagination, Grid, Autoplay]}
          spaceBetween={10}
          grabCursor
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          // autoplay={true}
          // loop={true}
          pagination={{ clickable: true, dynamicBullets: true, type: "bullets" }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            620: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="card-list"
        >
          {dataAnime && dataAnime.length > 0 ? (
            dataAnime.map((item, index) => {
              return (
                <SwiperSlide onClick={() => moveToFilm(item?.slug, item?.type)} key={index} className="card-item">
                  <SliderItem data={item} addLink={data?.data?.APP_DOMAIN_CDN_IMAGE} />
                </SwiperSlide>
              );
            })
          ) : (
            <div className="card-item">
              <LoadingComponent />
            </div>
          )}
        </SwiperComponent>
      </div>
    </div>
  );
}

export default SliderComponent;
