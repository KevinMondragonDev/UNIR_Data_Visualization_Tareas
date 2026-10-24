// Servidor local del dashboard de ventas (Tarea 1 · UNIR).
// Sirve la carpeta public/ y entrega ventas.json sin caché para que el
// botón «Actualizar» siempre lea la versión más reciente del archivo.
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  if (req.path.endsWith(".json")) {
    res.set("Cache-Control", "no-store");
  }
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Dashboard disponible en http://localhost:${PORT}`);
});
