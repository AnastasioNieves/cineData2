import { initCharts, resizeCharts, updateGenreChart, updatePopularityChart } from "../charts.js?v=20260514";
import { elements } from "../dom.js";
import { countGenres, toPopularityDataset } from "../filters.js";
import { refreshProductionMap } from "../map.js";
import { renderGenreOptions, renderHistory, renderResults } from "../render.js";
import { getSearchHistory } from "../storage.js";
import { VISUAL_REFRESH_DELAYS } from "../settings/appSettings.js";

export const setMessage = (text = "", type = "info") => {
  elements.message.textContent = text;
  elements.message.classList.toggle("error", type === "error");
};

export const setLoading = (state, isLoading) => {
  state.isLoading = isLoading;
  elements.loadMore.disabled = isLoading;
  elements.searchForm.querySelector("button").disabled = isLoading;
};

export const initVisualizations = () => {
  initCharts({
    genreCanvas: elements.genreChart,
    popularityCanvas: elements.popularityChart
  });
};

export const updateCharts = (state) => {
  updateGenreChart(countGenres(state.filteredMovies));
  updatePopularityChart(toPopularityDataset(state.filteredMovies));
};

const refreshVisuals = (state) => {
  refreshProductionMap();
  resizeCharts();
  updateCharts(state);
};

export const scheduleVisualRefresh = (state) => {
  refreshVisuals(state);
  requestAnimationFrame(() => refreshVisuals(state));
  VISUAL_REFRESH_DELAYS.forEach((delay) =>
    setTimeout(() => refreshVisuals(state), delay)
  );
};

export const renderResultsView = (state) => {
  renderResults({ elements, state });
  updateCharts(state);
};

export const renderGenresView = (state) => {
  renderGenreOptions(elements.genreFilter, state.movies, state.genres);
};

export const renderMovieCollection = (state) => {
  renderGenresView(state);
  renderResultsView(state);
};

export const renderHistoryView = (onSearch, history = getSearchHistory()) => {
  renderHistory(elements.historyList, history, (term) => {
    elements.searchInput.value = term;
    onSearch(term);
  });
};

export const resetFilterControls = () => {
  elements.searchInput.value = "";
  elements.genreFilter.value = "";
  elements.yearFilter.value = "";
  elements.ratingFilter.value = "0";
  elements.ratingValue.textContent = "0";
};

export const renderThemeButton = () => {
  const isDark = document.body.classList.contains("dark");

  elements.themeToggle.setAttribute("aria-pressed", String(isDark));
  elements.themeToggle.setAttribute(
    "aria-label",
    isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
  );
  elements.themeToggle.title = isDark ? "Modo oscuro" : "Modo claro";
};

export const openDetailModal = (state) => {
  state.previousFocus = document.activeElement;
  elements.detailModal.hidden = false;
  document.body.classList.add("modal-open");
  elements.closeDetail.focus();
  scheduleVisualRefresh(state);
};

export const hideDetailModal = () => {
  elements.detailModal.hidden = true;
  document.body.classList.remove("modal-open");
};

export const restorePreviousFocus = (state) => {
  if (state.previousFocus instanceof HTMLElement) {
    state.previousFocus.focus();
  }
};
