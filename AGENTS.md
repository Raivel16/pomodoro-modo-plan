# AGENTS.md

## Proyecto
App Pomodoro en HTML5 + CSS3 + JavaScript Vanilla (ES Modules). Sin frameworks, sin librerías, sin `package.json` ni paso de build: los archivos estáticos son la app completa.

## Ejecución y verificación
- Los ES Modules requieren servir por HTTP: `npx serve .` o `python -m http.server`. Abrir `index.html` vía `file://` falla por CORS.
- No hay lint, tests ni typecheck configurados. Verificación mínima tras cambiar JS: `node --check js/<archivo>.js`.

## Arquitectura
- Flujo: `js/app.js` orquesta todo; instancia `Timer` (`js/timer.js`), se suscribe a sus eventos y llama `render()` de `js/ui.js`.
- `js/timer.js` es una máquina de estados pura (`idle/running/paused/finished`) que emite `CustomEvent` (`tick`, `complete`) y no toca el DOM.
- La cuenta regresiva se calcula con timestamps (`Date.now()`, intervalo de 250 ms), NO restando segundos por tick. Preservar este patrón para evitar deriva al pausar/reanudar o con pestañas en segundo plano.
- Duraciones y modos (work 25 min / break 5 min) viven solo en `js/config.js`; no hardcodear minutos en otros archivos.
- El estado visual se controla con `data-mode` / `data-state` en `<body>` y custom properties CSS en `css/styles.css` (un acento de color por modo).

## Convenciones de trabajo
- Desarrollo incremental: el usuario aprueba un requerimiento a la vez; no implementar el siguiente sin indicación explícita.
- Roadmap acordado: R1 esqueleto + temporizador 25/5 y R2 refinamiento de controles (hechos) → R3 notificaciones (Web Audio API sintetizada, sin archivos de audio) y visuales → R4 contador de pomodoros en memoria → R5 pulido responsive/accesibilidad.
- Placeholders ya presentes en el DOM para requisitos futuros: `#status-region` (zona `aria-live`, destinada a R3) y `#cycle-count` en el footer (destinado a R4).
