// Dashboard de ventas: conecta ventas.json con Google Charts (columnas) y D3.js (burbujas).
// Orden de lectura: 1) configuración, 2) carga de datos, 3) KPIs, 4) Google Charts,
// 5) D3.js, 6) actualización (botón, temporizador y redimensionado).

// ---------- 1. Configuración ----------
const ARCHIVO_DATOS = "ventas.json";
const INTERVALO_MS = 30000;
const MESES_ORDEN = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const PALETA = ["#2563eb", "#f97316", "#10b981", "#a855f7", "#e11d48", "#0891b2"];
// "corto" se usa en ejes y etiquetas del SVG ($24k); el tooltip muestra el valor completo.
const METRICAS = {
  ventas: { etiqueta: "Ventas (unidades)", corto: (v) => numero.format(v) },
  ingresos: { etiqueta: "Ingresos ($)", corto: (v) => `$${d3.format("~s")(v)}` },
};

const numero = new Intl.NumberFormat("es-MX");
const moneda = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
const color = d3.scaleOrdinal(PALETA);

let datos = [];
let productoResaltado = null;
let temporizador = null;
let graficoColumnas = null;

const btnActualizar = document.getElementById("btn-actualizar");
const chkAuto = document.getElementById("auto-actualizar");
const selMetrica = document.getElementById("metrica-y");
const estado = document.getElementById("estado");
const tooltip = document.getElementById("tooltip");
document.getElementById("intervalo-seg").textContent = INTERVALO_MS / 1000;

// ---------- 2. Carga y preparación de datos ----------
// Se añade un parámetro con la hora y cache "no-store" para que el navegador
// no reutilice una copia vieja del JSON: cada lectura trae el archivo actual.
async function cargarDatos() {
  const respuesta = await fetch(`${ARCHIVO_DATOS}?t=${Date.now()}`, { cache: "no-store" });
  if (!respuesta.ok) throw new Error(`No se pudo leer ${ARCHIVO_DATOS} (HTTP ${respuesta.status})`);
  const crudo = await respuesta.json();

  const registros = crudo
    .map((d) => ({
      producto: String(d.producto).trim(),
      mes: String(d.mes).trim(),
      ventas: Number(d.ventas),
      ingresos: Number(d.ingresos),
      precio: Number(d.precio),
    }))
    .filter((d) => d.producto && d.mes && [d.ventas, d.ingresos, d.precio].every(Number.isFinite));

  registros
    .filter((d) => d.ventas * d.precio !== d.ingresos)
    .forEach((d) => console.warn(`Ingresos incoherentes en ${d.producto} / ${d.mes}: ${d.ventas} × ${d.precio} ≠ ${d.ingresos}`));

  return registros;
}

function listaMeses(registros) {
  const unicos = [...new Set(registros.map((d) => d.mes))];
  const posicion = (m) => (MESES_ORDEN.indexOf(m) === -1 ? 99 : MESES_ORDEN.indexOf(m));
  return unicos.sort((a, b) => posicion(a) - posicion(b));
}

function listaProductos(registros) {
  return [...new Set(registros.map((d) => d.producto))];
}

