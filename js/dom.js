// Punto unico de referencias del DOM. Asi el resto de modulos no depende de
// selectores repetidos y el HTML puede cambiarse desde una sola lista.
export const elements = {
  toggleFilters: document.querySelector("#toggleFilters"),
  filtersContent: document.querySelector("#filtersContent"),
  searchForm: document.querySelector("#searchForm"),
  searchInput: document.querySelector("#searchInput"),
  genreFilter: document.querySelector("#genreFilter"),
  yearFilter: document.querySelector("#yearFilter"),
  ratingFilter: document.querySelector("#ratingFilter"),
  ratingValue: document.querySelector("#ratingValue"),
  historyList: document.querySelector("#historyList"),
  clearHistory: document.querySelector("#clearHistory"),
  clearFilters: document.querySelector("#clearFilters"),
  resultsGrid: document.querySelector("#resultsGrid"),
  resultsCount: document.querySelector("#resultsCount"),
  message: document.querySelector("#message"),
  loadMore: document.querySelector("#loadMore"),
  detailModal: document.querySelector("#detailModal"),
  closeDetail: document.querySelector("#closeDetail"),
  movieDetail: document.querySelector("#movieDetail"),
  countryCount: document.querySelector("#countryCount"),
  countryList: document.querySelector("#countryList"),
  themeToggle: document.querySelector("#themeToggle"),
  genreChart: document.querySelector("#genreChart"),
  popularityChart: document.querySelector("#popularityChart")
};
