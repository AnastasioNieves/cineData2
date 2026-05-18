const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export class Movie {
  #raw;

  constructor(movieData, genresCatalog = []) {
    this.#raw = { ...movieData };
    this.id = movieData.id;
    this.title = movieData.title || movieData.name || "Sin titulo";
    this.originalTitle = movieData.original_title || this.title;
    this.overview = movieData.overview || "Sin sinopsis disponible.";
    this.posterPath = movieData.poster_path;
    this.backdropPath = movieData.backdrop_path;
    this.releaseDate = movieData.release_date || "";
    this.rating = Number(movieData.vote_average || 0);
    this.voteCount = Number(movieData.vote_count || 0);
    this.popularity = Number(movieData.popularity || 0);
    this.genreIds = movieData.genre_ids || movieData.genres?.map((genre) => genre.id) || [];
    this.genres = movieData.genres || this.#resolveGenres(genresCatalog);
    this.productionCountries = movieData.production_countries || [];
    this.runtime = Number(movieData.runtime) || null;
  }

  get year() {
    const parsedYear = Number.parseInt(this.releaseDate.slice(0, 4), 10);
    return Number.isNaN(parsedYear) ? "s/f" : parsedYear;
  }

  get posterUrl() {
    return this.posterPath ? `${IMAGE_BASE_URL}${this.posterPath}` : "";
  }

  get genreNames() {
    return this.genres.map((genre) => genre.name);
  } 

  get formattedRating() {
    return this.rating ? this.rating.toFixed(1) : "N/D";
  }

  get raw() {
    return { ...this.#raw };
  }

  withDetails(details) {
    return new Movie({ ...this.#raw, ...details }, this.genres);
  }

  hasGenre(genreId) {
    if (!genreId) return true;
    const parsedGenreId = Number(genreId);
    return this.genreIds.includes(parsedGenreId);
  }

  isFromYear(year) {
    if (!year) return true;
    const parsedYear = Number(year);
    return Number.isInteger(parsedYear) && this.year === parsedYear;
  }

  hasMinimumRating(minRating) {
    return this.rating >= Number(minRating || 0);
  }

  #resolveGenres(genresCatalog) {
    return this.genreIds
      .map((id) => genresCatalog.find((genre) => genre.id === id))
      .filter(Boolean);
  }
}
