import { DURATIONS } from './config.js';

const TICK_MS = 250;

export default class Timer extends EventTarget {
  #mode;
  #state;
  #remaining;
  #endAt;
  #intervalId;

  constructor() {
    super();
    this.#mode = 'work';
    this.#state = 'idle';
    this.#remaining = DURATIONS[this.#mode];
    this.#endAt = 0;
    this.#intervalId = null;
  }

  get mode() {
    return this.#mode;
  }

  get state() {
    return this.#state;
  }

  get remaining() {
    if (this.#state === 'running') {
      return Math.max(0, this.#endAt - Date.now());
    }
    return this.#remaining;
  }

  start() {
    if (this.#state === 'running') return;
    this.#state = 'running';
    this.#endAt = Date.now() + this.#remaining;
    this.#startInterval();
    this.#dispatch('tick');
  }

  pause() {
    if (this.#state !== 'running') return;
    this.#stopInterval();
    this.#remaining = Math.max(0, this.#endAt - Date.now());
    this.#state = 'paused';
    this.#dispatch('tick');
  }

  toggle() {
    if (this.#state === 'running') {
      this.pause();
    } else {
      this.start();
    }
  }

  reset() {
    this.#stopInterval();
    this.#state = 'idle';
    this.#remaining = DURATIONS[this.#mode];
    this.#dispatch('tick');
  }

  setMode(mode) {
    if (!Object.hasOwn(DURATIONS, mode)) return;
    this.#stopInterval();
    this.#mode = mode;
    this.#state = 'idle';
    this.#remaining = DURATIONS[mode];
    this.#dispatch('tick');
  }

  #startInterval() {
    this.#intervalId = setInterval(() => this.#onTick(), TICK_MS);
  }

  #stopInterval() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  #onTick() {
    const remaining = this.remaining;
    if (remaining <= 0) {
      this.#stopInterval();
      this.#remaining = 0;
      this.#state = 'finished';
      this.#dispatch('complete');
    }
    this.#dispatch('tick');
  }

  #dispatch(type) {
    this.dispatchEvent(
      new CustomEvent(type, {
        detail: {
          mode: this.#mode,
          state: this.#state,
          remaining: this.remaining,
        },
      })
    );
  }
}
