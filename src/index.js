import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/mainStyle.scss";
import "./language/i18n";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import "rc-pagination/assets/index.css";
import { FilmProvider } from "./context/filmContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <FilmProvider>
        <App />
      </FilmProvider>
    </React.StrictMode>
  </QueryClientProvider>
);
