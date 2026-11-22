"use client";

import { game } from "./game";

let ctx: AudioContext | null = null;

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.18) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime + start);
  g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur + 0.05);
}

function ready() {
  if (typeof window === "undefined" || game.get().muted) return false;
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return true;
}

export const sfx = {
  correct() {
    if (!ready()) return;
    tone(660, 0, 0.12, "triangle");
    tone(880, 0.1, 0.12, "triangle");
    tone(1320, 0.2, 0.22, "triangle");
  },
  wrong() {
    if (!ready()) return;
    tone(220, 0, 0.18, "square", 0.08);
    tone(165, 0.15, 0.28, "square", 0.08);
  },
  stamp() {
    if (!ready()) return;
    tone(120, 0, 0.12, "sine", 0.35);
  },
  tap() {
    if (!ready()) return;
    tone(520, 0, 0.05, "triangle", 0.08);
  },
  win() {
    if (!ready()) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25, "triangle"));
  },
};
