import { useTranslation } from "react-i18next";
import "./SearchItemComponent.scss";
import { useNavigate } from "react-router-dom";
function SearchItemComponent(props) {
  let { i18n, t } = useTranslation();
  let navigate = useNavigate();
  const handleWatchFilm = (data) => {
    navigate(`/${data?.type}/${data?.slug}`);
    props?.setSearchInputPC && props?.setSearchInputPC("");
    props?.setSearchInputMobile && props?.setSearchInputMobile("");
    props?.setSearchInputTablet && props?.setSearchInputTablet("");
  };

  return (
    <div className="search-item_container" onClick={() => handleWatchFilm(props?.filmItem)}>
      <div className="container">
        <div className="row">
          <div className="poster col col-4">
            <div
              className="image"
              style={{ backgroundImage: `url(${props?.linkImage}/${props?.filmItem?.thumb_url})` }}
            ></div>
          </div>
          <div className="film-info col col-8">
            <div className="name">{i18n.language === "en" ? props?.filmItem?.origin_name : props?.filmItem?.name} </div>
            <div className="type">
              {props?.filmItem?.type === "hoathinh"
                ? t("cartoon")
                : props?.filmItem?.type === "series"
                ? t("series")
                : t("movie")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchItemComponent;
