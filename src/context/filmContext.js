import React, { createContext, useState } from "react";

// Tạo context với giá trị mặc định
export const FilmContext = createContext();

export const FilmProvider = ({ children }) => {
  const [newFilmData, setNewFilmData] = useState([]);
  const [newSeriesData, setNewSeriesData] = useState([]);
  const [newMovieFilmData, setNewMovieFilmData] = useState([]);

  return (
    <FilmContext.Provider
      value={{
        newFilmData,
        setNewFilmData,
        newSeriesData,
        setNewSeriesData,
        newMovieFilmData,
        setNewMovieFilmData,
      }}
    >
      {children}
    </FilmContext.Provider>
  );
};
