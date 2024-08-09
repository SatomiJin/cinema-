import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DotLoading from "../../LoadingComponent/DotLoading";
import "./FilmInfoMobile.scss";

function FilmInfoMobile(props) {
  let [data, setData] = useState({});
  let [episodes, setEpisodes] = useState({});
  let { t, i18n } = useTranslation();

  useEffect(() => {
    if (props?.data?.name !== "") setData(props?.data);
    if (props?.episodes && props?.episodes?.server_data && props?.episodes?.server_data?.length > 0)
      setEpisodes(props?.episodes?.server_data);
  }, [props.data]);
  let navigate = useNavigate();

  const watchFilm = (item) => {
    navigate(`/xem-phim/${data?.slug}/${item?.slug}`);
  };
  return (
    <div className="film-info-mobile_container">
      <div className="container">
        <div className="row">
          <div className="film-name col col-12">{i18n.language === "en" ? data?.origin_name : data?.name}</div>
          <div className="film-info_wrapper col col-12">
            <div className="wrapper_poster">
              {data && data?.thumb_url ? (
                <div className="image" style={{ backgroundImage: `url(${data?.thumb_url})` }}></div>
              ) : (
                <DotLoading />
              )}
            </div>
            <div className="wrapper_info">
              {data && data?.origin_name ? (
                <>
                  <div className="wrapper_info-item">{data?.origin_name}</div>
                  <div className="wrapper_info-item">
                    {data &&
                      data?.category &&
                      data?.category.length > 0 &&
                      data?.category.map((item, index) => {
                        return <span key={index}>{item.name}, </span>;
                      })}
                  </div>
                  <div className="wrapper_info-item">
                    {data?.status === "completed" ? t("filmCompleted") : t("filmGoingOn")}
                  </div>
                  <div className="wrapper_info-item">{data?.year}</div>
                  <div className="wrapper_info-item">
                    {data?.episode_total} {t("episode")}
                  </div>
                </>
              ) : (
                <DotLoading />
              )}
            </div>
          </div>
          <div className="film-button_wrapper col col-12">
            <div className="buttons">
              <button type="button" className="btn film-play_button">
                <i className="fa-solid fa-play"></i>
              </button>
            </div>
          </div>

          <div className="film-episode col col-12">
            <div className="wrapper">
              <div className="title">{t("listEp")}</div>
              <div className="episodes">
                {episodes && episodes?.length > 0 ? (
                  episodes?.map((item, index) => {
                    return (
                      <button onClick={() => watchFilm(item)} key={index} type="button" className="btn episode_button">
                        {index + 1}
                      </button>
                    );
                  })
                ) : (
                  <DotLoading />
                )}
              </div>
            </div>
          </div>
          <div className="film-desc col col-12">
            <div className="wrapper">
              <div className="title">{t("filmDesc")}</div>
              <div className="desc">{data?.content ? data?.content : <DotLoading />}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilmInfoMobile;
