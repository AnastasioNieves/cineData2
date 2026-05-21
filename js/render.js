import { getGenresWithCount } from "./filters.js";
import { escapeHtml, formatMovieCount } from "./utils.js";

// Modulo de presentacion: transforma datos ya preparados en nodos/markup.
// La logica de negocio vive fuera, para mantener la UI facil de razonar.
const createPosterMarkup = (movie) => {
  const title = escapeHtml(movie.title);

  return movie.posterUrl
    ? `<img src="${escapeHtml(movie.posterUrl)}" alt="Poster de ${title}" loading="lazy" />`
    : `<span class="poster-fallback">${title}</span>`;
};

const createOverviewMarkup = (overview = "", maxLength = 100) => {
  const cleanOverview = String(overview || "Sin descripcion disponible.").trim();

  if (cleanOverview.length <= maxLength) {
    return `<p class="movie-overview">${escapeHtml(cleanOverview)}</p>`;
  }

  const shortOverview = `${cleanOverview.slice(0, maxLength).trim()}...`;

  // details/summary da "leer mas" sin estado JavaScript adicional.
  return `
    <details class="movie-overview movie-overview-details">
      <summary>
        <span class="overview-collapsed">${escapeHtml(shortOverview)}</span>
        <span class="read-more-text">Leer mas</span>
        <span class="read-less-text">Leer menos</span>
      </summary>
      <p>${escapeHtml(cleanOverview)}</p>
    </details>
  `;
};

export const renderHistory = (container, history, onSearch) => {
  container.innerHTML = "";

  if (!history.length) {
    container.innerHTML = '<span class="muted">Sin busquedas guardadas</span>';
    return;
  }

  const fragment = document.createDocumentFragment();

  history.forEach((term) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = term;
    button.addEventListener("click", () => onSearch(term));
    fragment.append(button);
  });

  container.append(fragment);
};

export const renderGenreOptions = (select, movies, genres) => {
  select.innerHTML = '<option value="">Todos</option>';

  getGenresWithCount(movies, genres).forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = `${genre.name} (${genre.count})`;
    option.disabled = genre.count === 0;
    select.append(option);
  });
};

export const renderResults = ({ elements, state, onSelect }) => {
  elements.resultsGrid.innerHTML = "";
  elements.resultsCount.textContent = formatMovieCount(state.filteredMovies.length);

  const fragment = document.createDocumentFragment();

  state.filteredMovies.forEach((movie) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `movie-card${movie.id === state.selectedMovieId ? " is-active" : ""}`;
    card.setAttribute("aria-pressed", String(movie.id === state.selectedMovieId));
    card.innerHTML = `
      <div class="poster-frame">${createPosterMarkup(movie)}</div>
      <div class="card-copy">
        <strong>${escapeHtml(movie.title)}</strong>
        <span>${escapeHtml(movie.year)} - ${escapeHtml(movie.formattedRating)}/10</span>
      </div>
    `;
    card.addEventListener("click", () => onSelect(movie.id));
    fragment.append(card);
  });

  elements.resultsGrid.append(fragment);
  elements.loadMore.hidden = state.currentPage >= state.totalPages || !state.currentQuery;
};

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

export const renderCountryList = (container, countries = [], mappedCountries = []) => {
  if (!countries.length) {
    container.textContent = "Sin paises de produccion disponibles.";
    return;
  }

  const mappedCodes = mappedCountries.map((country) => country.iso_3166_1);
  container.innerHTML = countries
    .map((country) => {
      const code = country.iso_3166_1 || "N/D";
      const note = mappedCodes.includes(code) ? "" : " sin coordenadas";
      return `<span class="country-chip">${escapeHtml(country.name)}<small>${escapeHtml(
        code
      )}${note}</small></span>`;
    })
    .join("");
};
