import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../../../hooks/useDebounceHook";
import { useQuery } from "@tanstack/react-query";
import * as FilmService from "../../../../services/FilmService";
import SearchItemComponent from "../../../../components/SearchItemComponent/SearchItemComponent";
import "./SearchMobile.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { getSearchCategoryByLocation, getSearchCategoryQuery } from "../../../../utils/searchScope";
function SearchMobile({ onClose }) {
  const { t } = useTranslation(); const [searchInput, setSearchInput] = useState(""); const inputRef = useRef(null);
  const searchDebounce = useDebounce(searchInput, 500); const navigate = useNavigate(); const location = useLocation(); const searchCategory = getSearchCategoryByLocation(location);
  const { data } = useQuery({ queryKey: ["film", 10, searchDebounce, searchCategory], queryFn: ({ queryKey }) => FilmService.searchFilm(queryKey[2], queryKey[1], 1, { category: queryKey[3] }), retry: 3, retryDelay: 1000, keepPreviousData: true, enabled: Boolean(searchDebounce.trim()) });
  useEffect(() => { inputRef.current?.focus(); const escape = (event) => { if (event.key === "Escape") onClose(); }; document.addEventListener("keydown", escape); return () => document.removeEventListener("keydown", escape); }, [onClose]);
  const submit = () => { const value = searchInput.trim(); if (!value) return; navigate(`/tim-kiem/${value.split(" ").join("-")}/trang=1${getSearchCategoryQuery(searchCategory)}`); setSearchInput(""); onClose(); };
  const items = data?.status === "success" ? data?.data?.items || [] : [];
  return <div className="search-mobile-container" role="dialog" aria-modal="true" aria-label={t("search")}><form className="container" role="search" onSubmit={(event) => { event.preventDefault(); submit(); }}><div className="row"><div className="input_wrapper"><input ref={inputRef} onChange={(event) => setSearchInput(event.target.value)} type="search" value={searchInput} className="input_search-mobile" placeholder={t("search")} aria-label={t("search")} /><button type="submit" className="search-submit" aria-label="Search"><Search aria-hidden="true" size={19} /></button><div className="search-result" hidden={!searchDebounce.trim()}>{items.map((item) => <SearchItemComponent key={item.slug} setSearchInputMobile={setSearchInput} onSelect={onClose} filmItem={item} linkImage={data?.data?.APP_DOMAIN_CDN_IMAGE} />)}</div></div><button className="close_button-mobile" type="button" aria-label="Close search" onClick={onClose}><X aria-hidden="true" size={21} /></button></div></form></div>;
}
export default SearchMobile;
