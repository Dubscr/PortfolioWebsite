/* Tiny synthesized sound effects. They only ever play in response to a click
   on something game-like, and the header toggle mutes them. */

const MUTE_KEY = "dubscr-sfx-muted";

let ctx: AudioContext | null = null;
let muted = readMuted();

function readMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export const isMuted = () => muted;

export function setMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  } catch {
    /* Private mode: the setting just won't persist. */
  }
}

function tone(freq: number, at: number, length: number, type: OscillatorType, volume: number, slideTo?: number) {
  if (muted) return;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  const start = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + length);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + length);
}

export const sfx = {
  caught() {
    [523, 659, 784, 1047].forEach((freq, i) => tone(freq, i * 0.07, 0.14, "square", 0.04));
  },
  fanfare() {
    [392, 523, 659, 784, 659, 784, 1047].forEach((freq, i) => tone(freq, i * 0.11, 0.2, "square", 0.05));
  },
  sting() {
    tone(196, 0, 0.5, "sawtooth", 0.05, 92);
    tone(207, 0, 0.5, "sawtooth", 0.05, 98);
  },
  click() {
    tone(1500, 0, 0.04, "square", 0.04);
    tone(180, 0.03, 0.06, "square", 0.05);
  },
  clunk() {
    tone(140, 0, 0.09, "square", 0.07, 70);
    tone(90, 0.1, 0.1, "square", 0.07, 50);
  },
};
