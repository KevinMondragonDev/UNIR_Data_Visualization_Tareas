// Indicadores del último mes comparados con el anterior, en una franja con filetes.
import { numero, moneda } from "./config.js";
import { listaMeses, listaProductos } from "./datos.js";

export function dibujarKPIs(datos) {
  const meses = listaMeses(datos);
  const ultimo = meses[meses.length - 1];
  const previo = meses[meses.length - 2];
  const total = (mes, campo) => d3.sum(datos.filter((d) => d.mes === mes), (d) => d[campo]);

  const delta = (actual, anterior) => {
    if (!previo || !anterior) return "";
    const cambio = (actual - anterior) / anterior;
    const clase = cambio >= 0 ? "text-success" : "text-danger";
    return `<div class="detalle ${clase}">${cambio >= 0 ? "▲" : "▼"} ${(Math.abs(cambio) * 100).toFixed(1)} % vs ${previo}</div>`;
  };

  const delMes = datos.filter((d) => d.mes === ultimo);
  const lider = delMes.reduce((a, b) => (b.ingresos > a.ingresos ? b : a), delMes[0]);

  const tarjetas = [
    { etiqueta: `Unidades · ${ultimo}`, valor: numero.format(total(ultimo, "ventas")), extra: delta(total(ultimo, "ventas"), total(previo, "ventas")) },
    { etiqueta: `Ingresos · ${ultimo}`, valor: moneda.format(total(ultimo, "ingresos")), extra: delta(total(ultimo, "ingresos"), total(previo, "ingresos")) },
    { etiqueta: "Ingresos acumulados", valor: moneda.format(d3.sum(datos, (d) => d.ingresos)), extra: `<div class="detalle text-body-secondary">${meses.length} meses · ${listaProductos(datos).length} productos</div>` },
    { etiqueta: `Líder en ingresos · ${ultimo}`, valor: lider.producto, extra: `<div class="detalle text-body-secondary">${moneda.format(lider.ingresos)}</div>` },
  ];

  document.getElementById("kpis").innerHTML = tarjetas
    .map((t) => `
      <div class="kpi">
        <div class="etiqueta">${t.etiqueta}</div>
        <div class="valor">${t.valor}</div>
        ${t.extra}
      </div>`)
    .join("");
}
