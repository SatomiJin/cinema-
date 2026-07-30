import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./NotFoundPage.scss";

function NotFoundPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === "en";

  return (
    <div className="not-found-page" aria-labelledby="not-found-title">
      <section className="not-found-page__panel">
        <span className="not-found-page__eyebrow">Projection room / 404</span>
        <div className="not-found-page__reel" aria-hidden="true">404</div>
        <h1 id="not-found-title">
          {isEnglish ? "This reel is not in the archive." : "Thước phim này không có trong kho."}
        </h1>
        <p>
          {isEnglish
            ? "The link may be out of date, or the title is no longer available."
            : "Liên kết có thể đã cũ hoặc tựa phim không còn khả dụng."}
        </p>
        <Link className="not-found-page__cta" to="/">
          {isEnglish ? "Return to the lobby" : "Về sảnh phim"}
        </Link>
      </section>
    </div>
  );
}

export default NotFoundPage;
