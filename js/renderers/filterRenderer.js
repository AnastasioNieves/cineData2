import { getGenresWithCount } from "../filters.js";

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
