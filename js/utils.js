const HTML_ESCAPE_CHARACTERS = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
};

export const debounce = (callback, delay = 450) => {
  let timeoutId;

  // Retrasa la ejecucion hasta que el usuario deja de escribir, reduciendo
  // llamadas a la API y mejorando la experiencia del buscador.
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

// Sanitiza texto externo antes de insertarlo como HTML. TMDb es una fuente
// confiable, pero esta capa evita inyecciones si cambia el origen de datos.
export const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => HTML_ESCAPE_CHARACTERS[character]);

export const formatMovieCount = (count) =>
  `${count} ${count === 1 ? "pelicula" : "peliculas"}`;

export const formatCountryCount = (count) =>
  `${count} ${count === 1 ? "pais" : "paises"}`;

export const isAbortError = (error) => error?.name === "AbortError";
