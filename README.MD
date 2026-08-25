# Pomodoro Modo Plan

Aplicación web Pomodoro construida únicamente con la pila web estándar (HTML5, CSS3 y JavaScript Vanilla), sin frameworks ni librerías externas, desarrollada bajo una modalidad de **modo plan**: primero se aprueba el plan de arquitectura (`PLAN.md`) y luego se implementan los requerimientos uno a la vez, solo cuando el usuario lo indica.

- Ciclos predefinidos: 25 min de trabajo (Work) / 5 min de descanso (Short Break).
- Controles Iniciar/Pausar (toggle) y Reiniciar; cambio de modo manual.
- Notificaciones al finalizar cada ciclo: alerta sonora sintetizada (Web Audio API) y visuales (mensaje `aria-live`, parpadeo del título de la pestaña).
- Contador de pomodoros completados persistente en memoria durante la sesión.
- UI responsive, limpia y accesible (semántica HTML5, ARIA, contraste AA).

## Ejecución

Los ES Modules requieren servir por HTTP:

```bash
npx serve .
# o
python -m http.server
```

Abrir `index.html` directamente vía `file://` falla por CORS.

---

# Prompts - Modo Plan

Bitácora del historial de prompts clave utilizados para la generación del proyecto.

## 1. Prompt inicial — Plan de arquitectura

> Quiero construir una aplicación Web "Pomodoro". Esta debe ser desarrollada utilizando únicamente la pila web estándar (HTML5, CSS3 y JavaScript Vanilla), sin el uso de frameworks (como React, Angular o Vue) ni librerías externas de interfaz o lógica. Dame primero un plan paso a paso que incluya: 1. estructura del DOM, 2. módulos JS, 3. flujos de eventos y 4. estilos). Una vez aprobado el plan, se ejecuta ordenadamente un requerimiento a la vez. Solo cuando yo lo indique vas a implementar el siguiente requerimiento en código.
>
> Los Requerimientos Funcionales Mínimos:
>
> - Temporizador Funcional: Ciclos predefinidos de 25 minutos de trabajo (Work) y 5 minutos de descanso (Short Break).
> - Controles del Temporizador: Botones de control para Iniciar, Pausar y Reiniciar la cuenta regresiva.
> - Notificaciones: Alerta sonora (usando Audio API web) y/o visual (cambios de estado en la pestaña/interfaz) al finalizar cada ciclo.
> - Contador de Ciclos: Contador persistente en memoria que indique la cantidad de Pomodoros completados en la sesión.
> - Interfaz de Usuario (UI/UX): Diseño responsive, limpio, accesible (semántica HTML5) y adaptativo a dispositivos móviles y de escritorio.

**Resultado:** plan de arquitectura aprobado (DOM, módulos JS, flujos de eventos, estilos) y decisiones de diseño registradas: cambio de modo manual tras el fin de cada ciclo y un solo botón toggle Iniciar/Pausar más botón Reiniciar.

## 2. R1 — Esqueleto + temporizador funcional

> Ejecuta la implementación del R1: Temporizador Funcional: Ciclos predefinidos de 25 minutos de trabajo (Work) y 5 minutos de descanso (Short Break).

**Resultado:** esqueleto semántico (`index.html`, `css/styles.css`) y temporizador funcional basado en timestamps con máquina de estados (`js/config.js`, `js/timer.js`, `js/ui.js`, `js/app.js`).

## 3. Documentar el plan

> Antes de continuar quiero que el El plan de arquitectura generado anteriormente lo guardes en un archivo PLAN.md dentro del repositorio

**Resultado:** `PLAN.md` creado con las decisiones de diseño, estructura del DOM, módulos, flujos de eventos, estilos y roadmap R1–R5.

## 4. R2 — Controles del temporizador

> Ahora procede con el resto de la implementación del R2 en caso falte algo. R2: Controles del Temporizador: Botones de control para Iniciar, Pausar y Reiniciar la cuenta regresiva.

**Resultado:** refinamiento de controles: etiquetas por estado (Iniciar/Pausar/Reanudar), botón Reiniciar deshabilitado en reposo, corrección del arranque desde estado finalizado y estados visuales de pausa/finalización.

## 5. R3 — Notificaciones

> Continua con la implementación del R3: Notificaciones: Alerta sonora (usando Audio API web) y/o visual (cambios de estado en la pestaña/interfaz) al finalizar cada ciclo.

**Resultado:** campana sintetizada con Web Audio API (`js/audio.js`, sin archivos externos, contexto desbloqueado en el primer gesto), mensajes en zona `aria-live` (`#status-region`) y parpadeo del título de la pestaña.

## 6. R4 — Contador de ciclos

> Procede con la implementación del R4: Contador de Ciclos: Contador persistente en memoria que indique la cantidad de Pomodoros completados en la sesión.

**Resultado:** contador en memoria a nivel de módulo (`js/session.js`); solo los ciclos Work completados incrementan pomodoros, renderizado en `#cycle-count`.

## 7. R5 — UI/UX responsive y accesible

> Finaliza con la implementación del R5: Interfaz de Usuario (UI/UX): Diseño responsive, limpio, accesible (semántica HTML5) y adaptativo a dispositivos móviles y de escritorio.

**Resultado:** pulido final: `<time>` semántico, targets táctiles ≥44 px, `touch-action`, fallback `100vh`/`100dvh`, layout compacto en apaisado bajo, halo de color por modo, soporte `prefers-contrast: more` y `prefers-reduced-motion`.
