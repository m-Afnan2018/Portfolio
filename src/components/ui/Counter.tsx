"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollState, useReducedMotionFlag } from "@/hooks/useScrollStore";
import type { Achievement } from "@/data/profile";
import { playSound } from "@/lib/sound";

const BAR = 20;

/** A counter that fills like a terminal progress bar: [██████░░░░] 500+ */
export function Counter({ item, index, onDone }: { item: Achievement; index: number; onDone?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionFlag();
  const [animValue, setValue] = useState(0);
  const [animFill, setFill] = useState(0);
  const [animDone, setDone] = useState(false);
  const value = reduced ? item.value : animValue;
  const fill = reduced ? item.fill : animFill;
  const done = reduced || animDone;

  useGSAP(
    () => {
      if (reduced) return;
      const o = { v: 0 };
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(o, {
            v: 1,
            duration: 2.2,
            delay: index * 0.15,
            ease: "power3.out",
            onUpdate: () => {
              setValue(Math.round(item.value * o.v));
              setFill(item.fill * o.v);
            },
            onComplete: () => {
              setDone(true);
              scrollState.burst = Math.min(1, scrollState.burst + 0.45);
              playSound("tick");
              onDone?.();
            },
          }),
      });
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  const blocks = Math.round(fill * BAR);
  return (
    <div ref={ref} className="group border-t border-line py-6 font-mono">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="t-h3 font-display tabular-nums text-text">
          {value.toLocaleString("en-IN")}
          <span className="text-primary">{item.suffix}</span>
        </span>
        <span className="text-sm text-muted">{item.label}</span>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm" aria-hidden>
        <span className="text-faint">[</span>
        <span className="tracking-[-0.05em] text-accent">
          {"█".repeat(blocks)}
          <span className="text-line-strong">{"░".repeat(BAR - blocks)}</span>
        </span>
        <span className="text-faint">]</span>
        <span className={done ? "text-accent" : "text-warn"}>{done ? "✓ done" : `${Math.round((fill / (item.fill || 1)) * 100)}%`}</span>
      </div>
      <p className="mt-2 text-xs text-faint">{item.detail}</p>
    </div>
  );
}
