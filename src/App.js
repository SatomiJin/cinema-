import React, { useEffect, useLayoutEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useTranslation } from "react-i18next";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import { routes } from "./routes/index";
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
import { UiVersionProvider } from "./context/UiVersionContext";
import "./styles/classicUi.scss";

export function NativeBackHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") {
      return undefined;
    }

    let isDisposed = false;
    let listenerHandle;

    void CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        navigate(-1);
        return;
      }

      void CapacitorApp.minimizeApp();
    }).then((handle) => {
      if (isDisposed) {
        void handle.remove();
        return;
      }

      listenerHandle = handle;
    });

    return () => {
      isDisposed = true;
      if (listenerHandle) {
        void listenerHandle.remove();
      }
    };
  }, [navigate]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location.key, navigationType]);

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        className="route-transition"
        key={location.key}
        initial={{ opacity: 0.35, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 0.16, ease: "easeOut" },
          y: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{ willChange: "opacity, transform" }}
      >
        <Routes location={location}>
          {routes.map((item) => {
            const Page = item.page;

            return <Route element={<Page />} key={item.path} path={item.path} />;
          })}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  let { i18n } = useTranslation();

  useEffect(() => {
    let lang = localStorage.getItem("language");
    if (lang) {
      i18n.changeLanguage(lang);
    }

    const updateDocumentLanguage = (nextLanguage) => {
      document.documentElement.lang = nextLanguage?.startsWith("en") ? "en" : "vi";
    };

    updateDocumentLanguage(lang || i18n.resolvedLanguage || i18n.language);
    i18n.on("languageChanged", updateDocumentLanguage);

    return () => i18n.off("languageChanged", updateDocumentLanguage);
  }, [i18n]);
  return (
    <div className="App">
      <UiVersionProvider>
        <Router>
          <NativeBackHandler />
          <MotionConfig reducedMotion="user">
            <DefaultLayout>
              <AnimatedRoutes />
            </DefaultLayout>
          </MotionConfig>
        </Router>
      </UiVersionProvider>
    </div>
  );
}

export default App;
