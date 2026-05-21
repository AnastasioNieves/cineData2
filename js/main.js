import { bindEvents } from "./controllers/eventsController.js";
import { runSearch } from "./controllers/searchController.js";
import { initTheme } from "./controllers/themeController.js";
import { elements } from "./dom.js";
import { initMap } from "./map.js";
import { renderEmptyDetail } from "./render.js";
import { getGenres } from "./api.js";
import { loadInitialMovies } from "./services/movieService.js";
import { setMovieCollection, state } from "./state/appState.js";
import {
  initVisualizations,
  renderHistoryView,
  renderMovieCollection,
  setMessage
} from "./ui/appView.js";

const initApp = async () => {
  try {
    initTheme();
    initMap("map");
    initVisualizations();
    bindEvents();
    renderHistoryView(runSearch);

    state.genres = await getGenres();
    setMessage("Cargando dataset de peliculas...");
    setMovieCollection(await loadInitialMovies(state.genres));
    renderMovieCollection(state);
    renderEmptyDetail(elements.movieDetail);
    setMessage("");
  } catch (error) {
    setMessage(error.message, "error");
  }
};

document.addEventListener("DOMContentLoaded", initApp);
