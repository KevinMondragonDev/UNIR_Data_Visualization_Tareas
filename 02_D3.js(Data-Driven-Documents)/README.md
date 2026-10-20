# 📈 D3.js · Plan de estudios (Temas 3–6 UNIR)

Plan para cubrir el temario de D3.js de la asignatura **y mejorarlo**: el material del curso usa D3 v3 (2012–2014), y hoy se trabaja con **D3 v7**. Aprenderás los mismos temas, pero con las prácticas actuales.

> Método de enseñanza y reglas de revisión de código con Claude: ver [`CLAUDE.md`](CLAUDE.md).

## 🗺️ Mapa del temario → carpetas

| Tema UNIR | Carpeta | Qué cubre el temario | Qué añade este plan |
|---|---|---|---|
| 3 · Introducción y funcionalidades | [`01_introduccion_y_funcionalidades/`](01_introduccion_y_funcionalidades) | Instalación, elementos básicos, datos reales en el HTML, ventajas | v7 con módulos ES, `.join()`, key functions, Vite opcional |
| 4 · Datos, SVG y gráficas | [`02_datos_svg_y_graficas/`](02_datos_svg_y_graficas) | JSON y CSV, SVG, Bar Chart y Scatter Plot desde cero | `d3.autoType`, manejo de errores, márgenes estándar, accesibilidad |
| 5 · Escalas y ejes | [`03_escalas_y_ejes/`](03_escalas_y_ejes) | Escala lineal/logarítmica, ejes, escala ordinal | `scaleBand`, `scaleTime`, `scaleSqrt`, formato de ticks, rotar etiquetas |
| 6 · Force layout, transiciones e interacción | [`04_force_layout_transiciones_e_interaccion/`](04_force_layout_transiciones_e_interaccion) | Force layout, eventos, transiciones, interacción, exportar PDF/bitmap/SVG | `forceSimulation` v7, drag/brush/zoom, teclado, `prefers-reduced-motion`, exportación |
| "A fondo" | [`05_a_fondo/`](05_a_fondo) | Lecturas y librerías recomendadas | React + D3, comparación con Dimple/NVD3/Observable Plot |

## ⚠️ Lo primero: el curso usa D3 v3

Los archivos actuales (`01_elementos_basicos.html`, `02_elementos_con_datos.html`) cargan `d3.v3.min.js` por `http://`. Funcionan, pero la API cambió mucho. Aprende el concepto con el ejemplo del curso y luego **porta cada ejercicio a v7**. Esa traducción es parte del aprendizaje.

| Concepto | D3 v3 (curso) | D3 v7 (actual) |
|---|---|---|
| Carga | `<script src="http://d3js.org/d3.v3.min.js">` | `<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>` o `import * as d3 from "d3"` |
| Escala lineal | `d3.scale.linear()` | `d3.scaleLinear()` |
| Escala ordinal | `d3.scale.ordinal()` | `d3.scaleBand()` / `d3.scaleOrdinal()` |
| Ejes | `d3.svg.axis().scale(x).orient("bottom")` | `d3.axisBottom(x)` |
| Datos + elementos | `.data().enter().append()` | `.data().join("circle")` |
| Eventos | `d3.event` | el evento llega como 1er argumento: `.on("click", (event, d) => …)` |
| CSV/JSON | `d3.csv(url, callback)` | `await d3.csv(url, d3.autoType)` |
| Force layout | `d3.layout.force()` | `d3.forceSimulation()` + `forceLink/forceManyBody/forceCenter` |
| Transiciones | `.transition().duration()` | igual; usa `.transition(t)` compartidas y `selection.interrupt()` |

## 🔁 Cómo se estudia cada tema (ciclo de 6 pasos)

1. **Predecir** qué hará el código antes de ejecutarlo (anótalo en el README del tema).
2. **Construir** el reto del tema sin copiar la solución.
3. **Romper**: datos vacíos, negativos, miles de filas, nombres largos en el eje.
4. **Revisar** con Claude (rúbrica en `CLAUDE.md`).
5. **Refactorizar** con lo aprendido y hacer commit (`feat(d3-04): scatter plot con escala logaritmica`).
6. **Explicar** el concepto en 5 líneas con tus palabras.

## 📅 Calendario sugerido (4–5 semanas)

| Semana | Tema | Entregable |
|---|---|---|
| 1 | 3 · Introducción | Ejemplos del curso portados a v7 + lista de datos con `.join()` |
| 2 | 4 · Datos, SVG y gráficas | Bar chart y scatter plot con JSON **y** CSV |
| 3 | 5 · Escalas y ejes | Mismo dataset con escala lineal, log y ordinal; ejes formateados |
| 4 | 6 · Force layout e interacción | Grafo interactivo con drag, tooltip, transición y exportación a SVG |
| 5 | "A fondo" + repaso | React + D3 mínimo y mini-informe de comparación de librerías |

## ✅ Un tema está terminado cuando…

- [ ] Cumple los criterios de aceptación de su README.
- [ ] Hay predicción y explicación escritas.
- [ ] Pasó una revisión con Claude y no quedan hallazgos críticos.
- [ ] Hay commit con mensaje claro.
- [ ] Puedes rehacer el gráfico principal en 15 min sin mirar tu código.

## 📚 Referencias (del temario, "A fondo")

- *Interactive Data Visualization for the Web* (Scott Murray)
- Anand S.: *Beautiful visualizations with D3.js*
- *React y D3.js trabajando juntos*
- *Data Driven Delirious: An Intro to Data Visualisation Using D3.js*
- Librerías sobre D3: **Dimple**, **Visual Sedimentation**, **NVD3**
- Ejes: *Setting up the Axes*, *Labelling multiple lines on a graph*, *How to rotate the text labels for the x Axis*
- Documentación actual: <https://d3js.org> y <https://observablehq.com/@d3>

> Algunas de estas lecturas son de la era v3. Úsalas para entender la idea y consulta siempre la documentación v7 para la sintaxis.
