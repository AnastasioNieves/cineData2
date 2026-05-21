const REST_COUNTRIES_URL = "https://restcountries.com/v3.1/alpha";
const COUNTRY_CACHE_KEY = "cinedata:country-coordinates";

// Coordenadas locales para paises frecuentes. Son respaldo cuando REST Countries
// falla, no responde o no devuelve lat/lng para un codigo recibido desde TMDb.
const fallbackCoordinates = {
  AR: [-38.4161, -63.6167],
  AU: [-25.2744, 133.7751],
  BE: [50.5039, 4.4699],
  BR: [-14.235, -51.9253],
  CA: [56.1304, -106.3468],
  CL: [-35.6751, -71.543],
  CN: [35.8617, 104.1954],
  CO: [4.5709, -74.2973],
  DE: [51.1657, 10.4515],
  DK: [56.2639, 9.5018],
  ES: [40.4637, -3.7492],
  FR: [46.2276, 2.2137],
  GB: [55.3781, -3.436],
  IE: [53.1424, -7.6921],
  IN: [20.5937, 78.9629],
  IT: [41.8719, 12.5674],
  JP: [36.2048, 138.2529],
  KR: [35.9078, 127.7669],
  MX: [23.6345, -102.5528],
  NL: [52.1326, 5.2913],
  NO: [60.472, 8.4689],
  NZ: [-40.9006, 174.886],
  PT: [39.3999, -8.2245],
  SE: [60.1282, 18.6435],
  US: [37.0902, -95.7129]
};

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(COUNTRY_CACHE_KEY)) || {};
  } catch {
    return {};
  }
};

const writeCache = (cache) => {
  try {
    localStorage.setItem(COUNTRY_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // El mapa puede usar coordenadas sin cache si localStorage no esta disponible.
  }
};

const normalizeCountryResponse = (payload, fallbackName, code) => {
  const country = Array.isArray(payload) ? payload[0] : payload;

  return {
    iso_3166_1: country?.cca2 || code,
    name: country?.name?.common || fallbackName,
    latlng: country?.latlng || fallbackCoordinates[code] || null,
    source: country?.latlng ? "api" : "fallback"
  };
};

export const getCountryLocation = async ({ iso_3166_1: code, name } = {}) => {
  if (!code) return null;

  const normalizedCode = String(code).trim().toUpperCase();
  if (!normalizedCode) return null;

  const cache = readCache();

  if (cache[normalizedCode]) {
    return { ...cache[normalizedCode], source: "cache" };
  }

  try {
    // Se consulta por codigo ISO porque TMDb entrega paises normalizados.
    const response = await fetch(
      `${REST_COUNTRIES_URL}/${normalizedCode}?fields=name,latlng,cca2`
    );

    if (!response.ok) {
      throw new Error(`REST Countries respondio con estado ${response.status}`);
    }

    const location = normalizeCountryResponse(await response.json(), name, normalizedCode);
    cache[normalizedCode] = location;
    writeCache(cache);
    return location;
  } catch {
    const fallbackLocation = {
      iso_3166_1: normalizedCode,
      name,
      latlng: fallbackCoordinates[normalizedCode] || null,
      source: "fallback"
    };

    if (fallbackLocation.latlng) {
      cache[normalizedCode] = fallbackLocation;
      writeCache(cache);
    }

    return fallbackLocation;
  }
};

export const getCountryLocations = async (countries = []) => {
  const locations = await Promise.all(countries.map((country) => getCountryLocation(country)));
  return locations.filter((location) => Array.isArray(location?.latlng));
};
