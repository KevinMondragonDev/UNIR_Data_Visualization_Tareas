# Tema 3 · D3.js: introducción y funcionalidades

Temario: 3.1 Introducción y objetivos · 3.2 Definición e instalación · 3.3 Elementos básicos (generando elementos HTML) · 3.4 Datos reales y elementos en el HTML · 3.5 Ventajas de D3.js

## Archivos

- `01_elementos_basicos.html` y `02_elementos_con_datos.html`: ejemplos del curso (D3 v3, se conservan).
- `codigo_base.html`: plantilla base.

## Retos

1. **Predecir y comparar (3.3):** antes de abrir `01_elementos_basicos.html`, escribe qué verás. Luego abre DevTools y localiza el `<p>` generado. ¿Está en el HTML original o lo creó D3?
2. **Portar a v7 (3.2):** crea `01_elementos_basicos_v7.html` con `https://cdn.jsdelivr.net/npm/d3@7`, sin `onload` en el body (usa `<script>` al final o `DOMContentLoaded`).
3. **Datos reales (3.4):** a partir de un array de objetos, genera una `<ul>` con un `<li>` por elemento usando `.data(...).join("li")`.
4. **Actualizar sin recrear:** añade botones "agregar" y "quitar". Usa una *key function* `d => d.id` y comprueba en DevTools que los `<li>` existentes se reutilizan.
5. **Ventajas (3.5):** en `notas`, compara en 5 líneas D3 vs Google Charts (tarea 01): control, curva de aprendizaje, cuándo usar cada uno.

## Criterios de aceptación

- [ ] Ningún archivo nuevo usa `d3.v3` ni `http://`.
- [ ] Usas `.join()` y una key function.
- [ ] Puedes explicar la diferencia entre selección, data join y enter/update/exit.
- [ ] Predicción y explicación escritas abajo.

## Errores a provocar a propósito

Selección vacía (`select("#no-existe")`), olvidar la key, usar `append` dentro de un `forEach`.

## Notas

**Predicción:**

**Qué pasó:**

**Explicación en 5 líneas:**
