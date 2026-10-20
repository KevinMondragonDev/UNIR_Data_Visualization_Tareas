# Tema 6 · D3.js: force layout, transiciones, movimiento e interacción

Temario: 6.2 Force Layout · 6.3 Actualización de gráficos con base en eventos · 6.4 Transiciones y movimiento · 6.5 Interacción · 6.6 Exportar a PDF, bitmaps y SVG

## Retos

1. **Force layout (6.2):** grafo de nodos y enlaces con `d3.forceSimulation(nodes)`, `forceLink(links).id(d => d.id)`, `forceManyBody()`, `forceCenter()`. Experimenta con la fuerza de carga y `forceCollide`. Nota: el curso usa `d3.layout.force()` (v3), que ya no existe.
2. **Eventos (6.3):** `.on("click", (event, d) => ...)`. Un botón cambia el dataset y el gráfico se actualiza con `.join()` sin recrearse.
3. **Transiciones (6.4):** anima la entrada, actualización y salida con `.join(enter => ..., update => ..., exit => ...)` y `.transition().duration(600)`. Comparte una transición (`const t = svg.transition()`). Respeta `prefers-reduced-motion`.
4. **Interacción (6.5):** tooltip en hover (`d3.pointer`), `d3.drag` en nodos, `d3.zoom` con botón de reset, resaltar vecinos al pasar el mouse. Debe poder usarse con teclado (`tabindex`, `focus`).
5. **Exportar (6.6):**
   - **SVG:** serializar con `new XMLSerializer().serializeToString(svg.node())` y descargar como Blob.
   - **Bitmap (PNG):** dibujar el SVG en un `<canvas>` y usar `canvas.toBlob`.
   - **PDF:** `window.print()` con CSS `@media print` o una librería como jsPDF/svg2pdf.js.
   - Incluye los estilos *dentro* del SVG exportado, o se verá sin formato.
6. **Rendimiento:** detén la simulación con `simulation.stop()` cuando no se necesite y prueba con 500 nodos; compara SVG vs Canvas.

## Criterios de aceptación

- [ ] Grafo con fuerza, drag, zoom y tooltip.
- [ ] Transiciones de entrada/salida con propósito, y desactivables.
- [ ] Exporta a SVG y a PNG; PDF vía impresión.
- [ ] Usable con teclado.
- [ ] Predicción y explicación escritas.

## Romper a propósito

Enlaces a un id que no existe, 1 000 nodos, doble clic rápido durante una transición (`selection.interrupt()`).

## Notas

**Predicción:**

**Qué pasó:**

**Explicación en 5 líneas:**
