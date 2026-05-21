import { setMapTheme } from "../map.js";
import { getStoredTheme, saveTheme } from "../storage.js";
import { state } from "../state/appState.js";
import { renderThemeButton, updateCharts } from "../ui/appView.js";

export const applyTheme = (theme) => {
  const normalizedTheme = theme === "dark" ? "dark" : "light";

  document.body.classList.toggle("dark", normalizedTheme === "dark");
  saveTheme(normalizedTheme);
  setMapTheme(normalizedTheme);
  renderThemeButton();
  updateCharts(state);
};

export const initTheme = () => {
  document.body.classList.toggle("dark", getStoredTheme() === "dark");
  renderThemeButton();
};
