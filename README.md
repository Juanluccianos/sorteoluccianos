# Ruleta de sorteos — Lucciano's

Aplicación de sorteos con ruleta giratoria. Funciona **100% sin conexión** y se puede **instalar en una tablet** como app de pantalla completa.

## Qué hace

- Ruleta que gira con los nombres cargados, cada uno con un color distinto.
- Cargar nombres **pegando la lista completa** (uno por línea) → los toma como personas separadas.
- Botón **GIRAR** (en el centro de la ruleta). Sonido tic-tic al girar y fanfarria al salir el ganador.
- Al salir un ganador podés **Quitar y seguir** (lo saca de la ruleta para no repetir: 20 → 19 → 18…) o **Dejar en la ruleta**.
- La lista **se guarda sola** aunque cierres y abras la app, para no perder datos entre tiradas.
- Botón **Terminar sorteo**: recién ahí se borra todo y arranca de cero.

## Archivos del repo

```
index.html        ← la app completa (todo adentro, funciona sola)
manifest.json     ← datos para instalar como app
sw.js             ← permite el uso sin conexión (service worker)
icons/
  icon-192.png
  icon-512.png
```

Subí **todos** estos archivos al repositorio manteniendo la carpeta `icons/`.

## Cómo instalarla en la tablet

1. Subí el repo a **GitHub Pages** (Settings → Pages → Deploy from branch → rama `main`, carpeta `/root`).
2. Abrí la URL de GitHub Pages en el **Chrome de la tablet**.
3. Menú de Chrome (⋮) → **Agregar a la pantalla principal / Instalar app**.
4. Se abre a pantalla completa. Una vez abierta la primera vez, **queda disponible sin internet**.

> Alternativa sin servidor: podés abrir directamente el archivo `index.html` en el navegador de la tablet (funciona igual sin conexión), aunque para instalarla como app conviene GitHub Pages.

## Uso rápido

1. Pegá los nombres en el recuadro de la izquierda (uno por línea) y tocá **Agregar a la ruleta**.
2. Tocá **GIRAR**.
3. Cuando sale el ganador, elegí **Quitar y seguir** o **Dejar en la ruleta**.
4. Al finalizar el evento, tocá **Terminar sorteo** para vaciar todo.
