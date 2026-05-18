export const filterByGenre = (movies, genreId) =>
  genreId
    ? movies.filter((movie) => movie.hasGenre(Number(genreId)))
    : [...movies];

export const filterByYear = (movies, year) =>
  year
    ? movies.filter((movie) => movie.isFromYear(Number(year)))
    : [...movies];

export const filterByRating = (movies, minRating) =>
  minRating
    ? movies.filter((movie) => movie.hasMinimumRating(Number(minRating)))
    : [...movies];

export const applyMovieFilters = (
  movies,
  { genreId, year, minRating }
) =>
  filterByRating(
    filterByYear(
      filterByGenre(movies, genreId),
      year
    ),
    minRating
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
    .slice(0, 7)
    .map((movie) => ({
      title: movie.title,
      popularity: Number(movie.popularity.toFixed(1))
    }));
  
  
  export const getGenresWithCount = (movies, genresCatalog) =>
  genresCatalog.map((genre) => {
    const count = movies.filter((movie) =>
      movie.hasGenre(genre.id)
    ).length;

    return {
      ...genre,
      count
    };
  });