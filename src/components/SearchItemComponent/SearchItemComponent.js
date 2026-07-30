import { useTranslation } from "react-i18next";
import "./SearchItemComponent.scss";
import { useNavigate } from "react-router-dom";
function SearchItemComponent({ filmItem, linkImage, setSearchInputPC, setSearchInputMobile, setSearchInputTablet, onSelect }) {
  const { i18n, t } = useTranslation(); const navigate = useNavigate();
  const handleWatchFilm = () => { navigate(`/${filmItem?.type}/${filmItem?.slug}`); setSearchInputPC?.(""); setSearchInputMobile?.(""); setSearchInputTablet?.(""); onSelect?.(); };
  return <button className="search-item_container" type="button" onClick={handleWatchFilm}><span className="poster"><span className="image" style={{ backgroundImage: `url(${linkImage}/${filmItem?.thumb_url})` }} /></span><span className="film-info"><span className="name">{i18n.language === "en" ? filmItem?.origin_name : filmItem?.name}</span><span className="type">{filmItem?.type === "hoathinh" ? t("cartoon") : filmItem?.type === "series" ? t("series") : t("movie")}</span></span></button>;
}
export default SearchItemComponent;
