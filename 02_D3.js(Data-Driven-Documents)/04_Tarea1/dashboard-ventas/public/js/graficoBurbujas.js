// Visualización multidimensional con D3.js: gráfico de burbujas.
// X = mes (y dentro de cada mes, un hueco por producto), Y = métrica elegida,
// color = producto, tamaño (área) = la otra métrica.
import { color, numero, moneda, METRICAS, TEMA } from "./config.js";
import { listaMeses, listaProductos } from "./datos.js";

const ANCHO = 640;
const ALTO = 400;
const MARGEN = { top: 24, right: 20, bottom: 48, left: 76 };
const anchoInterno = ANCHO - MARGEN.left - MARGEN.right;
const altoInterno = ALTO - MARGEN.top - MARGEN.bottom;

let productoResaltado = null;
const tooltip = document.getElementById("tooltip");

// El SVG y sus grupos se crean una sola vez; cada actualización solo los modifica.
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

export function dibujarBurbujas(datos, metricaY) {
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
  d3.select(event.currentTarget).attr("stroke", TEMA.tinta);
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
