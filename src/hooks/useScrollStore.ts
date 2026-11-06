"use client";

import { create } from "zustand";

/**
 * Two layers of state:
 *  - `scrollState`: a plain mutable object written every frame (scroll
 *    progress, velocity, the Core's scene index). Read it inside useFrame /
 *    rAF loops — it never triggers React renders.
 *  - `useScrollStore`: a Zustand store for values React actually renders
 *    (active section, theme, overlays…).
 */
export const scrollState = {
  /** 0–1 progress through the whole page */
  progress: 0,
  /** current scroll offset in px */
  y: 0,
  /** smoothed scroll velocity (px / frame, signed) */
  velocity: 0,
  /** 1 = scrolling down, -1 = up */
  direction: 1 as 1 | -1,
  /** continuous scene index for the Core (1 = hero … 8 = contact) */
  scene: 1,
  /** per-section local progress 0–1 (keyed by section id) */
  local: {} as Record<string, number>,
  /** pointer in normalised device coords (-1…1) */
  pointer: { x: 0, y: 0 },
  /** 0→1 when the boot loader hands off to the hero */
  intro: 0,
  /** decaying impulse: particles burst outward when counters finish */
  burst: 0,
  /** decaying impulse: antenna signal when the contact form sends */
  pulse: 0,
  /** accumulated drag rotation for the skill sphere */
  drag: { x: 0, y: 0, vx: 0, vy: 0 },
};

export type Theme = "dark" | "light";
export type MotionPref = "system" | "reduce" | "full";

interface UIState {
  activeSection: string;
  loaderDone: boolean;
  theme: Theme;
  sound: boolean;
  motionPref: MotionPref;
  systemReduced: boolean;
  gpuTier: "high" | "low" | "unknown";
  isMobile: boolean;
  paletteOpen: boolean;
  terminalOpen: boolean;
  /** the version switcher ("git branch" quick pick) */
  branchOpen: boolean;
  /** set to a version to play the "git checkout" transition and go there */
  checkout: "hr" | "client" | null;
  mobileNavOpen: boolean;
  modalSlug: string | null;
  /** which card opened the modal — keeps shared-layout ids unique */
  modalOrigin: string;
  hoveredSkill: string | null;
  matrix: boolean;
  toast: string | null;
  set: (patch: Partial<Omit<UIState, "set">>) => void;
}

export const useScrollStore = create<UIState>((set) => ({
  activeSection: "home",
  loaderDone: false,
  theme: "dark",
  sound: false,
  motionPref: "system",
  systemReduced: false,
  gpuTier: "unknown",
  isMobile: false,
  paletteOpen: false,
  terminalOpen: false,
  branchOpen: false,
  checkout: null,
  mobileNavOpen: false,
  modalSlug: null,
  modalOrigin: "none",
  hoveredSkill: null,
  matrix: false,
  toast: null,
  set: (patch) => set(patch),
}));

/** Effective reduced-motion flag: user toggle wins over the OS setting. */
export function useReducedMotionFlag() {
  return useScrollStore((s) =>
    s.motionPref === "reduce" ? true : s.motionPref === "full" ? false : s.systemReduced,
  );
}

export function isReducedNow() {
  const s = useScrollStore.getState();
  return s.motionPref === "reduce" ? true : s.motionPref === "full" ? false : s.systemReduced;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(message: string) {
  useScrollStore.getState().set({ toast: message });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => useScrollStore.getState().set({ toast: null }), 2600);
}
