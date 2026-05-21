import { getCountryLocations } from "./countriesApi.js";
import {
  BASE_MAP_PANE,
  MAP_REFRESH_DELAY,
  MARKER_PANE,
  WORLD_IMAGE_BOUNDS,
  WORLD_MAP_URL
} from "./map/mapConfig.js";
import { createProductionIcon } from "./map/productionIcon.js";
import { renderPins } from "./map/pinLayer.js";
import { toMapPoint } from "./map/mapProjection.js";
import { escapeHtml } from "./utils.js";

// El mapa usa Leaflet con CRS.Simple sobre una imagen mundial fija. Esa decision
// permite mostrar siempre el mundo completo dentro del modal sin scroll ni zoom.
let map;
let markersLayer;
let mapElement;
let pinLayer;

const getLeaflet = () => {
  if (!window.L) {
    throw new Error("Leaflet no se ha cargado correctamente.");
  }

  return window.L;
};

const fitWholeWorld = () => {
  map.invalidateSize({ pan: false });
  map.fitBounds(WORLD_IMAGE_BOUNDS, {
    animate: false,
    padding: [0, 0]
  });
};

const openCountryPopup = (country) => {
  getLeaflet()
    .popup()
    .setLatLng(toMapPoint(country.latlng))
    .setContent(`<strong>${escapeHtml(country.name)}</strong><br>${escapeHtml(country.iso_3166_1)}`)
    .openOn(map);
};

export const initMap = (elementId) => {
  const L = getLeaflet();
  mapElement = document.getElementById(elementId);
  setMapTheme(document.body.classList.contains("dark") ? "dark" : "light");

  map = L.map(elementId, {
    attributionControl: false,
    boxZoom: false,
    crs: L.CRS.Simple,
    doubleClickZoom: false,
    dragging: false,
    keyboard: false,
    scrollWheelZoom: false,
    tap: false,
    touchZoom: false,
    zoomControl: false
  });

  map.createPane(BASE_MAP_PANE);
  map.getPane(BASE_MAP_PANE).classList.add("world-map-image-pane");
  map.getPane(BASE_MAP_PANE).style.zIndex = 200;

  map.createPane(MARKER_PANE);
  map.getPane(MARKER_PANE).classList.add("production-marker-pane");
  map.getPane(MARKER_PANE).style.zIndex = 850;

  L.imageOverlay(WORLD_MAP_URL, WORLD_IMAGE_BOUNDS, {
    alt: "Mapa mundial equirectangular",
    pane: BASE_MAP_PANE
  }).addTo(map);

  markersLayer = L.featureGroup().addTo(map);
  pinLayer = document.createElement("div");
  pinLayer.className = "map-pin-layer";
  mapElement.append(pinLayer);

  fitWholeWorld();
  map.setMaxBounds(WORLD_IMAGE_BOUNDS);
  map.on("resize", fitWholeWorld);

  setTimeout(fitWholeWorld, MAP_REFRESH_DELAY);
  return map;
};

export const setMapTheme = (theme) => {
  if (mapElement) {
    mapElement.dataset.theme = theme;
  }
};

export const refreshProductionMap = () => {
  if (map) {
    fitWholeWorld();
  }
};

export const updateProductionMap = async (countries = [], options = {}) => {
  const L = getLeaflet();
  if (!map || !markersLayer) return [];
  if (options.signal?.aborted) return [];

  markersLayer.clearLayers();
  renderPins(pinLayer);

  const locations = await getCountryLocations(countries);
  if (options.signal?.aborted) return [];

  // Leaflet mantiene popups y accesibilidad; la capa HTML refuerza el estilo visual.
  locations.forEach((country) => {
    L.marker(toMapPoint(country.latlng), {
      alt: `Chincheta de ${country.name}`,
      icon: createProductionIcon(L),
      keyboard: true,
      pane: MARKER_PANE,
      title: `${country.name} (${country.iso_3166_1})`
    })
      .addTo(markersLayer)
      .bindPopup(
        `<strong>${escapeHtml(country.name)}</strong><br>${escapeHtml(country.iso_3166_1)}`
      );
  });

  renderPins(pinLayer, locations, openCountryPopup);
  fitWholeWorld();

  setTimeout(fitWholeWorld, MAP_REFRESH_DELAY);
  return locations;
};
