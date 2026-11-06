"use client";

/**
 * LostScene — the 404, shared by every version. "Lost in the dark": a huge
 * outlined 404 that a torch (your cursor — or, untouched, a wandering light)
 * fills with the brand gradient, and three doors back in, one per version,
 * each leaving through the shared hand-off frame.
 */
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { BrandMark } from "./BrandMark";
import { MiniClient, MiniDev, MiniHr } from "@/components/hr/HrVersionSwitch";
import { handoffTo } from "@/lib/handoff";
import { setPersona, type Persona } from "@/lib/persona";
import { profile } from "@/data/profile";

const DOORS: { id: Persona; href: string; title: string; who: string; mini: React.ReactNode }[] = [
  { id: "dev", href: "/", title: "Developer", who: "The full portfolio", mini: MiniDev },
  { id: "hr", href: "/hr", title: "Recruiter", who: "A one-page brief", mini: MiniHr },
  {
    id: "client",
    href: "/work-with-me",
    title: "Client",
    who: "Hire me for a project",
    mini: MiniClient,
  },
];

export function LostScene() {
  const router = useRouter();
  const path = usePathname();
  const stage = useRef<HTMLDivElement>(null); // the 404 itself — torch coords are relative to it

  // the torch: follows the pointer; wanders on its own until the pointer moves
  useEffect(() => {
    const el = stage.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let manual = false;
    let x = 0.5;
    let y = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    const t0 = performance.now();
    const loop = (t: number) => {
      if (!manual) {
        const s = (t - t0) / 1000;
        tx = 0.5 + Math.sin(s * 0.55) * 0.32;
        ty = 0.5 + Math.sin(s * 0.9 + 1) * 0.22;
      }
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--x", `${x * 100}%`);
      el.style.setProperty("--y", `${y * 100}%`);
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      manual = true;
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
    };
    if (!reduce) raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  const go = (d: (typeof DOORS)[number]) => {
    setPersona(d.id);
    router.prefetch(d.href);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return router.push(d.href);
    handoffTo(d.id);
    setTimeout(() => router.push(d.href), 450);
  };

  return (
    <main className="lost relative flex min-h-[100svh] flex-col overflow-hidden bg-[#05070d] text-[#e5e7eb]">
      <div aria-hidden className="lost-glow" />
      <div aria-hidden className="grain" />

      <header className="relative z-10 flex items-center justify-between px-[5vw] py-6">
        <button
          type="button"
          onClick={() => go(DOORS[0])}
          className="group flex items-center gap-3 text-[14px]"
        >
          <BrandMark size={34} draw />
          <span className="font-semibold">{profile.name}</span>
        </button>
        <span className="font-mono text-[12px] tracking-[0.16em] text-[#94a3b8] uppercase">
          Error 404
        </span>
      </header>

      <div className="lost-stage relative z-[1] flex flex-1 flex-col items-center justify-center px-[5vw] text-center">
        <h1 className="sr-only">Page not found</h1>
        <div ref={stage} aria-hidden className="relative select-none">
          <span className="lost-num lost-num-outline">404</span>
          <span className="lost-num lost-num-lit absolute inset-0">404</span>
        </div>
        <p className="lost-in font-display mt-2 text-[clamp(1.5rem,3vw,2.6rem)] font-semibold tracking-[-0.03em]">
          This page took a wrong turn.
        </p>
        <p className="lost-in mt-3 max-w-md text-[15px] text-[#94a3b8] [animation-delay:0.15s]">
          The link may be old or mistyped. Pick a way back in:
        </p>

        <ul className="lost-in mt-10 grid w-full max-w-3xl gap-4 [animation-delay:0.3s] sm:grid-cols-3">
          {DOORS.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => go(d)}
                data-cursor="open"
                className="lost-door group block w-full rounded-[16px] border border-white/10 bg-white/[0.03] p-3 text-left backdrop-blur-sm"
              >
                <span className="block aspect-[16/10] overflow-hidden rounded-[10px] border border-white/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
                  {d.mini}
                </span>
                <span className="mt-3 flex items-center justify-between px-1">
                  <span>
                    <span className="block text-[15px] font-semibold">{d.title}</span>
                    <span className="block text-[12px] text-[#94a3b8]">{d.who}</span>
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:-rotate-45 group-hover:border-transparent group-hover:bg-[#2563eb]">
                    →
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-[5vw] py-6 font-mono text-[12px] text-[#64748b]">
        <span className="truncate">
          <span className="text-[#f87171]">GET</span> {path}{" "}
          <span className="text-[#94a3b8]">→ 404 · not found</span>
        </span>
        <button type="button" onClick={() => router.back()} className="cs-link text-[#94a3b8]">
          ← Go back
        </button>
      </footer>
    </main>
  );
}
