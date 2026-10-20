# A fondo · lecturas y librerías

## Lecturas (en este orden)

1. *Interactive Data Visualization for the Web* (Scott Murray): refuerza los Temas 3 a 5. Es de la era v4, así que traduce la sintaxis a v7.
2. *Setting up the Axes*, *Labelling multiple lines on a graph*, *How to rotate the text labels for the x Axis*: ya integradas en el Tema 5.
3. Anand S.: *Beautiful visualizations with d3.js*: ideas de diseño.
4. *Data Driven Delirious*: introducción alternativa a D3.

## Retos

1. **React + D3 (React y D3.js trabajando juntos):** patrón actual: *D3 calcula (escalas, layouts), React renderiza el SVG*. Reproduce el bar chart del Tema 4 como componente `<BarChart data={...} />` sin `d3.select` para dibujar. Usa `useRef` solo para ejes o zoom.
2. **Librerías sobre D3 (Dimple, NVD3, Visual Sedimentation):** elige dos y haz el mismo gráfico con cada una. Mira si siguen mantenidas (fecha del último release) y compara con **Observable Plot**, que es lo que se usa hoy para gráficos rápidos.
3. **Mini-informe:** tabla de 5 líneas con D3 puro vs librería vs Plot: tiempo de desarrollo, control, accesibilidad, mantenimiento.

## Criterios de aceptación

- [ ] El componente React no manipula el DOM con D3, excepto ejes/zoom.
- [ ] Mini-informe con recomendación justificada de cuándo usar cada opción.

## Notas

**Explicación en 5 líneas:**
