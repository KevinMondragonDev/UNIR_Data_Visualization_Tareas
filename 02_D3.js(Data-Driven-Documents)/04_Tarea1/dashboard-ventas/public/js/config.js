// Configuración compartida por todos los módulos: fuente de datos, orden de meses,
// colores por producto y formatos de número.
// d3 y google llegan como globales desde los <script> del CDN en index.html.

export const ARCHIVO_DATOS = "ventas.json";
export const INTERVALO_MS = 30000;

export const MESES_ORDEN = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const PALETA = ["#2563eb", "#f97316", "#10b981", "#a855f7", "#e11d48", "#0891b2"];

// Mismo color para cada producto en Google Charts, D3 y las leyendas.
export const color = d3.scaleOrdinal(PALETA);

export const numero = new Intl.NumberFormat("es-MX");
export const moneda = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

// "corto" se usa en ejes y etiquetas del SVG ($24k); el tooltip muestra el valor completo.
export const METRICAS = {
  ventas: { etiqueta: "Ventas (unidades)", corto: (v) => numero.format(v) },
  ingresos: { etiqueta: "Ingresos ($)", corto: (v) => `$${d3.format("~s")(v)}` },
};
