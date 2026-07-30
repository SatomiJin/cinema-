import { useNavigate } from "react-router-dom";
import "./WatchMobile.scss";
import { useTranslation } from "react-i18next";
import EpisodesComponent from "../../EpisodesComponent/EpisodesComponent";
import DotLoading from "../../LoadingComponent/DotLoading";
function WatchMobile(props) {
  let navigate = useNavigate();
  let { t, i18n } = useTranslation();
  let data = props;
  // function
  const activeIndex = props?.episodes?.findIndex((episode) => episode.slug === props?.epInfo?.slug) ?? -1;
  const redirectOtherEp = (direction) => {
    const target = props?.episodes?.[activeIndex + direction];
    if (props?.filmInfo?.slug && target?.slug) navigate(`/xem-phim/${props.filmInfo.slug}/${target.slug}`);
  };
  return (
    <div className="mobile-container">
      <div className="container">
        <div className="row">
          <div className="name-episode_wrapper col col-12">
            {data?.filmInfo && data?.epInfo && data?.filmInfo?.name && data?.epInfo?.name ? (
              <>
                <div className="film_name">
                  <i className="fa-solid fa-film"></i> &nbsp;
                  {i18n.language === "en" ? data?.filmInfo?.origin_name : data?.filmInfo?.name}
                </div>
                <div className="film_episode">
                  {t("watching")}
                  {data?.epInfo && data?.epInfo?.name && data?.epInfo?.name.split(" ")?.length > 1
                    ? ` ${t("episode")} ${data?.epInfo?.name.split(" ")[1]}`
                    : ` ${t("episode")} ${data?.epInfo?.name}`}
                </div>
              </>
            ) : (
              <DotLoading />
            )}
          </div>
          <div className="episode_wrapper col col-12">
            {data?.epInfo && data?.epInfo?.name ? (
              ` ${t("episode")} ${
                (data?.epInfo && data?.epInfo?.name && data?.epInfo?.name.split(" ")[1]) || data?.epInfo?.name
              }`
            ) : (
              <DotLoading />
            )}
          </div>
          <div className="film-watching_wrapper col col-12">
            {data && data?.epInfo && data?.epInfo?.link_embed ? (
              <iframe
                className="film_video"
                title={data?.filmInfo?.origin_name}
                src={data && data?.epInfo?.link_embed}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="film_video">
                <DotLoading />
              </div>
            )}
          </div>
          <div className="film-buttons_wrapper col col-12">
            <button
              disabled={activeIndex <= 0}
              onClick={() => redirectOtherEp(-1)}
              type="button"
              className="btn film_button btn_prev_ep"
            >
              <i className="fa-solid fa-angle-left"></i> {t("prevEp")}
            </button>
            <button
              disabled={activeIndex < 0 || activeIndex >= props?.episodes?.length - 1}
              onClick={() => redirectOtherEp(1)}
              type="button"
              className="btn film_button btn_next_ep"
            >
              {t("nextEp")} <i className="fa-solid fa-angle-right"></i>
            </button>
          </div>
          <div className="film-episodes_wrapper col col-12">
            {data?.filmInfo && data?.filmInfo?.slug && data?.episodes?.length > 0 ? (
              <EpisodesComponent activeEpisode={data?.epInfo?.slug} slug={data?.filmInfo.slug} episodes={data?.episodes} />
            ) : (
              <DotLoading />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchMobile;
