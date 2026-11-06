"use client";

import { useEffect } from "react";

/**
 * Pause every CSS animation inside sections that are off-screen.
 *
 * The pages are full of small looping details (live dots, pulses, ticking
 * dashboards). Each loop keeps the browser repainting even when nobody can
 * see it — on a phone that adds up to seconds of blocked main thread. Marking
 * far-away sections [data-offscreen] pauses them (see globals.css); they
 * resume a little before they scroll into view, so nobody sees a frozen frame.
 */
export function usePauseOffscreen(selector: string) {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(selector)];
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) delete el.dataset.offscreen;
          else el.dataset.offscreen = "";
        }
      },
      { rootMargin: "300px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      els.forEach((el) => delete el.dataset.offscreen);
    };
  }, [selector]);
}
