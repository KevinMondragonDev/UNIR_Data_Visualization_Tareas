# Resumen · Clases de D3.js (Temas 3–6)

Fuentes: transcripciones Zoom `619018.vtt`, `624242.vtt`, `631601.vtt`, resúmenes `zoom_*.txt` y PDFs de los temas 3, 4, 5 y 6.
Profesora: Rosa Angélica Gudiño Morales.

## Mapa de las sesiones

| Archivo | Sesión | Contenido |
|---|---|---|
| `619018.vtt` | Clase 1 · Presentación | Dinámica de la materia, calendario de 8 semanas, Google Charts, "partir de la necesidad del negocio, no de la herramienta", arquetipos de audiencia, demo de dashboard hecho con IA. |
| `624242.vtt` | Clase 2 · Temas 3 y 4 | Qué es D3, DOM, SVG y coordenadas, JSON/CSV, caso de los supermercados en Francia (IoT + dashboards de alertas), *skills* de IA, **presentación de la Actividad 1**. |
| `631601.vtt` | Clase 3 · Temas 5 y 6 | **Dudas de la Actividad 1** (rúbrica revisada punto por punto), escalas, ejes, tipos de gráfico, transiciones, ejercicio de prototipado con IA usando las hojas de truco. |

## Calendario mencionado en clase

- Semana 2: temas 3 y 4 + presentación de la actividad 1 (individual).
- Semana 3: temas 5 y 6.
- Semana 4: tema 7 + resolución de la actividad 1.
- Semana 5: tema 8 + presentación de la actividad 2 (**grupal**, dashboard de ventas en **Power BI**, entrega 16 de noviembre).
- Semana 6: tema 9. Semana 7: temas 10 y 11. Semana 8: repaso.
- Examen: 40 preguntas (opción múltiple y verdadero/falso) sacadas de un banco de unas 90. La fecha se confirma entre las semanas 6 y 7.
- Recomendación de la profesora: el mayor peso está en los **tests y las actividades**, así que sácales la nota máxima y luego prepara el examen. Las hojas de truco sirven para repasar.

---

## Tema 3 · Introducción y funcionalidades

**Idea central:** los datos definen la representación visual. D3 (Data-Driven Documents) enlaza datos con elementos del DOM (HTML/SVG) y calcula sus propiedades visuales.

- **Flujo:** datos (CSV/JSON) → D3 → DOM/SVG → visualización.
- **DOM:** árbol vivo que el navegador construye a partir del HTML (`document` → `html` → `head`/`body`). CSS da el estilo y JS la interactividad.
- **Instalación:** por CDN `https://cdn.jsdelivr.net/npm/d3@7`, o con npm (`npm install d3` + `import * as d3 from "d3"`).
- **API básica:**

| Método | Uso |
|---|---|
| `d3.select()` / `d3.selectAll()` | Seleccionan el primer elemento o todos los que coinciden (selectores CSS: `#id`, `.clase`, `a > b`). |
| `.append()` / `.text()` | Crean un elemento hijo / escriben texto. |
| `.attr()` / `.style()` | Cambian atributos (`cx`, `r`, `fill`, `class`) / propiedades CSS. |
| `.each(function(d, i){ d3.select(this) })` | Recorren la selección (usa `function`, no flecha, para tener `this`). |
| `.data(arr).join("li")` | **Data join**: crea lo que falta, actualiza lo que existe y elimina lo que sobra. |

- **Enter / Update / Exit:** datos sin elemento / elementos con dato actual / elementos sin dato. En v7, `join()` resume las tres fases. Para reutilizar elementos usa una *key function* `.data(datos, d => d.id)`.
- **Carga de datos:** `d3.json(url)` y `d3.csv(url, conversor)` devuelven **Promesas** (`.then()` / `await`). Los valores de un CSV llegan como texto, así que hay que pasarlos por `Number()`. Abre la página **con un servidor**, no con `file://` (por CORS).
- **Mnemotecnia del tema:** *Loading → Binding → Transforming → Transitioning*.
- **Ventajas:** control visual total, estándares web, código abierto, interactividad, integración con React/Vue, modularidad.
- **Limitaciones:** curva de aprendizaje (requiere JS), no es la vía más corta para gráficos convencionales, no es automáticamente rápido con millones de puntos y no sustituye a un backend ni a una base de datos.
- **Cuándo usar cada uno:** D3 para visualizaciones a medida o interacción compleja; Chart.js o Google Charts para gráficos comunes; Tableau o Power BI para dashboards con poco código.

## Tema 4 · Datos, SVG y gráficas

- **JSON vs CSV:** el JSON es un array de objetos con llaves y corchetes; el CSV son filas con cabecera separadas por comas. A cada campo se accede como `d.campo`.
- **SVG = el lienzo.** El **origen (0,0) está en la esquina superior izquierda**: la X crece hacia la derecha y la **Y crece hacia abajo**. La profesora insistió mucho en esto.
- **Primitivas:** `<circle cx cy r>` (el centro), `<rect x y width height>` (esquina superior izquierda), `<ellipse>`, `<line x1 y1 x2 y2>` y `<text>`.
- **Estilo:** `fill`, `stroke`, `stroke-width`, `opacity`, `rgba()`. También puedes usar clases CSS.
- **No existe z-index en SVG.** Lo que se dibuja después queda encima, así que la superposición depende del **orden**.
- **Bar chart desde cero:** primero con `div` (`display:inline-block` + `height` según el dato) y luego con `<rect>`.
  - Al principio las barras salen "colgando" (invertidas). Se corrige con `y = h - d` y `height = d`.
  - La posición X es `i * (w / n)` y el ancho `w / n - 1` (ese `-1` deja la separación).
