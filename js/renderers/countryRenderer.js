import { escapeHtml } from "../utils.js";

export const renderCountryList = (container, countries = [], mappedCountries = []) => {
  if (!countries.length) {
    container.textContent = "Sin paises de produccion disponibles.";
    return;
  }

  const mappedCodes = new Set(mappedCountries.map((country) => country.iso_3166_1));
  container.innerHTML = countries
    .map((country) => {
      const code = country.iso_3166_1 || "N/D";
      const note = mappedCodes.has(code) ? "" : " sin coordenadas";
      return `<span class="country-chip">${escapeHtml(country.name)}<small>${escapeHtml(
        code
      )}${note}</small></span>`;
    })
    .join("");
};
