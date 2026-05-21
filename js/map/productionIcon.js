export const createProductionIcon = (L) =>
  L.divIcon({
    className: "leaflet-div-icon production-dot-icon",
    html:
      '<span class="production-dot" aria-hidden="true" style="display:block;width:20px;height:20px;border:3px solid #ffffff;border-radius:50%;background:#c0262e;box-shadow:0 0 0 4px rgba(192,38,46,0.22),0 10px 18px rgba(0,0,0,0.34);"></span>',
    iconAnchor: [13, 13],
    iconSize: [26, 26],
    popupAnchor: [0, -13]
  });
