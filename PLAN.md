# PLAN.md — Plan de arquitectura: App Pomodoro (HTML5 + CSS3 + JS Vanilla)

Plan aprobado antes de la implementación. Pila: únicamente web estándar (sin frameworks ni librerías externas). Sin `package.json` ni paso de build.

## Decisiones de diseño

- **Cambio de modo**: manual — al finalizar un ciclo suena la alerta y el usuario decide cuándo pasar al siguiente modo (Work → Short Break y viceversa).
- **Controles**: un solo botón toggle Iniciar/Pausar (cambia texto e ícono) + botón Reiniciar independiente.

## 1. Estructura del DOM (`index.html`)

```
<body data-mode="work|break">
└── <main class="app">
    ├── <header>  → <h1> "Pomodoro"
    ├── <nav class="modes">  → selector de modo
    │   ├── botón "Work" (aria-pressed)
    │   └── botón "Short Break" (aria-pressed)
    ├── <section class="timer" role="timer">
    │   ├── anillo/barra de progreso
    │   └── <p id="time-display"> "25:00"
    ├── <section class="controls">
    │   ├── botón Iniciar/Pausar (toggle)
    │   └── botón Reiniciar
    ├── <section class="status" aria-live="polite"> ← mensajes visuales ("¡Descanso!")
    └── <footer>
        └── contador de ciclos: "Pomodoros completados: N" (#cycle-count)
</body>
```

Semántica: landmarks (`header`, `main`, `footer`), `role="timer"`, `aria-live` para lectores de pantalla, botones reales con `aria-label`.

## 2. Módulos JS (ES Modules, carpeta `js/`)

| Archivo | Responsabilidad |
|---|---|
| `config.js` | Constantes: `WORK_MIN = 25`, `BREAK_MIN = 5` |
| `timer.js` | Máquina de estados pura: `start/pause/reset/tick`. Basada en **timestamps (`Date.now()`)** para evitar deriva. Emite eventos `tick`, `complete` vía `CustomEvent` |
| `audio.js` | Beep sintetizado con **Web Audio API** (oscilador, sin archivos externos). Desbloqueo del AudioContext en primer gesto del usuario |
| `session.js` | Contador de pomodoros en memoria + gestión de modo actual |
| `ui.js` | Referencias al DOM y render: tiempo, modos, contadores, clases CSS de estado |
| `app.js` | Punto de entrada: orquesta módulos y suscribe eventos |

## 3. Flujos de eventos

1. **Iniciar**: click → `timer.start()` → `setInterval(250ms)` calcula restante por timestamp → `ui.updateTime()` (+ título de pestaña).
2. **Pausar**: congela el instante; **Reanudar** recalcula desde timestamp guardado.
3. **Reiniciar**: restaura duración del modo actual, detiene intervalo.
4. **Fin de ciclo** (`complete`):
   - `audio.playBeep()` (3 tonos ascendentes),
   - visual: mensaje en zona `aria-live`, parpadeo del título de la pestaña,
   - si era *Work* → incrementa contador de pomodoros,
   - cambio de modo manual (decisión del usuario desde los botones de modo; el timer queda en `00:00` con estado visual "finalizado").
5. **Cambio manual de modo**: reinicia timer con la duración del nuevo modo.

## 4. Estilos (`css/styles.css`)

- Mobile-first; centrado con Flexbox/Grid; tipografía del reloj con `clamp()`.
- **Custom properties** para temas: acento verde/rojo en *Work*, azul/teal en *Break* (cambia vía `body[data-mode]`).
- Estados visuales: `.is-running` (animación sutil), `.is-paused`, `.is-done` (pulso).
- Accesibilidad: `:focus-visible` marcado, contraste AA, respeto a `prefers-reduced-motion`.
- Responsive: reloj grande en móvil, layout amplio en escritorio.

## Requerimientos funcionales cubiertos

1. Temporizador funcional: ciclos predefinidos 25 min Work / 5 min Short Break.
2. Controles del temporizador: Iniciar, Pausar y Reiniciar.
3. Notificaciones: alerta sonora (Web Audio API) y/o visual al finalizar cada ciclo.
4. Contador de ciclos: pomodoros completados persistentes en memoria durante la sesión.
5. UI/UX: responsive, limpia, accesible (semántica HTML5), adaptativa a móvil y escritorio.

## Orden de ejecución (un requerimiento por vez, solo con aprobación del usuario)

| # | Requerimiento | Entrega | Estado |
|---|---|---|---|
| R1 | Esqueleto del proyecto + temporizador funcional 25/5 con controles básicos | `index.html`, `css/styles.css`, `config.js`, `timer.js`, `ui.js`, `app.js` | Hecho |
| R2 | Refinamiento de controles del temporizador | estados y UX de Iniciar/Pausar/Reiniciar | Hecho |
| R3 | Notificaciones sonoras (Web Audio) y visuales al finalizar ciclo | `audio.js` + zona `#status-region` + parpadeo de título | Hecho |
| R4 | Contador de pomodoros de la sesión | `session.js` + `#cycle-count` | Hecho |
| R5 | Pulido responsive + accesibilidad final | ajustes CSS/ARIA | Hecho |

## Ejecución y verificación

- Servir por HTTP (los ES Modules fallan vía `file://` por CORS): `npx serve .` o `python -m http.server`.
- Verificación mínima tras cambiar JS: `node --check js/<archivo>.js`.
