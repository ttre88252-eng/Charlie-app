# Charlie — chat app (Vite + React, para Android/Termux)

Adaptación 100% para correr en **Termux sobre Android** con **Vite**, sin nada específico de Windows.

## Qué se corrigió respecto al archivo original

1. **`window.storage` no existe fuera de un artifact de Claude.ai.**
   El componente original llamaba a `window.storage.get/set/delete`, una API que solo
   inyecta el sandbox de Claude.ai. Fuera de ahí (Vite, Termux, Chrome normal) esto
   rompía la app apenas cargaba. Se agregó `src/lib/storage.js`, un polyfill que
   implementa la misma forma de API pero usando `localStorage` real del navegador.

2. **Las llamadas a la IA no funcionaban fuera del sandbox.**
   - La llamada a Claude no mandaba `x-api-key` ni las cabeceras necesarias, y usaba
     `"claude-sonnet-4-6"`, que es un alias interno del sandbox de artifacts, no un
     modelo real de la API pública. Se corrigió para usar `x-api-key`,
     `anthropic-version` y `anthropic-dangerous-direct-browser-access` (necesaria para
     poder llamar a la API de Anthropic directo desde el navegador), con el modelo
     público `claude-sonnet-5`.
   - Ahora podés cargar **tu propia clave de Anthropic y/o de Gemini** en
     Ajustes → Clave de API. Si cargás ambas, se usa primero Anthropic.
   - Como esta app no tiene backend, la clave viaja desde el navegador del teléfono
     directo a la API — no hay "modelo integrado" gratis fuera de Claude.ai.

3. **Tailwind, fuentes y estructura de proyecto Vite.**
   El archivo original era un único componente pensado para pegarse dentro del
   entorno de artifacts (que ya trae Tailwind y React preconfigurados). Se armó
   un proyecto Vite completo: `package.json`, `vite.config.js`,
   `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`,
   `src/index.css`. Las fuentes de Google ahora se cargan de forma estática en
   `index.html` en vez de inyectarse por JS en cada montaje.

4. **Textos hardcodeados en español** (aunque el usuario eligiera inglés) en el
   diálogo de Ajustes, el menú de adjuntar, botones y mensajes de error — se
   movieron todos al sistema de traducción `STR.es` / `STR.en` ya existente.

5. **`vite.config.js`** usa `host: true` y `watch.usePolling` porque el watcher de
   archivos por defecto de Vite puede fallar en el almacenamiento de Termux/Android;
   con polling detecta los cambios igual.

## Requisitos en Termux

```bash
pkg update && pkg upgrade
pkg install nodejs-lts git
```

(`nodejs-lts` da una versión de Node más estable en Android que el paquete `nodejs` normal.)

Verificá versiones:

```bash
node -v
npm -v
```

## Instalación

Copiá esta carpeta (`charlie-app/`) al almacenamiento de Termux, por ejemplo:

```bash
cd ~
# si venís de la carpeta compartida de Android:
# termux-setup-storage   (una sola vez, para poder acceder a ~/storage/shared)
cp -r /ruta/a/charlie-app ~/charlie-app
cd ~/charlie-app
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Vite va a mostrar algo como:

```
Local:   http://localhost:5173/
Network: http://192.168.x.x:5173/
```

Abrí ese link en Chrome (u otro navegador) **en el mismo teléfono**. `localhost`
cuenta como "origen seguro", así que el micrófono (reconocimiento de voz) va a
funcionar igual que con HTTPS.

## Compilar para producción

```bash
npm run build
npm run preview
```

`dist/` queda con los archivos estáticos finales, que podés servir con cualquier
servidor estático (o abrir con `npm run preview`).

## Configurar tu clave de API

1. Abrí la app → ícono de engranaje (Ajustes) → pestaña **Clave de API**.
2. Pegá tu clave de Anthropic (`sk-ant-...`) y/o de Gemini (de Google AI Studio).
3. Marcá "Recordar esta clave" si querés que persista entre sesiones (se guarda
   en el `localStorage` del navegador, solo en tu teléfono).

⚠️ Como es una app 100% cliente (sin servidor propio), la clave queda expuesta
en el navegador. Es apta para uso personal, no para publicar en un sitio
compartido con otras personas.

## Permisos en Android

- **Cámara / galería**: usan `<input type="file" capture="environment">`, así
  que el navegador te va a pedir permiso de cámara la primera vez que tocás
  "Tomar foto".
- **Micrófono**: usa la Web Speech API (`webkitSpeechRecognition`), disponible
  en Chrome para Android. Te va a pedir permiso de micrófono la primera vez.
