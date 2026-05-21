import { elements } from "../dom.js";
import { loadInitialMovies, searchMoviePage } from "../services/movieService.js";
import { MIN_SEARCH_LENGTH } from "../settings/appSettings.js";
import {
  appendMoviePage,
  canLoadMoreSearchResults,
  resetResultsState,
  setMovieCollection,
  state
} from "../state/appState.js";
import { saveSearchTerm } from "../storage.js";
import {
  renderGenresView,
  renderHistoryView,
  renderMovieCollection,
  renderResultsView,
  resetFilterControls,
  setLoading,
  setMessage
} from "../ui/appView.js";
import { isAbortError } from "../utils.js";
import { clearSelection } from "./detailController.js";
import { applyFiltersAndRender } from "./filterController.js";

export const resetFilters = async () => {
  resetFilterControls();
  setMessage("Recargando peliculas...");
  resetResultsState();
  clearSelection();

  setMovieCollection(await loadInitialMovies(state.genres));
  renderMovieCollection(state);
  setMessage("");
};

export const resetSearch = () => {
  resetResultsState();
  clearSelection();
  renderResultsView(state);
};

export const runSearch = async (query, page = 1) => {
  const cleanQuery = query.trim();
  const isFirstPage = page === 1;

  if (isFirstPage) {
    state.searchController?.abort();
  }

  if (cleanQuery.length < MIN_SEARCH_LENGTH) {
    if (isFirstPage) resetSearch();
    setMessage(`Escribe al menos ${MIN_SEARCH_LENGTH} caracteres.`);
    return;
  }

  const controller = new AbortController();
  state.searchController = controller;

  try {
    setLoading(state, true);
    setMessage(isFirstPage ? "Buscando peliculas..." : "Cargando mas peliculas...");

    const moviePage = await searchMoviePage(cleanQuery, page, state.genres, {
      signal: controller.signal
    });
    if (controller.signal.aborted) return;

    state.currentQuery = cleanQuery;
    state.currentPage = moviePage.page;
    state.totalPages = moviePage.totalPages;

    if (isFirstPage) {
      setMovieCollection(moviePage.movies);
      clearSelection();
    } else {
      appendMoviePage(moviePage.movies);
    }

    renderHistoryView(runSearch, saveSearchTerm(cleanQuery));
    renderGenresView(state);
    applyFiltersAndRender({ showFilterMessage: false });
    setMessage(state.movies.length ? "" : "No hay resultados para esa busqueda.");
  } catch (error) {
    if (!isAbortError(error)) setMessage(error.message, "error");
  } finally {
    if (!controller.signal.aborted) setLoading(state, false);
  }
};

export const loadNextSearchPage = () => {
  if (canLoadMoreSearchResults()) {
    runSearch(state.currentQuery, state.currentPage + 1);
  }
};

export const syncRatingLabel = () => {
  elements.ratingValue.textContent = elements.ratingFilter.value;
};
