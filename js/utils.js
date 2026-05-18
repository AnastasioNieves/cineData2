export const debounce = (callback, delay = 450) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

export const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return replacements[character];
  });

export const formatMovieCount = (count) =>
  `${count} ${count === 1 ? "pelicula" : "peliculas"}`;

export const formatCountryCount = (count) =>
  `${count} ${count === 1 ? "pais" : "paises"}`;

export const isAbortError = (error) => error?.name === "AbortError";
