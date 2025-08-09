import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes/index";
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
function App() {
  let { i18n } = useTranslation();
  const getLanguage = () => {
    let lang = localStorage.getItem("language");
    if (lang) {
      i18n.changeLanguage(lang);
    }
  };
  useEffect(() => {
    getLanguage();
  }, []);
  return (
    <div className="App">
      <Router>
        <Routes>
          {routes &&
            routes.length > 0 &&
            routes.map((item, index) => {
              let Page = item.page;
              let path = item.path;
              let Layout = DefaultLayout;
              let isLogin = item.isLogin;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <DefaultLayout>
                      <Page />
                    </DefaultLayout>
                  }
                />
              );
            })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
