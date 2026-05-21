import { elements } from "../dom.js";
import { debounce } from "../utils.js";
import { closeDetailModal, selectMovie } from "./detailController.js";
import { applyFiltersAndRender } from "./filterController.js";
import {
  loadNextSearchPage,
  resetFilters,
  runSearch,
  syncRatingLabel
} from "./searchController.js";
import { applyTheme } from "./themeController.js";
import { clearSearchHistory } from "../storage.js";
import { renderHistoryView } from "../ui/appView.js";

const handleResultClick = (event) => {
  const movieCard = event.target.closest?.("[data-movie-id]");
  if (!movieCard) return;

  selectMovie(Number(movieCard.dataset.movieId));
};

const toggleFiltersPanel = () => {
  const isCollapsed = elements.filtersContent.classList.toggle("collapsed");
  elements.toggleFilters.classList.toggle("is-collapsed", isCollapsed);
  elements.toggleFilters.setAttribute("aria-expanded", String(!isCollapsed));
};

export const bindEvents = () => {
  const debouncedSearch = debounce((event) => runSearch(event.target.value));

  elements.searchInput.addEventListener("input", debouncedSearch);
  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(elements.searchInput.value);
  });

  elements.toggleFilters?.addEventListener("click", toggleFiltersPanel);
  [elements.genreFilter, elements.yearFilter, elements.ratingFilter].forEach((control) => {
    control.addEventListener("input", applyFiltersAndRender);
  });
  elements.ratingFilter.addEventListener("input", syncRatingLabel);
  elements.resultsGrid.addEventListener("click", handleResultClick);
  elements.loadMore.addEventListener("click", loadNextSearchPage);
  elements.clearHistory.addEventListener("click", () =>
    renderHistoryView(runSearch, clearSearchHistory())
  );
  elements.clearFilters.addEventListener("click", resetFilters);
  elements.closeDetail.addEventListener("click", closeDetailModal);
  elements.detailModal.addEventListener("click", (event) => {
    if (event.target === elements.detailModal) closeDetailModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.detailModal.hidden) closeDetailModal();
  });
  elements.themeToggle.addEventListener("click", () => {
    applyTheme(document.body.classList.contains("dark") ? "light" : "dark");
  });
};
