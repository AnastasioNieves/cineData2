import { getPinPosition } from "./mapProjection.js";

export const renderPins = (pinLayer, locations = [], onOpenCountry) => {
  pinLayer.innerHTML = "";

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
      onOpenCountry(country);
    });

    pinLayer.append(button);
  });
};
