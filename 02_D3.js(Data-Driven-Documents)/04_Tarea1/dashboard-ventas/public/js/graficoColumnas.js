// Visualización básica con Google Charts: columnas de ventas por mes y producto.
import { color, TEMA } from "./config.js";
import { listaMeses, listaProductos } from "./datos.js";

let grafico = null;

// Cada fila es un mes y cada columna un producto, así Google dibuja una
// columna por producto dentro de cada mes.
export function dibujarColumnas(datos) {
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
  dibujarLeyendaHtml(productos, estrecho);

  const textoEje = { color: TEMA.tintaSuave, fontSize: 12 };
  const tituloEje = { color: TEMA.tintaSuave, fontSize: 11, italic: false };

  const opciones = {
    colors: productos.map((p) => color(p)),
    legend: estrecho ? { position: "none" } : { position: "top", alignment: "start", textStyle: { color: TEMA.tinta, fontSize: 13 } },
    hAxis: { title: "Mes", textStyle: textoEje, titleTextStyle: tituloEje },
    vAxis: {
      title: estrecho ? null : "Unidades vendidas",
      minValue: 0,
      textStyle: textoEje,
      titleTextStyle: tituloEje,
      gridlines: { color: TEMA.filete },
      minorGridlines: { count: 0 },
      baselineColor: TEMA.tinta,
    },
    chartArea: { left: estrecho ? 36 : 64, right: 16, top: estrecho ? 16 : 40, bottom: 56 },
    bar: { groupWidth: "62%" },
    animation: { startup: true, duration: 800, easing: "out" },
    fontName: TEMA.sans,
    backgroundColor: "transparent",
    tooltip: { textStyle: { color: TEMA.tinta } },
  };

  if (!grafico) {
    grafico = new google.visualization.ColumnChart(document.getElementById("grafico-columnas"));
  }
  grafico.draw(tabla, opciones);
}

function dibujarLeyendaHtml(productos, visible) {
  d3.select("#leyenda-columnas")
    .property("hidden", !visible)
    .selectAll("span.item")
    .data(productos, (p) => p)
    .join((enter) => {
      const item = enter.append("span").attr("class", "item d-flex align-items-center gap-2");
      item.append("span").attr("class", "punto");
      item.append("span").attr("class", "nombre");
      return item;
    })
    .call((s) => s.select(".punto").style("background", (p) => color(p)))
    .call((s) => s.select(".nombre").text((p) => p));
}
