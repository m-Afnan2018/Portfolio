"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useReducedMotionFlag } from "@/hooks/useScrollStore";
import { cn } from "@/lib/utils";

/**
 * 3D tilt toward the cursor + a glowing border that follows it.
 * Children render inside a preserve-3d layer so they can flip.
 */
export function TiltCard({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionFlag();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 220, damping: 22 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, color-mix(in srgb, var(--primary) 55%, transparent), transparent 45%)`;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className={cn("group/tilt relative rounded-[8px]", className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[9px] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
        style={{ background: glow }}
      />
      <div className="relative h-full rounded-[8px] [transform-style:preserve-3d]">{children}</div>
    </motion.div>
  );
}
