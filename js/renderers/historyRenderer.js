export const renderHistory = (container, history, onSearch) => {
  container.innerHTML = "";

  if (!history.length) {
    container.innerHTML = '<span class="muted">Sin busquedas guardadas</span>';
    return;
  }

  const fragment = document.createDocumentFragment();

  history.forEach((term) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = term;
    button.addEventListener("click", () => onSearch(term));
    fragment.append(button);
  });

  container.append(fragment);
};
