import { getGenres, getMovieDetails, getPopularMovies, searchMovies } from "./api.js";
import { elements } from "./dom.js";
import { Movie } from "./Movie.js";
import { applyMovieFilters, countGenres, toPopularityDataset } from "./filters.js";
import { initMap, refreshProductionMap, setMapTheme, updateProductionMap } from "./map.js";
import { initCharts, resizeCharts, updateGenreChart, updatePopularityChart } from "./charts.js?v=20260514";
import {
  renderCountryList,
  renderEmptyDetail,
  renderGenreOptions,
  renderHistory,
  renderLoadingDetail,
  renderResults,
  renderSelectedMovie
} from "./render.js";
import {
  clearSearchHistory,
  getSearchHistory,
  getStoredTheme,
  saveSearchTerm,
  saveTheme
} from "./storage.js";
import { debounce, formatCountryCount, isAbortError } from "./utils.js";

const INITIAL_DATASET_PAGES = 5;

const state = {
  genres: [],
  movies: [],
  filteredMovies: [],
  selectedMovieId: null,
  currentQuery: "",
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  searchController: null,
  detailController: null,
  detailCache: new Map(),
  previousFocus: null
};

const setMessage = (text = "", type = "info") => {
  elements.message.textContent = text;
  elements.message.classList.toggle("error", type === "error");
};

const setLoading = (isLoading) => {
  state.isLoading = isLoading;
  elements.loadMore.disabled = isLoading;
  elements.searchForm.querySelector("button").disabled = isLoading;
};

const updateCharts = () => {
  updateGenreChart(countGenres(state.filteredMovies));
  updatePopularityChart(toPopularityDataset(state.filteredMovies));
};

const refreshVisuals = () => {
  refreshProductionMap();
  resizeCharts();
  updateCharts();
};

const scheduleVisualRefresh = () => {
  refreshVisuals();
  requestAnimationFrame(refreshVisuals);
  setTimeout(refreshVisuals, 120);
  setTimeout(refreshVisuals, 320);
};

const renderResultsView = () => {
  renderResults({ elements, state, onSelect: selectMovie });
  updateCharts();
};

const renderGenresView = () => {
  renderGenreOptions(elements.genreFilter, state.movies, state.genres);
};

const renderHistoryView = (history = getSearchHistory()) => {
  renderHistory(elements.historyList, history, (term) => {
    elements.searchInput.value = term;
    runSearch(term);
  });
};

const renderThemeButton = () => {
  const isDark = document.body.classList.contains("dark");

  elements.themeToggle.setAttribute("aria-pressed", String(isDark));
  elements.themeToggle.setAttribute(
    "aria-label",
    isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
  );
  elements.themeToggle.title = isDark ? "Modo oscuro" : "Modo claro";
};

const openDetailModal = () => {
  state.previousFocus = document.activeElement;
  elements.detailModal.hidden = false;
  document.body.classList.add("modal-open");
  elements.closeDetail.focus();
  scheduleVisualRefresh();
};

const closeDetailModal = () => {
  state.detailController?.abort();
  state.detailController = null;
  elements.detailModal.hidden = true;
  document.body.classList.remove("modal-open");
  clearSelection();
  renderResultsView();

  if (state.previousFocus instanceof HTMLElement) {
    state.previousFocus.focus();
  }
};

const applyTheme = (theme) => {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  document.body.classList.toggle("dark", normalizedTheme === "dark");
  saveTheme(normalizedTheme);
  setMapTheme(normalizedTheme);
  renderThemeButton();
  updateCharts();
};

const loadDatasetMovies = async (pages = INITIAL_DATASET_PAGES) => {
  const requests = Array.from({ length: pages }, (_, index) => getPopularMovies(index + 1));
  const responses = await Promise.all(requests);

  return responses.flatMap((data) =>
    data.results.map((movieData) => new Movie(movieData, state.genres))
  );
};

const clearSelection = () => {
  state.selectedMovieId = null;
  elements.countryCount.textContent = formatCountryCount(0);
  elements.countryList.textContent = "Selecciona una pelicula para ver paises.";
  renderEmptyDetail(elements.movieDetail);
  updateProductionMap([]).catch(() => undefined);
};

const applyFiltersAndRender = ({ showFilterMessage = true } = {}) => {
  state.filteredMovies = applyMovieFilters(state.movies, {
    genreId: elements.genreFilter.value,
    year: elements.yearFilter.value,
    minRating: elements.ratingFilter.value
  });

  renderResultsView();

  if (showFilterMessage && state.currentQuery && state.movies.length) {
    setMessage(
      state.filteredMovies.length ? "" : "No hay peliculas que coincidan con esos filtros."
    );
  }
};

const resetFilters = async () => {
  elements.searchInput.value = "";
  elements.genreFilter.value = "";
  elements.yearFilter.value = "";
  elements.ratingFilter.value = "0";
  elements.ratingValue.textContent = "0";

  setMessage("Recargando peliculas...");
  state.currentQuery = "";
  state.currentPage = 1;
  state.totalPages = 1;
  clearSelection();

  state.movies = await loadDatasetMovies();
  state.filteredMovies = [...state.movies];
  renderGenresView();
  renderResultsView();
  setMessage("");
};

const resetSearch = () => {
  state.movies = [];
  state.filteredMovies = [];
  state.currentQuery = "";
  state.currentPage = 1;
  state.totalPages = 1;
  clearSelection();
  renderResultsView();
};

