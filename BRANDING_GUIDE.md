# Guia de branding - CineData Academy Edition

## Concepto de marca

**CineData Academy Edition** es una app de exploracion cinematografica con una estetica inspirada en The Bridge: tecnica, directa, limpia y con un punto energico. La marca debe sentirse como una herramienta de aprendizaje profesional: clara para estudiar datos, dinamica para explorar peliculas y suficientemente sobria para presentar resultados.

### Personalidad

- **Profesional:** la interfaz prioriza lectura, contraste y jerarquia.
- **Tecnologica:** usa fondos oscuros, superficies limpias y detalles precisos.
- **Energetica:** el rojo coral funciona como senal de accion, progreso y foco.
- **Cercana:** los textos son breves, humanos y orientados a la accion.

### Promesa visual

Una experiencia que combina cine, datos y aprendizaje con una identidad cercana a la academia: alto contraste, tarjetas blancas, cabeceras negras y acentos rojos reconocibles.

## Paleta de color

Los colores estan estimados a partir de la captura de la academia y adaptados para producto digital.

| Rol | Color | Hex | Uso recomendado |
| --- | --- | --- | --- |
| Primary Red | Rojo Bridge | `#FF3045` | Botones principales, estados activos, indicadores de progreso, badges importantes. |
| Primary Red Dark | Rojo profundo | `#B01626` | Hover, pressed, degradados, fondos de piezas destacadas. |
| Burgundy | Burdeos curso | `#780D18` | Recursos visuales, banners de contenido, graficas con intensidad. |
| Black | Negro marca | `#000000` | Header principal, footer, fondos de alto impacto. |
| Ink | Texto principal | `#2C2934` | Titulares, texto de tarjetas, labels principales. |
| Purple Chrome | Morado oscuro | `#2A2036` | Barras superiores, tema oscuro, navegacion secundaria. |
| Purple Soft | Morado UI | `#44364F` | Superficies oscuras secundarias, menus, estados hover en dark mode. |
| Cloud | Gris fondo | `#F5F5F8` | Fondo general de la app en modo claro. |
| Surface | Blanco tarjeta | `#FFFFFF` | Cards, paneles, inputs, modales. |
| Line | Borde suave | `#E7E7EF` | Separadores, bordes de inputs y tarjetas. |
| Muted | Texto secundario | `#6E6477` | Ayudas, metadata, contadores y subtitulos. |

### Tokens CSS sugeridos

```css
:root {
  --color-bg: #f5f5f8;
  --color-surface: #ffffff;
  --color-surface-soft: #fbfbfd;
  --color-text: #2c2934;
  --color-muted: #6e6477;
  --color-line: #e7e7ef;

  --color-primary: #ff3045;
  --color-primary-hover: #d82235;
  --color-primary-dark: #b01626;
  --color-burgundy: #780d18;

  --color-black: #000000;
  --color-purple: #2a2036;
  --color-purple-soft: #44364f;

  --radius-sm: 6px;
  --radius-md: 8px;
  --shadow-card: 0 14px 34px rgba(21, 18, 28, 0.1);
}

body.dark {
  --color-bg: #09080d;
  --color-surface: #141219;
  --color-surface-soft: #1d1925;
  --color-text: #ffffff;
  --color-muted: #c9bfce;
  --color-line: #342b40;
}
```

## Combinaciones recomendadas

- **Header:** fondo `#000000`, logo en blanco y rojo, navegacion en blanco.
- **Fondo general:** `#F5F5F8`, para mantener una sensacion limpia y academica.
- **Tarjetas:** fondo `#FFFFFF`, borde `#E7E7EF`, sombra muy suave.
- **CTA principal:** fondo `#FF3045`, texto `#FFFFFF`, hover `#D82235`.
- **CTA secundario:** fondo blanco, borde `#E7E7EF`, texto `#2C2934`, acento rojo en hover.
- **Modo oscuro:** fondo `#09080D`, superficies `#141219`, acentos `#FF3045`.

## Uso de color

### Regla 60/30/10

- **60% neutros claros:** gris fondo, blanco, bordes suaves.
- **30% contraste:** negro, tinta y morado oscuro para estructura.
- **10% rojo:** solo para accion, foco y estados importantes.

### Buenas practicas

- No usar el rojo como fondo dominante en pantallas completas.
- No colocar texto rojo largo sobre blanco; reservarlo para labels, iconos o estados.
- Evitar degradados decorativos excesivos. Si se usan, que sean funcionales en banners o visuales de peliculas.
- Mantener el negro para cabecera, footer o zonas de navegacion, no para todas las tarjetas.

## Tipografia

### Principal

