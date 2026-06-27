import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ListFilmComponent from "../ListFilmComponent/ListFilmComponent";
import { getWatchHistory, WATCH_HISTORY_EVENT } from "../../utils/watchHistory";

function WatchHistoryComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    const syncWatchHistory = () => {
      setWatchHistory(getWatchHistory());
    };

    syncWatchHistory();
    window.addEventListener("storage", syncWatchHistory);
    window.addEventListener(WATCH_HISTORY_EVENT, syncWatchHistory);

    return () => {
      window.removeEventListener("storage", syncWatchHistory);
      window.removeEventListener(WATCH_HISTORY_EVENT, syncWatchHistory);
    };
  }, []);

  const handleWatchAgain = (item) => {
    if (item?.slug && item?.episodeSlug) {
      navigate(`/xem-phim/${item.slug}/${item.episodeSlug}`);
    }
  };

  if (!watchHistory.length) return null;

  return (
    <ListFilmComponent
      data={watchHistory}
      name={t("watchHistory")}
      hideSeeMore
      onItemClick={handleWatchAgain}
    />
  );
}

export default WatchHistoryComponent;
