const HISTORY_KEY = "cinedata:last-searches";
const THEME_KEY = "cinedata:theme";
const HISTORY_LIMIT = 10;

// Envoltorios defensivos para localStorage. Si el navegador lo bloquea, la app
// sigue funcionando y solo pierde persistencia de historial/tema.
const readJson = (key, fallbackValue) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallbackValue;
  } catch {
    return fallbackValue;
  }
};

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // La app debe seguir funcionando aunque el navegador bloquee localStorage.
  }
};

export const getSearchHistory = () => {
  return readJson(HISTORY_KEY, []);
};

export const createSearchHistory = (history, term) => {
  const normalizedTerm = term.trim();
  if (!normalizedTerm) return [...history];

  // Inserta la busqueda reciente arriba, elimina duplicados y conserva un maximo.
  return [
    normalizedTerm,
    ...history.filter((item) => item.toLocaleLowerCase() !== normalizedTerm.toLocaleLowerCase())
  ].slice(0, HISTORY_LIMIT);
};

export const saveSearchTerm = (term) => {
  const nextHistory = createSearchHistory(getSearchHistory(), term);

  writeJson(HISTORY_KEY, nextHistory);
  return nextHistory;
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Sin localStorage disponible no hay nada que limpiar.
  }

  return [];
};

export const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || "dark";
  } catch {
    return "dark";
  }
};

export const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Guardar el tema es opcional para la experiencia principal.
  }

  return theme;
};
