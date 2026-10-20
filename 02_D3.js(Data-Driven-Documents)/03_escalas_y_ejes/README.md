# Tema 5 · D3.js: escalando y dibujando ejes de un gráfico

Temario: 5.2 Escala no ordinal o logarítmica · 5.3 Ejes · 5.4 Escala ordinal

## Retos

1. **Misma data, cuatro escalas (5.2):** con un dataset de rango muy amplio (ej. población de países) usa `scaleLinear`, `scaleLog`, `scalePow(0.5)`/`scaleSqrt` y `scaleSymlog`. Explica en notas qué cuenta cada una y cuándo engaña.
2. **Escala logarítmica bien hecha:** el dominio no puede incluir 0. Rotula claramente "escala logarítmica" y fija `ticks` legibles con `d3.format("~s")`.
3. **Ejes (5.3):** `d3.axisBottom/axisLeft`, `.ticks()`, `.tickFormat()`, `.tickSize(-innerWidth)` para una rejilla. Lee *Setting up the Axes*.
4. **Escala ordinal (5.4):** `scaleBand` para posición (con `padding`) y `scaleOrdinal(d3.schemeTableau10)` para color. Distingue cuándo usar cada una.
5. **Etiquetas largas:** rota las del eje X (lee *How to rotate the text labels for the x Axis*): `selectAll("text").attr("transform", "rotate(-40)").style("text-anchor", "end")`. Después piensa si un gráfico horizontal sería mejor.
6. **Varias líneas etiquetadas:** dibuja 3 series y etiquétalas directamente al final de cada línea en lugar de usar una leyenda (*Labelling multiple lines on a graph*). Añade `scaleTime` para el eje X.

## Criterios de aceptación

- [ ] Dominio calculado de los datos, nunca números fijos.
- [ ] La escala log está justificada y rotulada.
- [ ] Ejes con formato legible (miles, fechas, moneda).
- [ ] Etiquetas del eje X legibles sin solaparse.
- [ ] Predicción y explicación escritas.

## Romper a propósito

Dominio con 0 en escala log, `range` invertido, fechas como cadena sin parsear (`d3.timeParse`), valores negativos en `scaleSqrt`.

## Notas

**Predicción:**

**Qué pasó:**

**Explicación en 5 líneas:**
