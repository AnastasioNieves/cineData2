import { elements } from "../dom.js";
import { applyMovieFilters } from "../filters.js";
import { state } from "../state/appState.js";
import { renderResultsView, setMessage } from "../ui/appView.js";

export const applyFiltersAndRender = ({ showFilterMessage = true } = {}) => {
  state.filteredMovies = applyMovieFilters(state.movies, {
    genreId: elements.genreFilter.value,
    year: elements.yearFilter.value,
    minRating: elements.ratingFilter.value
  });

  renderResultsView(state);

  if (showFilterMessage && state.currentQuery && state.movies.length) {
    setMessage(
      state.filteredMovies.length ? "" : "No hay peliculas que coincidan con esos filtros."
    );
  }
};
