import Timer from './timer.js';
import { initUI, render, announce, startTitleFlash } from './ui.js';
import { playCompletionBell, unlockAudio } from './audio.js';

const timer = new Timer();

const CYCLE_MESSAGES = {
  work: 'Ciclo de trabajo completado. Empieza tu descanso cuando quieras.',
  break: 'Descanso terminado. Listo para otro pomodoro.',
};

initUI({
  onToggle: () => {
    unlockAudio();
    timer.toggle();
  },
  onReset: () => timer.reset(),
  onModeChange: (mode) => timer.setMode(mode),
});

timer.addEventListener('tick', (event) => render(event.detail));

timer.addEventListener('complete', (event) => {
  playCompletionBell();
  announce(CYCLE_MESSAGES[event.detail.mode]);
  startTitleFlash(event.detail.mode);
});

render({
  mode: timer.mode,
  state: timer.state,
  remaining: timer.remaining,
});
