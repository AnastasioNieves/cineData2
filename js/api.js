import { TMDB_API_KEY } from "../config.env.js";

const BASE_URL = "https://api.themoviedb.org/3";
const DEFAULT_LANGUAGE = "es-ES";
const API_KEY_STORAGE_KEY = "cinedata:tmdb-api-key";

const normalizeApiKey = (apiKey) => String(apiKey || "").trim();

const getStoredApiKey = () => {
  try {
    return normalizeApiKey(localStorage.getItem(API_KEY_STORAGE_KEY));
  } catch {
    return "";
  }
};

const getConfiguredApiKey = () => {
  const storedApiKey = getStoredApiKey();
  return storedApiKey || normalizeApiKey(TMDB_API_KEY);
};

export const isApiConfigured = () => {
  return !!getConfiguredApiKey();
};

const fetchFromTmdb = async (endpoint, params = {}, options = {}) => {
  const apiKey = getConfiguredApiKey();

  if (!apiKey) {
    throw new Error("Falta configurar la API key de TMDb.");
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.search = new URLSearchParams({
    api_key: apiKey,
    language: DEFAULT_LANGUAGE,
    ...params
  });

  const response = await fetch(url, { signal: options.signal });

  if (!response.ok) {
    throw new Error(`TMDb respondió con estado ${response.status}`);
  }

  return response.json();
};

export const getGenres = async () => {
  const data = await fetchFromTmdb("/genre/movie/list");
  return data.genres;
};

export const searchMovies = async (query, page = 1, options = {}) => {
  return fetchFromTmdb(
    "/search/movie",
    {
      query,
      page,
      include_adult: "false"
    },
    options
  );
};
export const getPopularMovies = async (page = 1, options = {}) => {
  return fetchFromTmdb("/movie/popular", { page }, options);
};

export const getMovieDetails = async (movieId, options = {}) => {
  return fetchFromTmdb(`/movie/${movieId}`, {}, options);
};
+3