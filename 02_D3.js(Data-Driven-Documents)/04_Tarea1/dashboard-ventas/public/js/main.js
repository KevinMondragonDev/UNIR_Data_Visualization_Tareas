// Punto de entrada: coordina la carga de datos y el redibujado de las tres vistas
// (KPIs, Google Charts y D3) ante la carga inicial, el botón «Actualizar»,
// el temporizador, el cambio de métrica y el cambio de tamaño de la ventana.
import { INTERVALO_MS } from "./config.js";
import { cargarDatos, listaMeses } from "./datos.js";
import { dibujarKPIs } from "./kpis.js";
import { dibujarColumnas } from "./graficoColumnas.js";
import { dibujarBurbujas } from "./graficoBurbujas.js";

let datos = [];
let temporizador = null;

const btnActualizar = document.getElementById("btn-actualizar");
const chkAuto = document.getElementById("auto-actualizar");
const selMetrica = document.getElementById("metrica-y");
const estado = document.getElementById("estado");
document.getElementById("intervalo-seg").textContent = INTERVALO_MS / 1000;

// Vuelve a leer el JSON y redibuja KPIs, Google Charts y D3 a la vez,
// sin recargar la página.
async function actualizar(origen) {
  btnActualizar.disabled = true;
  try {
    datos = await cargarDatos();
    dibujarKPIs(datos);
    dibujarColumnas(datos);
    dibujarBurbujas(datos, selMetrica.value);
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
  if (datos.length) dibujarBurbujas(datos, selMetrica.value);
});

// Google Charts no se adapta solo al ancho: se redibuja al cambiar el tamaño.
let esperaResize;
window.addEventListener("resize", () => {
  clearTimeout(esperaResize);
  esperaResize = setTimeout(() => datos.length && dibujarColumnas(datos), 200);
});

google.charts.load("current", { packages: ["corechart"], language: "es" });
google.charts.setOnLoadCallback(() => actualizar("carga inicial"));
