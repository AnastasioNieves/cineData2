import { TMDB_API_KEY } from "./config.js";

// Capa unica de acceso a TheMovieDB. Centralizar aqui las llamadas evita repetir
// URLs, idioma, API key y manejo de errores en el resto de la aplicacion.
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

// Catalogo maestro de generos: se carga una vez al iniciar para traducir ids a nombres.
export const getGenres = async () => {
  const data = await fetchFromTmdb("/genre/movie/list");
  return data.genres;
};

// Busqueda paginada. El AbortController se pasa desde main.js para cancelar
// peticiones antiguas cuando el usuario sigue escribiendo.
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

// Dataset inicial para que la app tenga contenido y graficas nada mas abrir.
export const getPopularMovies = async (page = 1, options = {}) => {
  return fetchFromTmdb("/movie/popular", { page }, options);
};

// Detalle bajo demanda: solo se pide al abrir una ficha para no cargar datos innecesarios.
export const getMovieDetails = async (movieId, options = {}) => {
  return fetchFromTmdb(`/movie/${movieId}`, {}, options);
};
