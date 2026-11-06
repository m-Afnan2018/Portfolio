"use client";

import { useEffect, useRef } from "react";
import { useScrollStore } from "@/hooks/useScrollStore";

/** Brief digital-rain overlay (terminal `matrix` command / Konami code). */
export function MatrixRain() {
  const on = useScrollStore((s) => s.matrix);
  const set = useScrollStore((s) => s.set);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!on) return;
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const size = 16;
    const cols = Math.ceil(c.width / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const glyphs = "アイウエオカキクケコサシスセソ0123456789{}<>/=;afnan";
    let raf = 0;
    const start = performance.now();
    const draw = () => {
      ctx.fillStyle = "rgba(5,7,13,0.12)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.font = `${size}px ui-monospace, monospace`;
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > 0.96 ? "#e5e7eb" : "#22c55e";
        ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * size, y * size);
        drops[i] = y * size > c.height && Math.random() > 0.97 ? 0 : y + 1;
      });
      if (performance.now() - start < 4200) raf = requestAnimationFrame(draw);
      else set({ matrix: false });
    };
    raf = requestAnimationFrame(draw);
    const stop = () => set({ matrix: false });
    window.addEventListener("keydown", stop, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", stop);
    };
  }, [on, set]);

  if (!on) return null;
  return <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[95]" />;
}
