import defaultPoster from "../assets/image/poster-film.png";

export const IMAGE_CDN_BASE = "https://phimimg.com";

export const getImageUrl = (url) => {
  if (!url) return defaultPoster;
  if (/^(https?:)?\/\//i.test(url)) return url;

  return `${IMAGE_CDN_BASE}/${url.replace(/^\/+/, "")}`;
};

export const handleImageError = (event) => {
  if (event.target.src === defaultPoster) return;
  event.target.onerror = null;
  event.target.src = defaultPoster;
};

export { defaultPoster };
