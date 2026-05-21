let genreChart;
let popularityChart;

// Paleta compartida por ambas graficas para que el analisis visual tenga
// continuidad entre generos y popularidad.
const palette = ["#d13239", "#f0b84b", "#2dd4bf", "#60a5fa", "#a78bfa", "#f97316", "#22c55e"];
const emptyColor = "#37313a";

const getChart = () => {
  if (!window.Chart) {
    throw new Error("Chart.js no se ha cargado correctamente.");
  }

  return window.Chart;
};

const chartTextColor = () =>
  getComputedStyle(document.body).getPropertyValue("--text").trim() || "#1f2a2e";

export const initCharts = ({ genreCanvas, popularityCanvas }) => {
  const Chart = getChart();

  // Las graficas se crean una vez y despues solo se actualizan sus datos.
  // Esto evita destruir/recrear canvas en cada busqueda o filtro.
  genreChart = new Chart(genreCanvas, {
    type: "doughnut",
    data: {
      labels: ["Sin datos"],
      datasets: [{ data: [1], backgroundColor: [emptyColor] }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: chartTextColor() }
        }
      }
    }
  });

  popularityChart = new Chart(popularityCanvas, {
    type: "bar",
    data: {
      labels: ["Sin datos"],
      datasets: [{ label: "Popularidad", data: [0], backgroundColor: "#d13239" }]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: chartTextColor() } },
        y: { beginAtZero: true, ticks: { color: chartTextColor() } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
};

export const updateGenreChart = (genreCounts) => {
  if (!genreChart) return;

  // Estado vacio explicito para que la interfaz nunca muestre un canvas roto.
  const entries = Object.entries(genreCounts);
  const labels = entries.length ? entries.map(([genre]) => genre) : ["Sin datos"];
  const data = entries.length ? entries.map(([, count]) => count) : [1];

  genreChart.data.labels = labels;
  genreChart.data.datasets[0].data = data;
  genreChart.data.datasets[0].backgroundColor = entries.length ? palette : [emptyColor];
  genreChart.options.plugins.legend.labels.color = chartTextColor();
  genreChart.update();
};

export const updatePopularityChart = (dataset) => {
  if (!popularityChart) return;

  const labels = dataset.length ? dataset.map((item) => item.title) : ["Sin datos"];
  const data = dataset.length ? dataset.map((item) => item.popularity) : [0];

  popularityChart.data.labels = labels;
  popularityChart.data.datasets[0].data = data;
  popularityChart.data.datasets[0].backgroundColor = labels.map(
    (_, index) => palette[index % palette.length]
  );
  popularityChart.options.scales.x.ticks.color = chartTextColor();
  popularityChart.options.scales.y.ticks.color = chartTextColor();
  popularityChart.update();
};

export const resizeCharts = () => {
  [genreChart, popularityChart].forEach((chart) => {
    if (!chart) return;
    chart.resize();
    chart.update("none");
  });
};