const loadMovieDetails = async (movieId, signal) => {
  if (state.detailCache.has(movieId)) return state.detailCache.get(movieId);

  const details = await getMovieDetails(movieId, { signal });
  state.detailCache.set(movieId, details);
  return details;
};

const runSearch = async (query, page = 1) => {
  const cleanQuery = query.trim();

  if (page === 1) {
    state.searchController?.abort();
  }

  if (cleanQuery.length < 2) {
    if (page === 1) resetSearch();
    setMessage("Escribe al menos 2 caracteres.");
    return;
  }

  const controller = new AbortController();
  state.searchController = controller;

  try {
    setLoading(true);
    setMessage(page === 1 ? "Buscando peliculas..." : "Cargando mas peliculas...");

    const data = await searchMovies(cleanQuery, page, { signal: controller.signal });
    if (controller.signal.aborted) return;

    const nextMovies = data.results.map((movieData) => new Movie(movieData, state.genres));

    state.currentQuery = cleanQuery;
    state.currentPage = data.page;
    state.totalPages = data.total_pages || 1;
    state.movies = page === 1 ? nextMovies : [...state.movies, ...nextMovies];

    if (page === 1) clearSelection();

    renderHistoryView(saveSearchTerm(cleanQuery));
    renderGenresView();
    applyFiltersAndRender({ showFilterMessage: false });
    setMessage(state.movies.length ? "" : "No hay resultados para esa busqueda.");
  } catch (error) {
    if (!isAbortError(error)) setMessage(error.message, "error");
  } finally {
    if (!controller.signal.aborted) setLoading(false);
  }
};

const selectMovie = async (movieId) => {
  const selectedMovie = state.movies.find((movie) => movie.id === movieId);
  if (!selectedMovie) return;

  state.detailController?.abort();
  const controller = new AbortController();
  state.detailController = controller;
  state.selectedMovieId = movieId;
  renderResultsView();
  renderLoadingDetail(elements.movieDetail, selectedMovie.title);
  openDetailModal();

  try {
    setMessage("Cargando detalle de la pelicula...");
    const details = await loadMovieDetails(movieId, controller.signal);
    if (controller.signal.aborted || state.selectedMovieId !== movieId) return;

    const movieWithDetails = selectedMovie.withDetails(details);
    state.movies = state.movies.map((movie) => (movie.id === movieId ? movieWithDetails : movie));

    applyFiltersAndRender({ showFilterMessage: false });
    renderSelectedMovie(elements.movieDetail, movieWithDetails);
    scheduleVisualRefresh();

    const mappedCountries = await updateProductionMap(movieWithDetails.productionCountries, {
      signal: controller.signal
    });
    if (controller.signal.aborted || state.selectedMovieId !== movieId) return;

    elements.countryCount.textContent = formatCountryCount(
      movieWithDetails.productionCountries.length
    );
    renderCountryList(elements.countryList, movieWithDetails.productionCountries, mappedCountries);
    scheduleVisualRefresh();
    setMessage("");
  } catch (error) {
    if (!isAbortError(error)) setMessage(error.message, "error");
  } finally {
    if (state.detailController === controller) {
      state.detailController = null;
    }
  }
};

const bindEvents = () => {
  const debouncedSearch = debounce((event) => runSearch(event.target.value));

  elements.searchInput.addEventListener("input", debouncedSearch);
  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(elements.searchInput.value);
  });

  elements.toggleFilters?.addEventListener("click", () => {
    const isCollapsed = elements.filtersContent.classList.toggle("collapsed");
    elements.toggleFilters.classList.toggle("is-collapsed", isCollapsed);
    elements.toggleFilters.setAttribute("aria-expanded", String(!isCollapsed));
  });

  [elements.genreFilter, elements.yearFilter, elements.ratingFilter].forEach((control) => {
    control.addEventListener("input", applyFiltersAndRender);
  });

  elements.ratingFilter.addEventListener("input", () => {
    elements.ratingValue.textContent = elements.ratingFilter.value;
  });

  elements.loadMore.addEventListener("click", () => {
    if (!state.isLoading && state.currentPage < state.totalPages) {
      runSearch(state.currentQuery, state.currentPage + 1);
    }
  });

  elements.clearHistory.addEventListener("click", () => renderHistoryView(clearSearchHistory()));
  elements.clearFilters.addEventListener("click", resetFilters);
  elements.closeDetail.addEventListener("click", closeDetailModal);
  elements.detailModal.addEventListener("click", (event) => {
    if (event.target === elements.detailModal) closeDetailModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.detailModal.hidden) closeDetailModal();
  });
  elements.themeToggle.addEventListener("click", () => {
    applyTheme(document.body.classList.contains("dark") ? "light" : "dark");
  });
};

const initTheme = () => {
  document.body.classList.toggle("dark", getStoredTheme() === "dark");
  renderThemeButton();
};

const initApp = async () => {
  try {
    initTheme();
    initMap("map");
    initCharts({
      genreCanvas: elements.genreChart,
      popularityCanvas: elements.popularityChart
    });
    bindEvents();
    renderHistoryView();

    state.genres = await getGenres();
    setMessage("Cargando dataset de peliculas...");
    state.movies = await loadDatasetMovies();
    state.filteredMovies = [...state.movies];

    renderGenresView();
    renderEmptyDetail(elements.movieDetail);
    renderResultsView();
    setMessage("");
  } catch (error) {
    setMessage(error.message, "error");
  }
};

document.addEventListener("DOMContentLoaded", initApp);
