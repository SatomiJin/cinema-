import { useEffect, useState } from "react";
import "./FilmInfoPcTablet.scss";
import { useTranslation } from "react-i18next";
import ListEpisodePcTablets from "../../listEpisodeComponent/PcTablet/ListEpisodePcTablet";
import DotLoading from "../../LoadingComponent/DotLoading";
function FilmInfoPcTablet(props) {
  let [data, setData] = useState({});
  let [episodes, setEpisodes] = useState({});
  let { t, i18n } = useTranslation();

  useEffect(() => {
    if (props?.data?.name) setData(props.data);
    if (props?.episodes) setEpisodes(props?.episodes);
  }, [props.data]);
  return (
    <div className="film-info-pc_container">
      <div className="container">
        <div className="row">
          <div className="film-name col col-12">{i18n.language === "en" ? data?.origin_name : data?.name}</div>
          <div className="film-info_wrapper col col-12">
            <div className="row">
              <div className="film_poster col-4">
                {data && data?.poster_url ? (
                  <div className="image" style={{ backgroundImage: `url(${data && data?.poster_url})` }}></div>
                ) : (
                  <DotLoading />
                )}
              </div>
              <div className="film_info col-8">
                {data && data?.origin_name ? (
                  <>
                    <div className="film_info-item">
                      <div className="item_title">{t("originName")}</div>
                      <div className="item_info">{data?.origin_name}</div>
                    </div>
                    <div className="film_info-item">
                      <div className="item_title">{t("filmCategory")}</div>
                      <div className="item_info">
                        {data &&
                          data?.category &&
                          data?.category.length > 0 &&
                          data?.category.map((item, index) => {
                            return <span key={index}>{item.name}, </span>;
                          })}
                      </div>
                    </div>
                    <div className="film_info-item">
                      <div className="item_title">{t("filmStatus")}</div>
                      <div className="item_info" style={{ textTransform: "uppercase" }}>
                        {data?.status === "completed" ? t("filmCompleted") : t("filmGoingOn")}
                      </div>
                    </div>
                    <div className="film_info-item">
                      <div className="item_title">{t("yearRelease")}</div>
                      <div className="item_info">{data?.year}</div>
                    </div>
                    <div className="film_info-item">
                      <div className="item_title">{t("time")}</div>
                      <div className="item_info">
                        {data?.episode_total} {t("episode")}
                      </div>
                    </div>
                  </>
                ) : (
                  <DotLoading />
                )}
              </div>
            </div>
          </div>
          <div className="film-play_buttons col col-12">
            <button type="button" className="btn play_button">
              <i className="fa-regular fa-circle-play"></i>
            </button>
          </div>
          <div className="episode-desc_content col col-12">
            <div className="row">
              <div className="list-episodes">
                <div className="list-episodes_title">{t("listEp")}</div>
                <div className="list-episodes_wrapper">
                  {data && data?.slug ? (
                    <ListEpisodePcTablets slug={data?.slug} episodes={episodes?.server_data} />
                  ) : (
                    <DotLoading />
                  )}
                </div>
              </div>

              <div className="description">
                <div className="title">{t("filmDesc")}</div>
                <div className="film_desc">{data?.content ? data?.content : <DotLoading />}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilmInfoPcTablet;