// ---------- 3. Indicadores (KPIs) ----------
function dibujarKPIs() {
  const meses = listaMeses(datos);
  const ultimo = meses[meses.length - 1];
  const previo = meses[meses.length - 2];
  const total = (mes, campo) => d3.sum(datos.filter((d) => d.mes === mes), (d) => d[campo]);

  const delta = (actual, anterior) => {
    if (!previo || !anterior) return "";
    const cambio = (actual - anterior) / anterior;
    const clase = cambio >= 0 ? "text-success" : "text-danger";
    return `<div class="small ${clase}">${cambio >= 0 ? "▲" : "▼"} ${(Math.abs(cambio) * 100).toFixed(1)} % vs ${previo}</div>`;
  };

  const delMes = datos.filter((d) => d.mes === ultimo);
  const lider = delMes.reduce((a, b) => (b.ingresos > a.ingresos ? b : a), delMes[0]);

  const tarjetas = [
    { etiqueta: `Unidades · ${ultimo}`, valor: numero.format(total(ultimo, "ventas")), extra: delta(total(ultimo, "ventas"), total(previo, "ventas")) },
    { etiqueta: `Ingresos · ${ultimo}`, valor: moneda.format(total(ultimo, "ingresos")), extra: delta(total(ultimo, "ingresos"), total(previo, "ingresos")) },
    { etiqueta: "Ingresos acumulados", valor: moneda.format(d3.sum(datos, (d) => d.ingresos)), extra: `<div class="small text-body-secondary">${meses.length} meses · ${listaProductos(datos).length} productos</div>` },
    { etiqueta: `Líder en ingresos · ${ultimo}`, valor: lider.producto, extra: `<div class="small text-body-secondary">${moneda.format(lider.ingresos)}</div>` },
  ];

  // Cada KPI es una columna del grid de Bootstrap con una card dentro.
  document.getElementById("kpis").innerHTML = tarjetas
    .map((t) => `
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body py-3">
            <div class="small text-body-secondary text-uppercase">${t.etiqueta}</div>
            <div class="fs-4 fw-bold">${t.valor}</div>
            ${t.extra}
          </div>
        </div>
      </div>`)
    .join("");
}

// ---------- 4. Google Charts: columnas de ventas por mes y producto ----------
// Cada fila es un mes y cada columna un producto, así Google dibuja una
// columna por producto dentro de cada mes.
function dibujarColumnas() {
  const meses = listaMeses(datos);
  const productos = listaProductos(datos);
  const filas = meses.map((mes) => [
    mes,
    ...productos.map((p) => datos.find((d) => d.mes === mes && d.producto === p)?.ventas ?? null),
  ]);
  const tabla = google.visualization.arrayToDataTable([["Mes", ...productos], ...filas]);
  // En pantallas angostas Google recorta los nombres de la leyenda ("Smart…") y no
  // permite partirla en varias líneas: se oculta y se muestra una leyenda HTML.
  const estrecho = document.getElementById("grafico-columnas").offsetWidth < 480;
  const leyendaHtml = d3.select("#leyenda-columnas").property("hidden", !estrecho);
  leyendaHtml.selectAll("span.item")
    .data(productos, (p) => p)
    .join((enter) => {
      const item = enter.append("span").attr("class", "item d-flex align-items-center gap-2");
      item.append("span").attr("class", "punto");
      item.append("span").attr("class", "nombre");
      return item;
    })
    .call((s) => s.select(".punto").style("background", (p) => color(p)))
    .call((s) => s.select(".nombre").text((p) => p));

  const opciones = {
    colors: productos.map((p) => color(p)),
    legend: estrecho ? { position: "none" } : { position: "top", alignment: "center" },
    hAxis: { title: "Mes" },
    vAxis: { title: estrecho ? null : "Unidades vendidas", minValue: 0, gridlines: { color: "#e4e7eb" } },
    chartArea: { left: estrecho ? 36 : 64, right: 16, top: estrecho ? 16 : 40, bottom: 56 },
    bar: { groupWidth: "70%" },
    animation: { startup: true, duration: 800, easing: "out" },
    fontName: "system-ui",
    backgroundColor: "transparent",
  };

  if (!graficoColumnas) {
    graficoColumnas = new google.visualization.ColumnChart(document.getElementById("grafico-columnas"));
  }
  graficoColumnas.draw(tabla, opciones);
}

// ---------- 5. D3.js: gráfico de burbujas multidimensional ----------
// X = mes (y dentro de cada mes, un hueco por producto), Y = métrica elegida,
// color = producto, tamaño (área) = la otra métrica.
const ANCHO = 640;
const ALTO = 400;
const MARGEN = { top: 24, right: 20, bottom: 48, left: 76 };
const anchoInterno = ANCHO - MARGEN.left - MARGEN.right;
const altoInterno = ALTO - MARGEN.top - MARGEN.bottom;

