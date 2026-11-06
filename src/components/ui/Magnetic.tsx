"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotionFlag } from "@/hooks/useScrollStore";

/**
 * Pulls its child toward the cursor within `radius` px and springs back.
 * The inner [data-magnetic-inner] layer moves at a different rate for depth.
 */
export function Magnetic({ children, strength = 0.35, radius = 80, className }: { children: ReactNode; strength?: number; radius?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionFlag();

  useGSAP(
    () => {
      const el = ref.current!;
      if (reduced || window.matchMedia("(pointer: coarse)").matches) return;
      const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" }) : null;
      const iyTo = inner ? gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3.out" }) : null;

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const reach = Math.max(r.width, r.height) / 2 + radius;
        if (Math.hypot(dx, dy) < reach) {
          xTo(dx * strength);
          yTo(dy * strength);
          ixTo?.(dx * strength * 0.5);
          iyTo?.(dy * strength * 0.5);
        } else {
          xTo(0);
          yTo(0);
          ixTo?.(0);
          iyTo?.(0);
        }
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className ?? "inline-block"}>
      {children}
    </div>
  );
}
