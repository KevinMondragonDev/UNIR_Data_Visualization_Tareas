// Copia uno de los juegos de datos de datos/ a public/ventas.json.
// Uso: npm run datos:original | npm run datos:actualizado
const fs = require("fs");
const path = require("path");

const opcion = process.argv[2];
const origenes = {
  original: "ventas_original.json",
  actualizado: "ventas_actualizado.json",
};

if (!origenes[opcion]) {
  console.error(`Opción no válida: "${opcion}". Usa "original" o "actualizado".`);
  process.exit(1);
}

const raiz = path.join(__dirname, "..");
const origen = path.join(raiz, "datos", origenes[opcion]);
const destino = path.join(raiz, "public", "ventas.json");

fs.copyFileSync(origen, destino);
console.log(`public/ventas.json ← datos/${origenes[opcion]}. Pulsa «Actualizar» en el dashboard.`);
