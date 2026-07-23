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

## Cómo instalarla en la tablet (que quede como app, no como acceso directo)

Para que quede **instalada de verdad** (ícono propio, pantalla completa, sin la barra de Chrome) hay que abrirla desde **una dirección web HTTPS**, no desde el archivo.

1. Subí el repo a **GitHub Pages** (Settings → Pages → Deploy from branch → rama `main`, carpeta `/root`). Te queda una URL tipo `https://usuario.github.io/repo/`.
2. Abrí esa URL en el **Chrome de la tablet**. Esperá unos segundos (se registra el modo sin conexión).
3. Menú de Chrome (⋮) → tocá **"Instalar aplicación"**.
   - ⚠️ Si solo aparece **"Agregar a la pantalla principal"**, eso crea un *acceso directo* que abre Chrome (no queda instalada). Suele pasar cuando se abre el archivo local en vez de la URL HTTPS. Usá siempre la URL de GitHub Pages y esperá a que aparezca **"Instalar aplicación"**.
4. Listo: abre a pantalla completa con su ícono y **funciona sin internet**.

> Nota: abrir el archivo `index.html` directamente (file://) también anda offline, pero **no** se puede instalar como app; para eso hace falta la URL HTTPS (GitHub Pages).

## Uso rápido

1. Pegá los nombres en el recuadro de la izquierda (uno por línea) y tocá **Agregar a la ruleta**.
2. Tocá **GIRAR**.
3. Cuando sale el ganador, elegí **Quitar y seguir** o **Dejar en la ruleta**.
4. Al finalizar el evento, tocá **Terminar sorteo** para vaciar todo.