- **Scatter plot:** `<circle>` con `cx = d[0]`, `cy = d[1]` y `r` fijo, o `r` según el dato si es un gráfico de burbujas.

## Tema 5 · Escalas y ejes

- **Escala:** función que convierte valores del dato (**domain**) en valores visuales (**range**), como píxeles, tamaños o colores.

| Escala (v7) | Cuándo |
|---|---|
| `d3.scaleLinear()` | Proporciones y distancias absolutas: ventas, precios, edades. |
| `d3.scaleLog()` | Cambios multiplicativos o varios órdenes de magnitud. **Solo valores positivos.** |
| `d3.scaleBand()` / `d3.scaleOrdinal()` | Categorías (productos, ciudades, meses). `scaleBand` calcula el ancho de las bandas; `scaleOrdinal` sirve, por ejemplo, para asignar colores. |
| `d3.scaleTime()` | Fechas, horas y series de tiempo. |
| `d3.scaleSqrt()` | Radio de burbujas: el **área** queda proporcional al valor. |

- **Ejes:** `d3.axisBottom(x)` y `d3.axisLeft(y)` se dibujan dentro de un `<g>` con `.call(eje)`, y se posicionan con `transform="translate(...)"`. `.ticks(5)` controla cuántas marcas aparecen.
- **Truco de la Y invertida:** `range([alto, 0])`, para que los valores altos queden arriba.
- **Márgenes:** el patrón `margin = {top, right, bottom, left}` reserva espacio para los ejes.

## Tema 6 · Force layout, transiciones e interacción

- **Force layout:** grafos de nodos y enlaces con física simulada. En v7 se hace con `d3.forceSimulation(nodos).force("link", …).force("charge", d3.forceManyBody())` y se actualiza en `.on("tick", …)`. Los nodos se pueden arrastrar con `d3.drag()`.
- **Actualizar con eventos:** cualquier elemento puede emitir eventos (`.on("click", …)`). Los pasos son: botón → dataset nuevo → volver a enlazar `.data()` → actualizar atributos y textos.
- **Transiciones:** `.transition().duration(ms).ease(d3.easeLinear).delay(ms)` y luego los `.attr()` que se quieren animar. También hay que animar los textos o etiquetas, porque si no se quedan fijos.
- **Interacción:** `click`, `mouseover` y `mouseout` para resaltar elementos o mostrar tooltips.
- **Exportar:** captura de pantalla (PNG), imprimir a PDF o copiar el `<svg>…</svg>` desde Inspeccionar para tener un vectorial.

### Tipos de gráfico vistos en clase (y cuándo usarlos)

| Gráfico | Úsalo para |
|---|---|
| Barras | Comparar categorías |
| Líneas | Evolución de una variable en el tiempo |
| Áreas | Igual que líneas, con el área rellena |
| Dispersión | Relación entre 2 variables (p. ej., publicidad vs. ventas) |
| Pastel | Proporciones o porcentajes |
| Barras apiladas | Categorías agrupadas por periodo |
| Histograma | Distribución de una muestra (frecuencias) |

---

## ⚠️ Los PDFs usan D3 v3 y hoy se usa v7

Casi todo el código de los temas 4, 5 y 6 está en **D3 v3**. Si lo copias tal cual con `d3@7`, **no funciona**:

| v3 (PDF) | v7 (actual) |
|---|---|
| `d3.scale.linear()` | `d3.scaleLinear()` |
| `d3.scale.ordinal().rangeRoundBands([0,w], .05)` | `d3.scaleBand().range([0,w]).padding(.05)` |
| `xScale.rangeBand()` | `xScale.bandwidth()` |
| `d3.svg.axis().scale(x).orient("bottom")` | `d3.axisBottom(x)` |
| `.ease("linear")` | `.ease(d3.easeLinear)` |
| `d3.layout.force()` | `d3.forceSimulation()` |
| `.on("click", function(d){…})` | `.on("click", function(event, d){…})` ← **el dato pasa a ser el 2º argumento** |
| `d3.json(url, callback)` | `d3.json(url).then(…)` o `await d3.json(url)` |
| `.enter().append("rect")` | `.join("rect")` |
| `<body onload="draw()">` | `<script defer>` o un script al final del `body` |

## Mensajes recurrentes de la profesora

- Empieza por la **necesidad del negocio** y por la **audiencia** (el tomador de decisiones), no por la herramienta.
- Ciclo del analista: necesidad → fuentes → ETL → modelo → herramienta y diseño → **storytelling** → entrega del dashboard.
- Colores con intención: el rojo solo para alertas, y respeta el branding de la empresa.
- Usa la IA (ChatGPT, Claude, Gemini) para **prototipos rápidos** y *skills*, sin subir datos sensibles. Revisa las skills descargadas, porque pueden traer código malicioso.
- Libros recomendados: *Storytelling with Data* (Cole Nussbaumer Knaflic) y *How Charts Lie* (Alberto Cairo).
