"use client";

import { useEffect } from "react";
import { useScrollStore, useReducedMotionFlag, type MotionPref } from "./useScrollStore";

/**
 * Tracks the OS `prefers-reduced-motion` setting and the user's own toggle
 * (persisted in localStorage). Returns the effective flag.
 */
export function useReducedMotionSync() {
  const set = useScrollStore((s) => s.set);
  const reduced = useReducedMotionFlag();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stored = localStorage.getItem("motion") as MotionPref | null;
    set({ systemReduced: mq.matches, ...(stored ? { motionPref: stored } : {}) });
    const onChange = () => set({ systemReduced: mq.matches });
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [set]);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  return reduced;
}

export { useReducedMotionFlag as useReducedMotion };
