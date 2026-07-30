import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UiVersionToggle from "../components/ui/UiVersionToggle";
import { UiVersionProvider } from "./UiVersionContext";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, values) => {
      if (key === "classicUi") return "Cổ điển";
      if (key === "modernUi") return "Hiện đại";
      if (key === "switchUi") return `Chuyển sang giao diện ${values.ui}`;
      return key;
    },
  }),
}));

describe("UiVersionProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.uiVersion;
  });

  test("defaults to Modern and persists a switch to Classic", async () => {
    render(
      <UiVersionProvider>
        <UiVersionToggle />
      </UiVersionProvider>,
    );

    const toggle = screen.getByRole("button", { name: /chuyển sang giao diện cổ điển/i });
    expect(toggle).toHaveTextContent("Hiện đại");

    fireEvent.click(toggle);

    expect(screen.getByRole("button", { name: /chuyển sang giao diện hiện đại/i })).toHaveTextContent("Cổ điển");
    await waitFor(() => {
      expect(document.documentElement.dataset.uiVersion).toBe("classic");
      expect(localStorage.getItem("ui-version")).toBe("classic");
    });
  });

  test("restores a saved Classic preference", async () => {
    localStorage.setItem("ui-version", "classic");

    render(
      <UiVersionProvider>
        <UiVersionToggle />
      </UiVersionProvider>,
    );

    expect(screen.getByRole("button", { name: /chuyển sang giao diện hiện đại/i })).toHaveTextContent("Cổ điển");
    await waitFor(() => expect(document.documentElement.dataset.uiVersion).toBe("classic"));
  });
});
