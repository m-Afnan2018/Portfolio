"use client";

import { flushSync } from "react-dom";
import { isReducedNow, useScrollStore, type Theme } from "@/hooks/useScrollStore";
import { playSound } from "./sound";

function apply(next: Theme) {
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
  useScrollStore.getState().set({ theme: next });
}

/**
 * Switch theme with a circular clip-path reveal that grows from the toggle
 * (View Transitions API). Falls back to an instant switch.
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = useScrollStore.getState().theme === "dark" ? "light" : "dark";
  playSound("whoosh");
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || isReducedNow()) return apply(next);
  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? window.innerHeight - 14;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const vt = doc.startViewTransition(() => flushSync(() => apply(next)));
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 1100, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}
