// Estado unico de la aplicacion. Los controladores lo mutan y las vistas lo leen.
export const state = {
  genres: [],
  movies: [],
  filteredMovies: [],
  selectedMovieId: null,
  currentQuery: "",
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  searchController: null,
  detailController: null,
  detailCache: new Map(),
  previousFocus: null
};

export const setMovieCollection = (movies) => {
  state.movies = movies;
  state.filteredMovies = [...movies];
};

export const appendMoviePage = (movies) => {
  state.movies = [...state.movies, ...movies];
};

export const replaceMovieInCollection = (updatedMovie) => {
  state.movies = state.movies.map((movie) =>
    movie.id === updatedMovie.id ? updatedMovie : movie
  );
};

export const resetResultsState = () => {
  state.movies = [];
  state.filteredMovies = [];
  state.currentQuery = "";
  state.currentPage = 1;
  state.totalPages = 1;
};

export const canLoadMoreSearchResults = () =>
  !!state.currentQuery && !state.isLoading && state.currentPage < state.totalPages;
