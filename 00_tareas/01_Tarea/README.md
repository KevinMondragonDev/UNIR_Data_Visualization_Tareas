# Tarea 1 · Visualizaciones interactivas con datos JSON y D3.js

Actividad **individual**. Enunciado oficial: `mexvidama08_actind.docx` (es también la **plantilla de entrega**).
Las aclaraciones vienen de las clases del 2026-10 (`02_D3.js(Data-Driven-Documents)/03_D3_Clases/624242.vtt` y `631601.vtt`).

## 📅 Entrega

- **Lunes 26 de octubre de 2026, 23:59 (hora de Ciudad de México)**, según se dijo en clase a este grupo. Fuera de plazo no se califica.
- ⚠️ En la clase 1 se vio que otro grupo tenía el **9 de noviembre**. **Confirma la fecha en la plataforma.**
- La profesora recomienda subirla 1 o 2 horas antes del cierre. No da retroalimentación antes de la fecha límite.

## 🎯 Caso

Una empresa tecnológica quiere evaluar Smartphone A, Smartphone B y Tablet X en enero y febrero (ventas, ingresos y precio) con un **dashboard interactivo**.

## 🧩 Qué hay que construir (4 partes = 4 criterios de 25 %)

| # | Parte | Requisitos | Evidencia en el informe |
|---|---|---|---|
| 1 | **Manejo de datos y actualización** | `ventas.json` con los 6 registros, cargado sin errores. El botón **«Actualizar»** vuelve a leer el JSON **sin recargar la página**. El temporizador (`setInterval`) es opcional: vale cualquiera de los dos, o ambos. | Captura del JSON original y de su gráfica. Después, el JSON **modificado** (ventas/ingresos/precio cambiados o un mes nuevo) y la gráfica actualizada. Explica la lógica de recarga. |
| 2 | **Visualización básica (Google Charts)** | `ColumnChart`: **eje X = meses**, **eje Y = ventas**, **una columna por producto**. Se redibuja al actualizar. | Captura. Las barras deben cuadrar con los datos y permitir comparar productos. Documenta cómo se recarga y se redibuja. |
| 3 | **Visualización multidimensional (D3.js)** | **Burbujas** o **dispersión**: producto → color o posición X, ventas o ingresos → eje Y, **tamaño = magnitud**. Además: **transiciones/animaciones** al entrar y al actualizar, **estilos SVG** personalizados y **eventos** (`mouseover`/`click`) con **tooltip**. | Captura, fragmento de código (no entero) y explicación de estilos, transiciones y eventos. |
| 4 | **Integración de la interfaz** | Las dos gráficas en **un solo dashboard** con el botón **«Actualizar»** visible, que redibuja **ambas a la vez**. | Captura del dashboard completo con el botón. Antes y después de actualizar. |

> "Adaptable a dispositivos": la profesora dijo que **no hace falta probarlo en el móvil**, porque se ejecuta en local. Basta con que se vea bien en tu pantalla. Aun así, un CSS con `flex`/`grid` y un SVG con `viewBox` no cuestan nada.

## 📦 Formato de entrega

- **Informe (PDF o Word)** sobre la plantilla `mexvidama08_actind.docx`: nombre, fecha, objetivo, y luego cada parte con **captura + fragmento corto de código + explicación**. **Esto es lo que se califica.**
- Quita del documento las secciones "Pautas de elaboración" de la plantilla.
- Máximo **10 páginas**. Ella dijo que no penaliza si te pasas un poco.
- **No pegues el código completo.** Pon capturas nítidas de los fragmentos clave.
- El foco está en la **interpretación y el storytelling** (insights y conclusiones), no en el código.
- **Adjunta el proyecto completo en `.zip`** (toda la carpeta de VS Code: `server.js`, `package.json`, `public/…`). Es el "archivo Node.js" que pide el enunciado. Lo usa como respaldo si algo no le cuadra.
- La guía paso a paso que mostró la profesora es solo apoyo. **El entregable es la plantilla de la plataforma completada.**

## 🛠️ Estructura técnica (guía de la profesora)

