import { getCountryLocations } from "./countriesApi.js";

// El mapa usa Leaflet con CRS.Simple sobre una imagen mundial fija. Esa decision
// permite mostrar siempre el mundo completo dentro del modal sin scroll ni zoom.
const BASE_MAP_PANE = "worldMapImage";
const MARKER_PANE = "productionMarkers";
const WORLD_MAP_URL =
  "https://upload.wikimedia.org/wikipedia/commons/5/51/BlankMap-Equirectangular.svg";
const WORLD_IMAGE_BOUNDS = [
  [0, 0],
  [180, 360]
];

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

const escapeHtml = (value = "") =>
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

const toMapPoint = ([latitude, longitude]) => [latitude + 90, longitude + 180];

const fitWholeWorld = () => {
  map.invalidateSize({ pan: false });
  map.fitBounds(WORLD_IMAGE_BOUNDS, {
    animate: false,
    padding: [0, 0]
  });
};

const createProductionIcon = () =>
  getLeaflet().divIcon({
    className: "leaflet-div-icon production-dot-icon",
    html:
      '<span class="production-dot" aria-hidden="true" style="display:block;width:20px;height:20px;border:3px solid #ffffff;border-radius:50%;background:#c0262e;box-shadow:0 0 0 4px rgba(192,38,46,0.22),0 10px 18px rgba(0,0,0,0.34);"></span>',
    iconAnchor: [13, 13],
    iconSize: [26, 26],
    popupAnchor: [0, -13]
  });

const getPinPosition = ([latitude, longitude]) => ({
  left: `${((longitude + 180) / 360) * 100}%`,
  top: `${((90 - latitude) / 180) * 100}%`
});

const openCountryPopup = (country) => {
  getLeaflet()
    .popup()
    .setLatLng(toMapPoint(country.latlng))
    .setContent(`<strong>${escapeHtml(country.name)}</strong><br>${escapeHtml(country.iso_3166_1)}`)
    .openOn(map);
};

const renderPins = (locations = []) => {
  pinLayer.innerHTML = "";

  // Capa HTML adicional para que las chinchetas sean faciles de estilizar y enfocar.
  locations.forEach((country) => {
    const button = document.createElement("button");
    const position = getPinPosition(country.latlng);

    button.type = "button";
    button.className = "map-pin";
    button.style.left = position.left;
    button.style.top = position.top;
    button.title = `${country.name} (${country.iso_3166_1})`;
    button.setAttribute("aria-label", `Chincheta de ${country.name}`);
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openCountryPopup(country);
    });

    pinLayer.append(button);
  });
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

  setTimeout(fitWholeWorld, 80);
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
  renderPins();

  const locations = await getCountryLocations(countries);
  if (options.signal?.aborted) return [];

  // Leaflet mantiene popups y accesibilidad; la capa HTML refuerza el estilo visual.
  locations.forEach((country) => {
    L.marker(toMapPoint(country.latlng), {
      alt: `Chincheta de ${country.name}`,
      icon: createProductionIcon(),
      keyboard: true,
      pane: MARKER_PANE,
      title: `${country.name} (${country.iso_3166_1})`
    })
      .addTo(markersLayer)
      .bindPopup(
        `<strong>${escapeHtml(country.name)}</strong><br>${escapeHtml(country.iso_3166_1)}`
      );
  });

  renderPins(locations);
  fitWholeWorld();

  setTimeout(fitWholeWorld, 80);
  return locations;
};
