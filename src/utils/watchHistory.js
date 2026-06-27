const WATCH_HISTORY_KEY = "cinema_watch_history";
export const WATCH_HISTORY_EVENT = "cinema-watch-history-updated";

const MAX_WATCH_HISTORY = 10;

export const getWatchHistory = () => {
  try {
    const storedHistory = localStorage.getItem(WATCH_HISTORY_KEY);
    const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];

    return Array.isArray(parsedHistory) ? parsedHistory : [];
  } catch (error) {
    return [];
  }
};

export const saveWatchHistory = ({ filmInfo, epInfo }) => {
  if (!filmInfo?.slug || !epInfo?.slug) return;

  const watchedFilm = {
    name: filmInfo?.name,
    origin_name: filmInfo?.origin_name,
    poster_url: filmInfo?.poster_url,
    thumb_url: filmInfo?.thumb_url,
    slug: filmInfo?.slug,
    type: filmInfo?.type,
    episodeSlug: epInfo?.slug,
    episodeName: epInfo?.name,
    watchedAt: new Date().toISOString(),
  };

  const nextHistory = [
    watchedFilm,
    ...getWatchHistory().filter((item) => item?.slug !== filmInfo.slug),
  ].slice(0, MAX_WATCH_HISTORY);

  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(nextHistory));
  window.dispatchEvent(new Event(WATCH_HISTORY_EVENT));
};
