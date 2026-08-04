import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter, MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { NativeBackHandler } from "./App";

jest.mock("@capacitor/app", () => ({
  App: {
    addListener: jest.fn(),
    minimizeApp: jest.fn(),
  },
}));

jest.mock("@capacitor/core", () => ({
  Capacitor: {
    getPlatform: jest.fn(),
    isNativePlatform: jest.fn(),
  },
}));

jest.mock("./routes/index", () => ({ routes: [] }));
jest.mock("./layouts/DefaultLayout/DefaultLayout", () => ({ children }) => <>{children}</>);

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="current route">{location.pathname}</output>;
}

function NavigateToFilm() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/phim-le/test-film")}>Open film</button>;
}

describe("NativeBackHandler", () => {
  let backButtonListener;
  let removeListener;

  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    backButtonListener = undefined;
    removeListener = jest.fn().mockResolvedValue(undefined);
    Capacitor.isNativePlatform.mockReturnValue(true);
    Capacitor.getPlatform.mockReturnValue("android");
    CapacitorApp.minimizeApp.mockResolvedValue(undefined);
    CapacitorApp.addListener.mockImplementation((_eventName, listener) => {
      backButtonListener = listener;
      return Promise.resolve({ remove: removeListener });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns to the previous React route when Android history can go back", async () => {
    const view = render(
      <MemoryRouter initialEntries={["/film", "/watch"]} initialIndex={1}>
        <NativeBackHandler />
        <LocationProbe />
      </MemoryRouter>,
    );

    await waitFor(() => expect(CapacitorApp.addListener).toHaveBeenCalledWith("backButton", expect.any(Function)));

    act(() => backButtonListener({ canGoBack: true }));

    expect(screen.getByLabelText("current route")).toHaveTextContent("/film");
    expect(CapacitorApp.minimizeApp).not.toHaveBeenCalled();

    view.unmount();
    await waitFor(() => expect(removeListener).toHaveBeenCalledTimes(1));
  });

  test("returns from a film route when the WebView does not see React Router history", async () => {
    render(
      <BrowserRouter>
        <NativeBackHandler />
        <NavigateToFilm />
        <LocationProbe />
      </BrowserRouter>,
    );

    await waitFor(() => expect(backButtonListener).toEqual(expect.any(Function)));

    fireEvent.click(screen.getByRole("button", { name: "Open film" }));
    expect(screen.getByLabelText("current route")).toHaveTextContent("/phim-le/test-film");
    expect(window.history.state.idx).toBe(1);

    act(() => backButtonListener({ canGoBack: false }));

    await waitFor(() => expect(screen.getByLabelText("current route")).toHaveTextContent(/^\/$/));
    expect(CapacitorApp.minimizeApp).not.toHaveBeenCalled();
  });

  test("minimizes the Android app at the first history entry", async () => {
    render(
      <MemoryRouter>
        <NativeBackHandler />
      </MemoryRouter>,
    );

    await waitFor(() => expect(backButtonListener).toEqual(expect.any(Function)));

    act(() => backButtonListener({ canGoBack: false }));

    expect(CapacitorApp.minimizeApp).toHaveBeenCalledTimes(1);
  });

  test("does not register a native listener in the web build", () => {
    Capacitor.isNativePlatform.mockReturnValue(false);

    render(
      <MemoryRouter>
        <NativeBackHandler />
      </MemoryRouter>,
    );

    expect(CapacitorApp.addListener).not.toHaveBeenCalled();
  });
});
