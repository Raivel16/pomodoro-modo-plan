import { DURATIONS, LABELS } from './config.js';

const els = {
  body: document.body,
  timeDisplay: document.getElementById('time-display'),
  progressBar: document.getElementById('progress-bar'),
  toggleButton: document.getElementById('btn-toggle'),
  resetButton: document.getElementById('btn-reset'),
  modeButtons: Array.from(document.querySelectorAll('[data-mode-button]')),
};

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

const TOGGLE_LABELS = {
  idle: ['Iniciar', 'Iniciar temporizador'],
  running: ['Pausar', 'Pausar temporizador'],
  paused: ['Reanudar', 'Reanudar temporizador'],
  finished: ['Iniciar', 'Volver a iniciar el temporizador'],
};

export function initUI({ onToggle, onReset, onModeChange }) {
  els.toggleButton.addEventListener('click', onToggle);
  els.resetButton.addEventListener('click', onReset);
  els.modeButtons.forEach((button) => {
    button.addEventListener('click', () => onModeChange(button.dataset.modeButton));
  });
}

export function render(detail) {
  const { mode, state, remaining } = detail;
  const time = formatTime(remaining);

  els.body.dataset.mode = mode;
  els.body.dataset.state = state;

  els.timeDisplay.textContent = time;
  els.timeDisplay.setAttribute('datetime', `PT${Math.ceil(remaining / 1000)}S`);

  const duration = DURATIONS[mode];
  const elapsedPercent = ((duration - remaining) / duration) * 100;
  els.progressBar.style.width = `${elapsedPercent}%`;

  const [toggleLabel, toggleAriaLabel] = TOGGLE_LABELS[state];
  els.toggleButton.textContent = toggleLabel;
  els.toggleButton.setAttribute('aria-label', toggleAriaLabel);
  els.resetButton.disabled = state === 'idle';

  els.modeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.modeButton === mode));
  });

  document.title =
    state === 'running' || state === 'paused'
      ? `${time} · ${LABELS[mode]}`
      : 'Pomodoro';
}
