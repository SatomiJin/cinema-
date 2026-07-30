import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./SearchPcComponent.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { getSearchCategoryByLocation, getSearchCategoryQuery } from "../../../utils/searchScope";
function SearchPcComponent() {
  const { t } = useTranslation(); const [searchInput, setSearchInput] = useState(""); const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); const location = useLocation(); const containerRef = useRef(null); const inputRef = useRef(null);
  const searchCategory = getSearchCategoryByLocation(location);
  const close = () => setIsOpen(false);
  const handleSearch = () => { const value = searchInput.trim(); if (!value) return; navigate(`/tim-kiem/${value.split(" ").join("-")}/trang=1${getSearchCategoryQuery(searchCategory)}`); setSearchInput(""); close(); };
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);
  useEffect(() => { const onPointerDown = (event) => { if (containerRef.current && !containerRef.current.contains(event.target)) close(); }; const onKeyDown = (event) => { if (event.key === "Escape") close(); }; document.addEventListener("mousedown", onPointerDown); document.addEventListener("keydown", onKeyDown); return () => { document.removeEventListener("mousedown", onPointerDown); document.removeEventListener("keydown", onKeyDown); }; }, []);
  return <div className={`search-container ${isOpen ? "open" : ""}`} ref={containerRef}>
    <button type="button" className="search-icon" aria-label="Open search" aria-expanded={isOpen} aria-controls="desktop-search-popup" onClick={() => setIsOpen(!isOpen)}><Search aria-hidden="true" size={19} /></button>
    {isOpen && <form id="desktop-search-popup" className="search-popup" role="search" onSubmit={(event) => { event.preventDefault(); handleSearch(); }}><input ref={inputRef} onChange={(event) => setSearchInput(event.target.value)} className="search" type="search" placeholder={t("search")} value={searchInput} name="search" aria-label={t("search")} /><button className="search-button" type="submit" aria-label="Search"><Search aria-hidden="true" size={18} /></button><button className="search-close" type="button" aria-label="Close search" onClick={close}><X aria-hidden="true" size={18} /></button></form>}
  </div>;
}
export default SearchPcComponent;
