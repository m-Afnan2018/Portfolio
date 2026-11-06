"use client";

import { useEffect } from "react";
import { useScrollStore } from "./useScrollStore";

/**
 * Detects GPU capability with detect-gpu (benchmarks are self-hosted in
 * /public/detect-gpu so no third-party CDN is hit). Low tier, mobile, or
 * save-data → "low": fewer particles, no post-processing.
 */
export function useGpuTier() {
  const set = useScrollStore((s) => s.set);

  useEffect(() => {
    let cancelled = false;
    const mobileMq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const updateMobile = () => set({ isMobile: mobileMq.matches });
    updateMobile();
    mobileMq.addEventListener("change", updateMobile);

    (async () => {
      try {
        const { getGPUTier } = await import("detect-gpu");
        const res = await getGPUTier({ benchmarksURL: "/detect-gpu" });
        const saveData =
          (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
        const low = res.tier < 2 || res.isMobile === true || saveData || mobileMq.matches;
        if (!cancelled) set({ gpuTier: low ? "low" : "high" });
      } catch {
        if (!cancelled) set({ gpuTier: mobileMq.matches ? "low" : "high" });
      }
    })();

    return () => {
      cancelled = true;
      mobileMq.removeEventListener("change", updateMobile);
    };
  }, [set]);
}