**Inter** o **Nunito Sans** para toda la interfaz.

```css
font-family: Inter, "Nunito Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Jerarquia

| Elemento | Peso | Tamano recomendado |
| --- | --- | --- |
| H1 | 800 | `2rem - 2.6rem` |
| H2 | 800 | `1.35rem - 1.75rem` |
| H3 / Card title | 700 | `1rem - 1.2rem` |
| Body | 400 / 500 | `0.95rem - 1rem` |
| Labels | 700 | `0.78rem - 0.9rem` |

### Estilo de texto

- Titulares cortos, directos y con verbo cuando sea posible.
- Evitar frases promocionales largas.
- Usar numeros y datos con claridad: "24 peliculas", "6 paises", "Rating 8.4".

## Logo

### Direccion visual

El logo debe combinar tres ideas:

- **Cine:** fotograma, pantalla, claqueta o poster.
- **Datos:** barras, puntos, graficas o nodos.
- **Exploracion:** pin, mapa o brujula.

### Version recomendada

- Isotipo cuadrado con radio medio.
- Fondo negro o rojo.
- Simbolo blanco con detalle rojo.
- Version horizontal para header: isotipo + nombre.

### Margenes

El logo debe respirar al menos el ancho de un tercio del isotipo alrededor. No debe tocar bordes de cards, botones o barras de navegacion.

### Usos incorrectos

- No aplicar sombras duras al logo.
- No cambiar el rojo principal por tonos naranjas o rosas.
- No poner el logo sobre fondos con poco contraste.
- No deformar el isotipo ni usarlo como patron decorativo.

## Componentes UI

### Botones

**Primario**

- Fondo: `#FF3045`
- Texto: `#FFFFFF`
- Radio: `8px`
- Peso: `700`

**Secundario**

- Fondo: `#FFFFFF`
- Borde: `#E7E7EF`
- Texto: `#2C2934`
- Hover: borde o texto `#FF3045`

**Icon button**

- Usar iconos simples.
- Tamano minimo: `40px x 40px`.
- Fondo blanco en modo claro y superficie oscura en modo oscuro.

### Cards

- Radio: `8px`.
- Borde: `1px solid #E7E7EF`.
- Sombra: suave y corta.
- Imagen/poster siempre con ratio estable.
- El rojo debe aparecer como badge, progreso o estado, no como todo el fondo.

### Inputs y filtros

- Fondo: `#FFFFFF`.
- Borde: `#E7E7EF`.
- Focus: borde `#FF3045` y sombra suave roja.
- Placeholder: `#6E6477`.

### Graficas

Paleta sugerida para Chart.js:

```js
const chartPalette = [
  "#FF3045",
  "#780D18",
  "#2A2036",
  "#44364F",
  "#6E6477",
  "#B01626"
];
```

## Tono de voz

### Voz

Clara, practica y academica sin sonar fria.

### Ejemplos

- "Busca una pelicula"
- "Explora paises de produccion"
- "Compara generos"
- "No hay resultados con estos filtros"
- "Selecciona una pelicula para ver su mapa"

### Evitar

- Mensajes excesivamente largos.
- Tono demasiado comercial.
- Bromas internas o referencias que distraigan de los datos.

## Aplicacion en CineData

### Pantalla principal

- Header negro con logo y nombre.
- Panel de filtros en tarjeta blanca.
- Boton de busqueda rojo.
- Resultados sobre fondo gris claro.
- Tarjetas blancas con poster, titulo, anio y rating.

### Modal de detalle

- Cabecera del modal con titulo fuerte en `#2C2934`.
- Acciones principales en rojo.
- Mapa y graficas en superficies blancas.
- Chips de paises con borde suave y acento rojo.

### Tema oscuro

- Fondo casi negro.
- Cards en morado muy oscuro.
- Bordes morados suaves.
- Rojo igual de brillante para conservar reconocimiento.

## Accesibilidad

- Texto blanco sobre rojo principal solo en botones o badges grandes.
- Texto principal siempre en `#2C2934` sobre blanco o `#FFFFFF` sobre oscuro.
- No usar solo color para comunicar estados; combinar color con texto o icono.
- Focus visible en inputs, botones y cards interactivas.
- Contraste minimo recomendado: 4.5:1 para texto normal.

## Mini guia de implementacion

1. Sustituir los tokens actuales de color por la paleta nueva.
2. Cambiar el header a fondo negro.
3. Usar rojo Bridge para botones, estados activos y foco.
4. Mantener tarjetas blancas sobre fondo gris claro.
5. Ajustar graficas y badges con burdeos, morado y rojo.
6. Revisar capturas en escritorio y movil para asegurar contraste y legibilidad.
