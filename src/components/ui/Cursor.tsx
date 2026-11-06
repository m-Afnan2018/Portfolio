"use client";

/**
 * Custom cursor: a crosshair dot + a lagging ring (mix-blend-mode:
 * difference). Over interactive elements the ring grows and shows a
 * contextual label — `<a/>`, `onClick()`, or a data-cursor value such as
 * "view", "drag", "open", "copy". Disabled on touch devices.
 */
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { scrollState, useReducedMotionFlag } from "@/hooks/useScrollStore";

function labelFor(el: Element | null): string | null {
  if (!el) return null;
  const custom = el.closest<HTMLElement>("[data-cursor]");
  if (custom?.dataset.cursor) return custom.dataset.cursor;
  if (el.closest("a")) return "<a/>";
  if (el.closest("button,[role='button'],summary,label")) return "onClick()";
  if (el.closest("input,textarea")) return "stdin";
  return null;
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [moved, setMoved] = useState(false);
  const reduced = useReducedMotionFlag();

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(fine.matches);
    update();
    fine.addEventListener("change", update);

    // pointer is also published for the 3D scene, on every device
    const onMove = (e: PointerEvent) => {
      scrollState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      fine.removeEventListener("change", update);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.customCursor = "on";
    const lag = reduced ? 0.01 : 0.45;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: lag, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: lag, ease: "power3.out" });
    let last: string | null = null;

    const onMove = (e: PointerEvent) => {
      setMoved(true);
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const hover3d = document.documentElement.dataset.hover3d ?? null;
      const dragging = document.documentElement.dataset.dragging ? "drag" : null;
      const l = dragging ?? labelFor(e.target as Element) ?? hover3d;
      if (l !== last) {
        last = l;
        setLabel(l);
      }
    };
    const onLeave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
    const onDown = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.5)" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      delete document.documentElement.dataset.customCursor;
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, reduced]);

  if (!enabled) return null;
  const big = label !== null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] mix-blend-difference" style={{ opacity: moved ? 1 : 0 }}>
      <div ref={dot} className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-3 w-3">
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-white" />
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white" />
        </div>
      </div>
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white transition-[width,height,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: big ? 76 : 34, height: big ? 76 : 34, backgroundColor: big ? "rgba(255,255,255,1)" : "transparent" }}
        >
          <span
            className="font-mono text-[10px] tracking-[0.08em] text-black transition-opacity duration-300"
            style={{ opacity: big ? 1 : 0 }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
