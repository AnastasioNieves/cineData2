import {
  TMDB_RESULTS_PER_PAGE,
  getMovieDetails,
  getPopularMovies,
  searchMovies
} from "../api.js";
import { Movie } from "../Movie.js";
import { INITIAL_MOVIE_LIMIT } from "../settings/appSettings.js";

const createMovies = (moviesData = [], genres = []) =>
  moviesData.map((movieData) => new Movie(movieData, genres));

const getPageNumbersForMovieLimit = (movieLimit) => {
  const pageCount = Math.ceil(movieLimit / TMDB_RESULTS_PER_PAGE);
  return Array.from({ length: pageCount }, (_, index) => index + 1);
};

export const loadInitialMovies = async (genres, movieLimit = INITIAL_MOVIE_LIMIT) => {
  // TMDb entrega resultados por pagina; la app define su limite en peliculas.
  const requests = getPageNumbersForMovieLimit(movieLimit).map(getPopularMovies);
  const responses = await Promise.all(requests);
  const moviesData = responses.flatMap((data) => data.results || []);

  return createMovies(moviesData, genres).slice(0, movieLimit);
};

export const searchMoviePage = async (query, page, genres, options = {}) => {
  const data = await searchMovies(query, page, options);

  return {
    movies: createMovies(data.results, genres),
    page: data.page || page,
    totalPages: data.total_pages || 1
  };
};

export const loadCachedMovieDetails = async (movieId, detailCache, signal) => {
  if (detailCache.has(movieId)) return detailCache.get(movieId);

  const details = await getMovieDetails(movieId, { signal });
  detailCache.set(movieId, details);
  return details;
};
