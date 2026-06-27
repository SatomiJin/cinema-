export const SEARCH_CATEGORY_QUERY_KEY = "category";

export const getSearchCategoryByLocation = (location) => {
  const searchParams = new URLSearchParams(location?.search || "");
  const categoryFromQuery = searchParams.get(SEARCH_CATEGORY_QUERY_KEY);

  if (categoryFromQuery) return categoryFromQuery;

  const pathParts = (location?.pathname || "").split("/").filter(Boolean);
  const genreIndex = pathParts.findIndex((item) => item === "the-loai");

  return genreIndex >= 0 ? pathParts[genreIndex + 1] : "";
};

export const getSearchCategoryQuery = (category) => {
  return category ? `?${SEARCH_CATEGORY_QUERY_KEY}=${category}` : "";
};