```
dashboard-ventas/
├── package.json        ← npm init -y
├── server.js           ← Express, puerto 3000
└── public/
    ├── index.html      ← título, botón Actualizar, 2 contenedores, Google Charts + D3
    ├── styles.css
    ├── app.js          ← productos/meses → cargar JSON → dibujar gráficos → botón Actualizar
    └── ventas.json
```

```bash
npm init -y && npm install express && node server.js
```

Abre `http://localhost:3000`. Si el puerto está ocupado, cámbialo en `server.js`.

### Implementación

El proyecto terminado está en [`02_D3.js(Data-Driven-Documents)/04_Tarea1/dashboard-ventas/`](../../02_D3.js(Data-Driven-Documents)/04_Tarea1/dashboard-ventas/README.md). El `server.js` vacío y `data/productos.json` de esta carpeta son los archivos iniciales y no se usan.

## 📊 Datos y storytelling (datos originales)

| Producto | Ene ventas | Feb ventas | Δ ventas | Ene ingresos | Feb ingresos | Precio |
|---|---|---|---|---|---|---|
| Smartphone A | 120 | 150 | **+25 %** | 24 000 | 30 000 | 200 |
| Smartphone B | 85 | 90 | +5,9 % | 17 000 | 18 000 | 200 |
| Tablet X | 60 | 70 | +16,7 % | 18 000 | 21 000 | 300 |
| **Total** | **265** | **310** | **+17 %** | **59 000** | **69 000** | — |

- En todos los registros se cumple `ingresos = ventas × precio`. **Mantén esa coherencia** en los datos modificados, porque la profesora insistió en que no "se disparen" las gráficas.
- Insights base:
  - Las unidades crecen de 265 a 310 (+17 %) y los ingresos suben 10 000.
  - Smartphone A aporta 6 000 de ese aumento.
  - Tablet X vende menos unidades, pero por su precio genera más ingresos que Smartphone B.
  - Smartphone B es el que menos crece.
- Para la actualización, por ejemplo, añade **Marzo** para los 3 productos con valores coherentes, o modifica las ventas de febrero y recalcula los ingresos. Documenta el antes y el después.

## ⚙️ Detalles técnicos que conviene cuidar

- **D3 v7** (`https://cdn.jsdelivr.net/npm/d3@7`). El código de los PDFs es v3 y la tabla de equivalencias está en `../../02_D3.js(Data-Driven-Documents)/03_D3_Clases/RESUMEN_CLASES_D3.md`. En v7 los eventos reciben `(event, d)`.
- **Evita la caché** al recargar el JSON: `fetch('ventas.json', { cache: 'no-store' })` o `d3.json('ventas.json?t=' + Date.now())`. Si no, el botón puede mostrar los datos viejos.
- **Google Charts**: carga con `google.charts.load('current', {packages:['corechart']})` y dibuja en `setOnLoadCallback`. Para redibujar, crea un `DataTable` nuevo y llama otra vez a `chart.draw()`. Para pivotar los datos, cada fila es un mes y cada columna un producto.
- **Burbujas en D3**:
  - Radio con `d3.scaleSqrt()`, para que el área sea proporcional.
  - Color con `d3.scaleOrdinal()` por producto.
  - X con `scaleBand` (producto o mes) e Y con `scaleLinear().range([h, 0])`.
  - Usa `.join()` con la key `d => d.producto + d.mes` para que la transición mueva las burbujas existentes en lugar de recrearlas.
- Que los ejes y la leyenda también se actualicen si entra un mes nuevo, porque los dominios se recalculan.

## ✅ Checklist final

- [ ] `ventas.json` con los 6 registros originales y captura de la primera versión del dashboard.
- [ ] Gráfico de columnas de Google Charts (X = mes, Y = ventas, una serie por producto).
- [ ] Gráfico de burbujas o dispersión en D3 con color, tamaño, ejes, tooltip, transición y evento.
- [ ] Botón «Actualizar» que redibuja **las dos** gráficas sin recargar la página (y temporizador opcional).
- [ ] JSON modificado con datos coherentes y capturas del antes y el después.
- [ ] Informe sobre la plantilla: objetivo, herramientas, 4 secciones con evidencias, storytelling y conclusiones.
- [ ] `.zip` con el proyecto Node completo.
- [ ] Entregado antes de las 21:00–22:00 (CDMX) del día límite.
