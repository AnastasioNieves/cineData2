import { escapeHtml } from "../utils.js";
import { createOverviewMarkup, createPosterMarkup } from "./posterMarkup.js";

export const renderSelectedMovie = (container, movie) => {
  const genreChips = movie.genreNames.length
    ? movie.genreNames.map((genre) => `<span class="chip">${escapeHtml(genre)}</span>`).join("")
    : '<span class="chip">Sin genero</span>';
  const countryNames = movie.productionCountries.map((country) => country.name).join(", ");

  container.innerHTML = `
    <div class="selected-movie">
      <div class="poster-frame">${createPosterMarkup(movie)}</div>
      <div class="movie-copy">
        <h2>${escapeHtml(movie.title)}</h2>
        <div class="meta-row">
          <span>${escapeHtml(movie.year)}</span>
          <span>${escapeHtml(movie.formattedRating)}/10</span>
          <span>${movie.voteCount.toLocaleString("es-ES")} votos</span>
          ${movie.runtime ? `<span>${movie.runtime} min</span>` : ""}
        </div>
        <div class="chip-list">${genreChips}</div>
        ${createOverviewMarkup(movie.overview)}
        <p class="muted">${escapeHtml(countryNames || "Sin paises de produccion disponibles")}</p>
      </div>
    </div>
  `;
};

export const renderEmptyDetail = (container) => {
  container.innerHTML = `
    <div class="empty-state">
      <h2 id="detailTitle">Selecciona una pelicula</h2>
      <p>El mapa y las graficas se actualizaran con datos de la pelicula elegida.</p>
    </div>
  `;
};

export const renderLoadingDetail = (container, title) => {
  container.innerHTML = `
    <div class="empty-state">
      <h2>Cargando ${escapeHtml(title)}</h2>
      <p>Preparando ficha, paises de produccion y visualizaciones.</p>
    </div>
  `;
};
