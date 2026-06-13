import React, { createContext, useState } from "react";

// Tạo context với giá trị mặc định
export const FilmContext = createContext();

export const FilmProvider = ({ children }) => {
  const [newFilmData, setNewFilmData] = useState([]);
  const [newSeriesData, setNewSeriesData] = useState([]);
  const [newMovieFilmData, setNewMovieFilmData] = useState([]);
  const [newAnimeData, setNewAnimeData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  return (
    <FilmContext.Provider
      value={{
        newFilmData,
        setNewFilmData,
        newSeriesData,
        setNewSeriesData,
        newMovieFilmData,
        setNewMovieFilmData,
        newAnimeData,
        setNewAnimeData,
        searchLoading,
        setSearchLoading,
      }}
    >
      {children}
    </FilmContext.Provider>
  );
};