const svg = d3.select("#grafico-burbujas")
  .append("svg")
  .attr("viewBox", `0 0 ${ANCHO} ${ALTO}`)
  .attr("role", "img")
  .attr("aria-label", "Gráfico de burbujas de ventas e ingresos por producto y mes");

const lienzo = svg.append("g").attr("transform", `translate(${MARGEN.left},${MARGEN.top})`);
const gCuadricula = lienzo.append("g").attr("class", "cuadricula");
const gEjeX = lienzo.append("g").attr("class", "eje").attr("transform", `translate(0,${altoInterno})`);
const gEjeY = lienzo.append("g").attr("class", "eje");
const gBurbujas = lienzo.append("g");
const gEtiquetas = lienzo.append("g");
const tituloY = svg.append("text")
  .attr("class", "titulo-eje")
  .attr("transform", `translate(16,${MARGEN.top + altoInterno / 2}) rotate(-90)`)
  .attr("text-anchor", "middle");

function dibujarBurbujas() {
  const metricaY = selMetrica.value;
  const metricaTam = metricaY === "ventas" ? "ingresos" : "ventas";
  const meses = listaMeses(datos);
  const productos = listaProductos(datos);

  const x = d3.scaleBand().domain(meses).range([0, anchoInterno]).padding(0.15);
  const xProducto = d3.scaleBand().domain(productos).range([0, x.bandwidth()]).padding(0.1);
  const y = d3.scaleLinear()
    .domain([0, d3.max(datos, (d) => d[metricaY]) * 1.2])
    .nice()
    .range([altoInterno, 0]);
  const radioMax = Math.min(xProducto.bandwidth() / 2, 40);
  const r = d3.scaleSqrt().domain([0, d3.max(datos, (d) => d[metricaTam])]).range([0, radioMax]);

  const cx = (d) => x(d.mes) + xProducto(d.producto) + xProducto.bandwidth() / 2;
  const t = svg.transition().duration(900).ease(d3.easeCubicInOut);

  gEjeX.transition(t).call(d3.axisBottom(x));
  gEjeY.transition(t).call(d3.axisLeft(y).ticks(6).tickFormat((v) => METRICAS[metricaY].corto(v)));
  gCuadricula.transition(t).call(d3.axisLeft(y).ticks(6).tickSize(-anchoInterno).tickFormat(""));
  tituloY.text(METRICAS[metricaY].etiqueta);

  const clave = (d) => `${d.producto}|${d.mes}`;

  gBurbujas.selectAll("circle")
    .data(datos, clave)
    .join(
      (enter) => enter.append("circle")
        .attr("class", "burbuja")
        .attr("cx", cx)
        .attr("cy", altoInterno)
        .attr("r", 0)
        .attr("fill", (d) => color(d.producto)),
      (update) => update,
      (exit) => exit.transition(t).attr("r", 0).attr("cy", altoInterno).remove()
    )
    .on("mouseover", (event, d) => mostrarTooltip(event, d))
    .on("mousemove", (event) => moverTooltip(event))
    .on("mouseout", ocultarTooltip)
    .on("click", (event, d) => alternarResaltado(d.producto))
    .transition(t)
    .delay((d, i) => i * 60)
    .attr("cx", cx)
    .attr("cy", (d) => y(d[metricaY]))
    .attr("r", (d) => r(d[metricaTam]))
    .attr("fill", (d) => color(d.producto));

  gEtiquetas.selectAll("text")
    .data(datos, clave)
    .join(
      (enter) => enter.append("text").attr("class", "etiqueta-valor").attr("x", cx).attr("y", altoInterno).attr("opacity", 0),
      (update) => update,
      (exit) => exit.transition(t).attr("opacity", 0).remove()
    )
    .text((d) => METRICAS[metricaY].corto(d[metricaY]))
    .transition(t)
    .delay((d, i) => i * 60)
    .attr("x", cx)
    .attr("y", (d) => y(d[metricaY]) - r(d[metricaTam]) - 6)
    .attr("opacity", 1);

  document.getElementById("nota-burbujas").textContent =
    `D3.js · X = mes, color = producto, Y = ${metricaY}, tamaño = ${metricaTam}`;

  dibujarLeyenda(productos);
  aplicarResaltado();
}

