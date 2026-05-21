import { elements } from "../dom.js";
import { updateProductionMap } from "../map.js";
import {
  renderCountryList,
  renderEmptyDetail,
  renderLoadingDetail,
  renderSelectedMovie
} from "../render.js";
import { loadCachedMovieDetails } from "../services/movieService.js";
import { replaceMovieInCollection, state } from "../state/appState.js";
import {
  hideDetailModal,
  openDetailModal,
  renderResultsView,
  restorePreviousFocus,
  scheduleVisualRefresh,
  setMessage
} from "../ui/appView.js";
import { formatCountryCount, isAbortError } from "../utils.js";
import { applyFiltersAndRender } from "./filterController.js";

export const clearSelection = () => {
  state.selectedMovieId = null;
  elements.countryCount.textContent = formatCountryCount(0);
  elements.countryList.textContent = "Selecciona una pelicula para ver paises.";
  renderEmptyDetail(elements.movieDetail);
  updateProductionMap([]).catch(() => undefined);
};

export const closeDetailModal = () => {
  state.detailController?.abort();
  state.detailController = null;
  hideDetailModal();
  clearSelection();
  renderResultsView(state);
  restorePreviousFocus(state);
};

export const selectMovie = async (movieId) => {
  const selectedMovie = state.movies.find((movie) => movie.id === movieId);
  if (!selectedMovie) return;

  state.detailController?.abort();
  const controller = new AbortController();

  state.detailController = controller;
  state.selectedMovieId = movieId;
  renderResultsView(state);
  renderLoadingDetail(elements.movieDetail, selectedMovie.title);
  openDetailModal(state);

  try {
    setMessage("Cargando detalle de la pelicula...");
    const details = await loadCachedMovieDetails(movieId, state.detailCache, controller.signal);
    if (controller.signal.aborted || state.selectedMovieId !== movieId) return;

    const movieWithDetails = selectedMovie.withDetails(details);
    replaceMovieInCollection(movieWithDetails);

    applyFiltersAndRender({ showFilterMessage: false });
    renderSelectedMovie(elements.movieDetail, movieWithDetails);
    scheduleVisualRefresh(state);

    const mappedCountries = await updateProductionMap(movieWithDetails.productionCountries, {
      signal: controller.signal
    });
    if (controller.signal.aborted || state.selectedMovieId !== movieId) return;

    elements.countryCount.textContent = formatCountryCount(
      movieWithDetails.productionCountries.length
    );
    renderCountryList(elements.countryList, movieWithDetails.productionCountries, mappedCountries);
    scheduleVisualRefresh(state);
    setMessage("");
  } catch (error) {
    if (!isAbortError(error)) setMessage(error.message, "error");
  } finally {
    if (state.detailController === controller) {
      state.detailController = null;
    }
  }
};
