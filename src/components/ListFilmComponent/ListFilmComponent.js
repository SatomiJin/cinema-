import { useTranslation } from "react-i18next";
import "./ListFilmComponent.scss";
import ListFilmSlider from "./ListFilmSlider/ListFilmSlider";
import { Link } from "react-router-dom";

function ListFilmComponent(props) {
  const { t } = useTranslation();
  const listFilm = Array.isArray(props?.data) ? props.data : [];

  return (
    <div className="list-film-container">
      <div className="row">
        <div className="content-top col-12">
          <h2 className="content-top_title">{props?.name}</h2>
          {!props?.hideSeeMore && props?.path && (
            <div className="content-top_buttons">
              <Link className="see-more" to={props.path}>
                {t("seeMore")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
        <div className="content-bottom">
          <ListFilmSlider
            listFilm={listFilm}
            loading={props?.loading}
            emptyLabel={props?.name}
            onItemClick={props?.onItemClick}
          />
        </div>
      </div>
    </div>
  );
}

export default ListFilmComponent;
