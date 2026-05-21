const POPULARITY_CHART_LIMIT = 7;

// Funciones puras: reciben una coleccion y devuelven datos nuevos sin modificar
// el estado original. Esto facilita explicar y probar la logica de filtrado.
export const applyMovieFilters = (movies, { genreId, year, minRating }) =>
  movies.filter(
    (movie) =>
      movie.hasGenre(genreId) &&
      movie.isFromYear(year) &&
      movie.hasMinimumRating(minRating)
  );

export const countGenres = (movies) =>
  movies.reduce((accumulator, movie) => {
    movie.genreNames.forEach((genreName) => {
      accumulator[genreName] = (accumulator[genreName] || 0) + 1;
    });

    return accumulator;
  }, {});

export const toPopularityDataset = (movies) =>
  [...movies]
    .sort(
      (firstMovie, secondMovie) =>
        secondMovie.popularity - firstMovie.popularity
    )
    .slice(0, POPULARITY_CHART_LIMIT)
    .map((movie) => ({
      title: movie.title,
      popularity: Number(movie.popularity.toFixed(1))
    }));

export const getGenresWithCount = (movies, genresCatalog) => {
  const genreCounts = movies.reduce((counts, movie) => {
    movie.genreIds.forEach((genreId) => {
      counts[genreId] = (counts[genreId] || 0) + 1;
    });

    return counts;
  }, {});

  return genresCatalog.map((genre) => {
    return {
      ...genre,
      count: genreCounts[genre.id] || 0
    };
  });
};
