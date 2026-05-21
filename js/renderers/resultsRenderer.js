import { escapeHtml, formatMovieCount } from "../utils.js";
import { createPosterMarkup } from "./posterMarkup.js";

export const renderResults = ({ elements, state }) => {
  elements.resultsGrid.innerHTML = "";
  elements.resultsCount.textContent = formatMovieCount(state.filteredMovies.length);

  const fragment = document.createDocumentFragment();

  state.filteredMovies.forEach((movie) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `movie-card${movie.id === state.selectedMovieId ? " is-active" : ""}`;
    card.dataset.movieId = movie.id;
    card.setAttribute("aria-pressed", String(movie.id === state.selectedMovieId));
    card.innerHTML = `
      <div class="poster-frame">${createPosterMarkup(movie)}</div>
      <div class="card-copy">
        <strong>${escapeHtml(movie.title)}</strong>
        <span>${escapeHtml(movie.year)} - ${escapeHtml(movie.formattedRating)}/10</span>
      </div>
    `;
    fragment.append(card);
  });

  elements.resultsGrid.append(fragment);
  elements.loadMore.hidden = state.currentPage >= state.totalPages || !state.currentQuery;
};
