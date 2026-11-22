"use client";

import { useSyncExternalStore } from "react";
import type { AudienceId } from "@/data/audiences";

export interface GameState {
  audience: AudienceId | null;
  xp: number;
  hearts: number;
  heartsDay: string;
  streak: number;
  lastDay: string;
  answered: Record<string, boolean>;
  muted: boolean;
}

const KEY = "health-court-v1";
const MAX_HEARTS = 5;

const today = () => new Date().toLocaleDateString("sv-SE");
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("sv-SE");
};

const DEFAULT: GameState = {
  audience: null,
  xp: 0,
  hearts: MAX_HEARTS,
  heartsDay: "",
  streak: 0,
  lastDay: "",
  answered: {},
  muted: false,
};

let state: GameState = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT, ...JSON.parse(raw) };
  } catch {}
  if (state.heartsDay !== today()) state = { ...state, hearts: MAX_HEARTS, heartsDay: today() };
}

function set(next: Partial<GameState>) {
  state = { ...state, ...next };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useGame() {
  const s = useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => DEFAULT,
  );
  return s;
}

export const game = {
  maxHearts: MAX_HEARTS,
  setAudience(audience: AudienceId | null) {
    set({ audience });
  },
  toggleMute() {
    set({ muted: !state.muted });
  },
  answer(slug: string, correct: boolean) {
    const d = today();
    let streak = state.streak;
    if (state.lastDay !== d) streak = state.lastDay === yesterday() ? streak + 1 : 1;
    set({
      xp: state.xp + (correct ? 10 : 2),
      hearts: correct ? state.hearts : Math.max(0, state.hearts - 1),
      answered: { ...state.answered, [slug]: correct },
      streak,
      lastDay: d,
    });
  },
  refillHearts() {
    set({ hearts: MAX_HEARTS });
  },
  get() {
    load();
    return state;
  },
};
