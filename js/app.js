import Timer from './timer.js';
import { initUI, render } from './ui.js';

const timer = new Timer();

function onTick(event) {
  render(event.detail);
}

function onComplete() {
  // R3: aquí se conectarán las notificaciones sonoras y visuales.
}

initUI({
  onToggle: () => timer.toggle(),
  onReset: () => timer.reset(),
  onModeChange: (mode) => timer.setMode(mode),
});

timer.addEventListener('tick', onTick);
timer.addEventListener('complete', onComplete);

render({
  mode: timer.mode,
  state: timer.state,
  remaining: timer.remaining,
});