function dibujarLeyenda(productos) {
  d3.select("#leyenda")
    .selectAll("button")
    .data(productos, (p) => p)
    .join((enter) => {
      const boton = enter.append("button").attr("type", "button");
      boton.append("span").attr("class", "punto");
      boton.append("span").attr("class", "nombre");
      return boton;
    })
    .on("click", (event, p) => alternarResaltado(p))
    .call((b) => b.select(".punto").style("background", (p) => color(p)))
    .call((b) => b.select(".nombre").text((p) => p));
}

function alternarResaltado(producto) {
  productoResaltado = productoResaltado === producto ? null : producto;
  aplicarResaltado();
}

function aplicarResaltado() {
  const activo = (p) => !productoResaltado || productoResaltado === p;
  gBurbujas.selectAll("circle").classed("atenuada", (d) => !activo(d.producto));
  gEtiquetas.selectAll("text").attr("opacity", (d) => (activo(d.producto) ? 1 : 0.15));
  d3.select("#leyenda").selectAll("button").classed("activo", (p) => productoResaltado === p);
}

function mostrarTooltip(event, d) {
  d3.select(event.currentTarget).attr("stroke", "#111827");
  tooltip.innerHTML = `
    <strong>${d.producto} · ${d.mes}</strong>
    Ventas: ${numero.format(d.ventas)} u.<br>
    Ingresos: ${moneda.format(d.ingresos)}<br>
    Precio: ${moneda.format(d.precio)}`;
  tooltip.hidden = false;
  moverTooltip(event);
}

function moverTooltip(event) {
  const desplazamiento = 14;
  const maxX = window.innerWidth - tooltip.offsetWidth - 8;
  tooltip.style.left = `${Math.min(event.clientX + desplazamiento, maxX)}px`;
  tooltip.style.top = `${event.clientY + desplazamiento}px`;
}

function ocultarTooltip(event) {
  d3.select(event.currentTarget).attr("stroke", null);
  tooltip.hidden = true;
}

// ---------- 6. Actualización ----------
// Vuelve a leer el JSON y redibuja KPIs, Google Charts y D3 a la vez,
// sin recargar la página.
async function actualizar(origen) {
  btnActualizar.disabled = true;
  try {
    datos = await cargarDatos();
    if (datos.length === 0) throw new Error(`${ARCHIVO_DATOS} no contiene registros válidos`);
    dibujarKPIs();
    dibujarColumnas();
    dibujarBurbujas();
    const hora = new Date().toLocaleTimeString("es-MX");
    estado.classList.remove("text-danger", "fw-semibold");
    estado.textContent = `${datos.length} registros · meses: ${listaMeses(datos).join(", ")} · última lectura ${hora} (${origen})`;
  } catch (error) {
    console.error(error);
    estado.classList.add("text-danger", "fw-semibold");
    estado.textContent = `Error al actualizar: ${error.message}`;
  } finally {
    btnActualizar.disabled = false;
  }
}

btnActualizar.addEventListener("click", () => actualizar("botón Actualizar"));

chkAuto.addEventListener("change", () => {
  clearInterval(temporizador);
  temporizador = chkAuto.checked ? setInterval(() => actualizar("automática"), INTERVALO_MS) : null;
});

selMetrica.addEventListener("change", () => {
  if (datos.length) dibujarBurbujas();
});

// Google Charts no se adapta solo al ancho: se redibuja al cambiar el tamaño.
let esperaResize;
window.addEventListener("resize", () => {
  clearTimeout(esperaResize);
  esperaResize = setTimeout(() => datos.length && dibujarColumnas(), 200);
});

google.charts.load("current", { packages: ["corechart"], language: "es" });
google.charts.setOnLoadCallback(() => actualizar("carga inicial"));
