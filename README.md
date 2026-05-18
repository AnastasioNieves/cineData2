# CineData Explorer

<p align="center">
  <img src="./img/logo.svg" alt="Logo de CineData Explorer" width="120" />
</p>

CineData Explorer es una aplicacion web interactiva para buscar peliculas con TheMovieDB, explorar sus paises de produccion en un mapa Leaflet y analizar generos y popularidad mediante graficas Chart.js.

La app esta pensada como proyecto integrador de JavaScript avanzado: usa modulos ES6, `async/await`, clases, funciones puras, persistencia en `localStorage`, filtros, tema oscuro y una interfaz responsive preparada para GitHub Pages.

## Funcionalidades

- Busqueda de peliculas con `debounce` para evitar peticiones excesivas.
- Consumo de la API de TheMovieDB con `fetch`, `async/await` y manejo de errores.
- Clase `Movie` para modelar cada pelicula y centralizar datos derivados.
- Filtros por genero, anio y rating minimo mediante funciones puras.
- Historial de las ultimas 10 busquedas guardado en `localStorage`.
- Modo claro/oscuro persistido entre sesiones.
- Paginacion de resultados con el boton `Cargar mas peliculas`.
- Modal centrado con ficha de la pelicula seleccionada.
- Mapa Leaflet 1.9 con chinchetas de los paises de produccion.
- Grafica doughnut de generos y grafica de barras de popularidad con Chart.js.

## Logo

El logotipo esta en:

```text
img/logo.svg
```

Representa las tres ideas centrales del proyecto: cine, datos y exploracion geografica. Se usa en la cabecera de la app y tambien como favicon.

## Estructura del proyecto

```text
cineData/
  index.html
  README.md
  css/
    styles.css
  img/
    logo.svg
  js/
    api.js
    charts.js
    config.example.js
    config.js
    countriesApi.js
    dom.js
    filters.js
    main.js
    map.js
    Movie.js
    render.js
    storage.js
    utils.js
```

## Arquitectura

La aplicacion esta separada por responsabilidades:

- `main.js`: punto de entrada, estado principal y eventos del DOM.
- `api.js`: llamadas a TheMovieDB.
- `Movie.js`: clase de dominio para normalizar y enriquecer peliculas.
- `filters.js`: transformaciones y filtros puros.
- `render.js`: funciones de pintado de interfaz.
- `dom.js`: referencias a elementos HTML.
- `map.js`: inicializacion y actualizacion del mapa Leaflet.
- `charts.js`: inicializacion y actualizacion de graficas Chart.js.
- `storage.js`: lectura y escritura en `localStorage`.
- `utils.js`: utilidades compartidas como `debounce`, formateadores y escape HTML.

## Configuracion de TheMovieDB

La app necesita una API key de TheMovieDB para cargar datos reales.

1. Crea una cuenta gratuita en TheMovieDB.
2. Genera una API key.
3. Copia `js/config.example.js` como referencia.
4. Edita `js/config.js`:

```js
export const TMDB_API_KEY = "TU_API_KEY_AQUI";
```

Tambien puedes guardar una clave solo en tu navegador para una demo local:

```js
localStorage.setItem("cinedata:tmdb-api-key", "TU_API_KEY_AQUI");
```

Despues recarga la pagina.

Nota: al ser una aplicacion frontend estatica, cualquier clave usada desde el navegador debe considerarse publica. Para una entrega real, conviene usar una clave restringida o de pruebas.

## Uso local

Abre una terminal en la carpeta `cineData/` y levanta un servidor estatico. Por ejemplo, con Python:

```bash
python -m http.server 5500
```

Despues abre:

```text
http://localhost:5500
```

Tambien puedes usar la extension Live Server de VS Code.

## Uso de la app

1. Escribe una pelicula en el buscador.
2. Ajusta filtros por genero, anio o rating si lo necesitas.
3. Haz clic en una tarjeta de pelicula.
4. Revisa la ficha emergente con poster, descripcion, paises, mapa y graficas.
5. Cierra el modal con el boton `x`, con la tecla `Escape` o haciendo clic fuera de la tarjeta.

## Mapa y chinchetas

El mapa usa Leaflet 1.9 con una vista mundial fija, sin zoom ni desplazamiento, para que siempre se vea completo dentro de la tarjeta del modal.

Las chinchetas se colocan a partir de los paises de produccion que devuelve TheMovieDB. Si algun pais no tiene coordenadas en la fuente local/remota usada por `countriesApi.js`, se muestra en la lista de paises con una nota de coordenadas no disponibles.

## Despliegue en GitHub Pages

1. Sube el proyecto dentro de la carpeta indicada por la entrega.
2. En GitHub, entra en `Settings > Pages`.
3. Selecciona la rama de entrega y la carpeta donde esta `index.html`.
4. Publica la URL generada en el Pull Request.

## Checklist de requisitos

- [x] JavaScript moderno con modulos ES6.
- [x] `async/await` y `try/catch`.
- [x] Clase `Movie`.
- [x] Funciones puras para filtros y transformaciones.
- [x] Buscador con `debounce`.
- [x] Mapa Leaflet con chinchetas.
- [x] Grafica doughnut de generos con Chart.js.
- [x] Grafica adicional de popularidad.
- [x] `localStorage` para historial y tema.
- [x] HTML semantico y CSS responsive.
- [x] Preparada para GitHub Pages.

## Capturas

Antes de abrir el Pull Request, anade aqui una captura de la vista principal y otra del modal de detalle.

```text
img/captura-home.png
img/captura-modal.png
```

## Enlace al despliegue

Anade aqui la URL publica de GitHub Pages cuando este publicado.
