"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState, useReducedMotionFlag } from "@/hooks/useScrollStore";
import { cn } from "@/lib/utils";

/**
 * Infinite marquee. Speed follows scroll velocity and direction flips with
 * scroll direction. Two copies of the track make the loop seamless.
 * Reduced motion: a slow, constant drift (no scroll-linked speed-up or skew)
 * instead of freezing — a static row looks broken. Hover pauses it.
 */
export function Marquee({ items, className, outlineEvery = 2 }: { items: string[]; className?: string; outlineEvery?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const reduced = useReducedMotionFlag();

  useGSAP(
    () => {
      const el = track.current!;
      let x = 0;
      let dir = -1;
      const tick = (_t: number, dt: number) => {
        const half = el.scrollWidth / 2;
        if (!half || paused.current) return;
        let speed = 0.025; // px per ms in reduced mode
        let skew = 0;
        if (!reduced) {
          dir = scrollState.direction === 1 ? -1 : 1;
          speed = 0.07 + Math.min(1.6, Math.abs(scrollState.velocity) * 0.04);
          skew = gsap.utils.clamp(-8, 8, -scrollState.velocity * 0.25);
        }
        x += dir * speed * Math.min(dt, 64);
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        gsap.set(el, { x, skewX: skew });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  const row = (copy: number) =>
    items.map((it, i) => (
      <span key={`${copy}-${i}`} className="flex items-center gap-[0.5em] pr-[0.5em]">
        <span className={cn(i % outlineEvery === 1 && "t-outline")}>{it}</span>
        <span className="text-primary">✦</span>
      </span>
    ));

  return (
    <div
      ref={root}
      className={cn("relative overflow-hidden py-6", className)}
      aria-label={items.join(", ")}
      role="marquee"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform" aria-hidden>
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
