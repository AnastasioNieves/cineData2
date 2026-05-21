import { escapeHtml } from "../utils.js";

export const createPosterMarkup = (movie) => {
  const title = escapeHtml(movie.title);

  return movie.posterUrl
    ? `<img src="${escapeHtml(movie.posterUrl)}" alt="Poster de ${title}" loading="lazy" />`
    : `<span class="poster-fallback">${title}</span>`;
};

export const createOverviewMarkup = (overview = "", maxLength = 100) => {
  const cleanOverview = String(overview || "Sin descripcion disponible.").trim();

  if (cleanOverview.length <= maxLength) {
    return `<p class="movie-overview">${escapeHtml(cleanOverview)}</p>`;
  }

  const shortOverview = `${cleanOverview.slice(0, maxLength).trim()}...`;

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
