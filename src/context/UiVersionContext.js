import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const UI_VERSIONS = {
  CLASSIC: "classic",
  MODERN: "modern",
};

const UI_VERSION_STORAGE_KEY = "ui-version";
const UiVersionContext = createContext(null);

const readInitialUiVersion = () => {
  try {
    const storedVersion = localStorage.getItem(UI_VERSION_STORAGE_KEY);
    return storedVersion === UI_VERSIONS.CLASSIC ? UI_VERSIONS.CLASSIC : UI_VERSIONS.MODERN;
  } catch (_error) {
    return UI_VERSIONS.MODERN;
  }
};

export function UiVersionProvider({ children }) {
  const [uiVersion, setUiVersionState] = useState(readInitialUiVersion);

  const setUiVersion = useCallback((nextVersion) => {
    setUiVersionState(nextVersion === UI_VERSIONS.CLASSIC ? UI_VERSIONS.CLASSIC : UI_VERSIONS.MODERN);
  }, []);

  const toggleUiVersion = useCallback(() => {
    setUiVersionState((currentVersion) =>
      currentVersion === UI_VERSIONS.MODERN ? UI_VERSIONS.CLASSIC : UI_VERSIONS.MODERN,
    );
  }, []);

  useEffect(() => {
    document.documentElement.dataset.uiVersion = uiVersion;

    try {
      localStorage.setItem(UI_VERSION_STORAGE_KEY, uiVersion);
    } catch (_error) {
      // The UI can still switch for this session when storage is unavailable.
    }
  }, [uiVersion]);

  const value = useMemo(
    () => ({
      isClassic: uiVersion === UI_VERSIONS.CLASSIC,
      setUiVersion,
      toggleUiVersion,
      uiVersion,
    }),
    [setUiVersion, toggleUiVersion, uiVersion],
  );

  return <UiVersionContext.Provider value={value}>{children}</UiVersionContext.Provider>;
}

export function useUiVersion() {
  const context = useContext(UiVersionContext);

  if (!context) {
    throw new Error("useUiVersion must be used inside UiVersionProvider");
  }

  return context;
}
