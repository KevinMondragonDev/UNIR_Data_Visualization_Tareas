# Tema 4 · D3.js: datos, SVG y gráficas

Temario: 4.2 Estructuras de datos JSON y CSV · 4.3 Generar y dibujar con SVG · 4.4 Bar Chart y Scatter Plot desde cero

## Estructura sugerida

```
02_datos_svg_y_graficas/
├── datos/            ventas.json, ventas.csv (mismo contenido en ambos formatos)
├── 01_svg_a_mano.html
├── 02_bar_chart.html
└── 03_scatter_plot.html
```

## Retos

1. **SVG sin D3 (4.3):** dibuja a mano `rect`, `circle`, `line`, `text` y un `<g transform>`. Entiende que **el eje Y crece hacia abajo**. Usa `viewBox` en vez de `width/height` fijos.
2. **JSON vs CSV (4.2):** carga el mismo dataset con `d3.json` y `d3.csv`. Con CSV todo llega como texto: usa `d3.autoType` o convierte con `+d.valor`. Muestra en consola qué cambia.
3. **Bar chart desde cero (4.4):** primero con alturas calculadas a mano (para sentir el problema), luego con `scaleBand` + `scaleLinear` y ejes (adelanto del Tema 5).
4. **Scatter plot (4.4):** `circle` por dato, radio proporcional con `scaleSqrt`, color por categoría.
5. **Mejora de calidad:** convención de márgenes (`margin`, `innerWidth`, `innerHeight`), función `render(data)`, manejo de error si falla la carga (`try/catch` + mensaje en pantalla), `<title>` y `aria-label` en el SVG.

> Servir `datos/` requiere un servidor local (`fetch` no funciona con `file://`). Usa `npx http-server .` o `python -m http.server`.

## Criterios de aceptación

- [ ] Bar chart y scatter plot funcionan con JSON y con CSV.
- [ ] El bar chart parte de cero y tiene ejes y título.
- [ ] No hay números mágicos: dominios con `d3.max`/`d3.extent`.
- [ ] Hay mensaje de error visible si falla la carga.
- [ ] Predicción y explicación escritas.

## Romper a propósito

Dataset vacío, valor negativo, categoría con nombre larguísimo, 5 000 puntos en el scatter (¿SVG aguanta?).

## Notas

**Predicción:**

**Qué pasó:**

**Explicación en 5 líneas:**
