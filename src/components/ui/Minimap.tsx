"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sections } from "@/data/sections";
import { scrollState, useScrollStore } from "@/hooks/useScrollStore";
import { scrollToId } from "@/hooks/useLenis";
import { cn } from "@/lib/utils";

/** Deterministic "code line" widths for each minimap block. */
const lines = (seed: number, n: number) =>
  Array.from({ length: n }, (_, i) => Math.round(25 + ((Math.sin(seed * 13.7 + i * 7.3) + 1) / 2) * 70));

/** Scroll progress as a VS Code minimap: proportional blocks + a viewport slider. */
export function Minimap() {
  const active = useScrollStore((s) => s.activeSection);
  const [heights, setHeights] = useState<number[]>(sections.map(() => 1));
  const slider = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [vp, setVp] = useState(0.1);

  useEffect(() => {
    const measure = () => {
      const total = document.documentElement.scrollHeight;
      setHeights(sections.map((s) => (document.getElementById(s.id)?.offsetHeight ?? 1) / total));
      setVp(window.innerHeight / total);
    };
    ScrollTrigger.addEventListener("refresh", measure);
    measure();
    const tick = () => {
      const h = track.current?.clientHeight ?? 0;
      if (slider.current) slider.current.style.transform = `translateY(${scrollState.progress * (1 - vp) * h}px)`;
    };
    gsap.ticker.add(tick);
    return () => {
      ScrollTrigger.removeEventListener("refresh", measure);
      gsap.ticker.remove(tick);
    };
  }, [vp]);

  const sum = heights.reduce((a, b) => a + b, 0) || 1;
  return (
    <nav
      aria-label="Page minimap"
      className="fixed bottom-[42px] right-3 top-[60px] z-40 hidden w-14 flex-col xl:flex"
    >
      <div ref={track} className="relative flex h-full flex-col gap-[3px]">
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToId(s.id)}
            aria-label={`Jump to ${s.label}`}
            title={s.file}
            data-cursor={s.file}
            className={cn(
              "group relative flex min-h-[14px] flex-col gap-[2px] overflow-hidden rounded-[2px] px-1 py-1 transition-colors duration-500",
              active === s.id ? "bg-primary/10" : "hover:bg-white/5",
            )}
            style={{ flexGrow: heights[i] / sum, flexBasis: 0 }}
          >
            {lines(i + 1, 14).map((w, j) => (
              <span
                key={j}
                className={cn(
                  "block h-[2px] shrink-0 rounded-full transition-colors duration-500",
                  active === s.id ? (j % 4 === 0 ? "bg-primary/80" : "bg-text/50") : "bg-faint/30",
                )}
                style={{ width: `${w}%`, marginLeft: `${(j % 3) * 8}%` }}
              />
            ))}
          </button>
        ))}
        <div className="pointer-events-none absolute inset-0">
          <div
            ref={slider}
            className="absolute inset-x-0 top-0 rounded-[2px] border border-primary/30 bg-primary/10"
            style={{ height: `${vp * 100}%` }}
          />
        </div>
      </div>
    </nav>
  );
}
