// Capa de datos: lee ventas.json, normaliza los registros y ofrece consultas
// (meses ordenados, productos). Ningún gráfico lee el archivo directamente.
import { ARCHIVO_DATOS, MESES_ORDEN } from "./config.js";

// Se añade un parámetro con la hora y cache "no-store" para que el navegador
// no reutilice una copia vieja del JSON: cada lectura trae el archivo actual.
export async function cargarDatos() {
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

  if (registros.length === 0) throw new Error(`${ARCHIVO_DATOS} no contiene registros válidos`);
  return registros;
}

export function listaMeses(registros) {
  const unicos = [...new Set(registros.map((d) => d.mes))];
  const posicion = (m) => (MESES_ORDEN.indexOf(m) === -1 ? 99 : MESES_ORDEN.indexOf(m));
  return unicos.sort((a, b) => posicion(a) - posicion(b));
}

export function listaProductos(registros) {
  return [...new Set(registros.map((d) => d.producto))];
}
