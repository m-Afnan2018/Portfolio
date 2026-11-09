"use client";

/**
 * HrVersionSwitch — how the recruiter brief changes version, in its own
 * language: paper.
 *
 *  · "Other versions" opens a small stack of documents — a miniature of each
 *    version, side by side; hovering lifts a sheet, the current one is
 *    stamped "You're here"
 *  · picking one turns the page: the recruiter page itself flips up like a
 *    page in a binder (hinged at the top of the screen), revealing the next
 *    version's colour and name underneath, then navigates
 */
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { setPersona, type Persona } from "@/lib/persona";
import { usePersonaMark } from "@/hooks/usePersonaMark";
import { handoffTo } from "@/lib/handoff";

type Doc = {
  id: Persona;
  href: string;
  title: string;
  note: string;
  wipe: string;
  ink: string;
  mini: ReactNode;
};
const ease = [0.16, 1, 0.3, 1] as const;

/* miniature pages — just enough to recognise each version */
export const MiniDev = (
  <div className="flex h-full flex-col gap-1.5 bg-[#05070d] p-2.5">
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1 w-4 rounded-[1px] bg-white/15" />
      ))}
    </div>
    <span className="mt-2 h-3 w-[80%] rounded-[1px] bg-white/80" />
    <span className="h-3 w-[60%] rounded-[1px] border border-white/50" />
    <span className="mt-1 h-1 w-[70%] rounded-full bg-[#22d3ee]/70" />
    <span className="h-1 w-[50%] rounded-full bg-white/20" />
    <span className="mt-auto ml-auto h-8 w-8 rounded-full border border-[#22d3ee]/50 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
  </div>
);
export const MiniHr = (
  <div className="flex h-full flex-col gap-1.5 bg-[#fafafa] p-2.5">
    <span className="h-2 w-[45%] rounded-[1px] bg-[#15171c]" />
    <span className="h-1 w-[70%] rounded-full bg-[#15171c]/25" />
    <div className="mt-1.5 grid grid-cols-[1fr_2fr] gap-1.5">
      <span className="h-12 rounded-[2px] border border-[#e6e6e6] bg-white" />
      <div className="space-y-1">
        {[85, 70, 90, 60, 75].map((w, i) => (
          <span
            key={i}
            className="block h-1 rounded-full bg-[#15171c]/20"
            style={{ width: `${w}%` }}
          />
        ))}
        <span className="block h-1 w-[40%] rounded-full bg-[#2563eb]/70" />
      </div>
    </div>
  </div>
);
export const MiniClient = (
  <div className="flex h-full flex-col bg-white">
    <div className="flex h-[55%] flex-col justify-end gap-1 bg-gradient-to-br from-[#0b1120] via-[#1e3a8a] to-[#2563eb] p-2.5">
      <span className="h-2 w-[70%] rounded-[1px] bg-white/90" />
      <span className="h-2 w-[45%] rounded-[1px] bg-[#38bdf8]" />
      <span className="mt-1 h-2 w-8 rounded-full bg-[#2563eb] ring-1 ring-white/40" />
    </div>
    <div className="grid flex-1 grid-cols-3 gap-1 p-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="rounded-[2px] bg-[#e8f0fe]" />
      ))}
    </div>
  </div>
);

const DOCS: Doc[] = [
  {
    id: "dev",
    href: "/",
    title: "Full portfolio",
    note: "The developer site — code, infrastructure, 3D",
    wipe: "#05070d",
    ink: "#e5e7eb",
    mini: MiniDev,
  },
  {
    id: "hr",
    href: "/hr",
    title: "Recruiter brief",
    note: "This one-page summary",
    wipe: "#ffffff",
    ink: "#15171c",
    mini: MiniHr,
  },
  {
    id: "client",
    href: "/work-with-me",
    title: "Hire for a project",
    note: "Services, pricing and a project brief",
    wipe: "#2563eb",
    ink: "#ffffff",
    mini: MiniClient,
  },
];

export function HrVersionSwitch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [going, setGoing] = useState<Doc | null>(null);
  const root = useRef<HTMLDivElement>(null);
  usePersonaMark("hr");

  useEffect(() => {
    DOCS.forEach((d) => d.id !== "hr" && router.prefetch(d.href));
  }, [router]);

  // close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const go = (d: Doc) => {
    setOpen(false);
    if (d.id === "hr") return;
    setPersona(d.id);
    router.prefetch(d.href);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(d.href);
      return;
    }
    setGoing(d);
    const page = root.current?.closest<HTMLElement>(".hr-root");
    if (page) {
      const y = `${window.scrollY}px`;
      const body = document.body.style;
      body.setProperty("perspective", "2200px");
      body.setProperty("perspective-origin", `50% ${y}`);
      Object.assign(page.style, {
        position: "relative",
        zIndex: "2",
        transformOrigin: `50% ${y}`,
        backfaceVisibility: "hidden",
        willChange: "transform",
      });
      page.animate(
        // transform only: filter / box-shadow on the whole page repaint every frame
        [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-100deg)" }],
        { duration: 1000, delay: 80, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" },
      );
    }
    setTimeout(() => {
      handoffTo(d.id);
      router.push(d.href);
    }, 1350);
  };

  // leaving this page: undo the perspective set on <body>
  useEffect(
    () => () => {
      document.body.style.removeProperty("perspective");
      document.body.style.removeProperty("perspective-origin");
    },
    [],
  );

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="group flex h-8 items-center gap-2 rounded-full border border-[var(--hr-rule-strong)] px-3 text-[13px] text-[var(--hr-ink-2)] transition-colors hover:border-[var(--hr-ink)] hover:text-[var(--hr-ink)]"
      >
        <span className="relative h-3.5 w-3 shrink-0" aria-hidden>
          <span className="absolute inset-0 translate-x-[3px] -translate-y-[2px] rounded-[1.5px] border border-current opacity-40 transition-transform group-hover:translate-x-[4px] group-hover:-translate-y-[3px]" />
          <span className="absolute inset-0 rounded-[1.5px] border border-current bg-[var(--hr-paper)]" />
        </span>
        <span className="hidden sm:inline">Other versions</span>
        <span className="sm:hidden">Versions</span>
      </button>

      {/* ── the stack of documents ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Other versions of this site"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease }}
            className="absolute top-[calc(100%+10px)] right-0 z-50 w-[min(460px,calc(100vw-2rem))] rounded-[18px] border border-[var(--hr-rule)] bg-[var(--hr-card)] p-4 shadow-[0_30px_70px_-30px_rgba(21,23,28,0.45)]"
          >
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--hr-muted)] uppercase">
              This site comes in three editions
            </p>
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {DOCS.map((d, i) => {
                const here = d.id === "hr";
                return (
                  <motion.li
                    key={d.id}
                    initial={{ opacity: 0, y: 14, rotate: (i - 1) * 5 }}
                    animate={{ opacity: 1, y: 0, rotate: (i - 1) * 2 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.45, ease }}
                  >
                    <button
                      type="button"
                      onClick={() => go(d)}
                      aria-current={here ? "page" : undefined}
                      className="group block w-full text-left"
                    >
                      <span className="relative block aspect-[3/4] overflow-hidden rounded-[6px] border border-[var(--hr-rule-strong)] shadow-[0_8px_18px_-10px_rgba(21,23,28,0.45)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:shadow-[0_22px_40px_-16px_rgba(21,23,28,0.5)]">
                        {d.mini}
                        {here && (
                          <span className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 -rotate-12 rounded-[4px] border-2 border-[var(--hr-accent)] bg-[var(--hr-card)]/85 py-0.5 text-center text-[10px] font-bold tracking-[0.1em] text-[var(--hr-accent)] uppercase">
                            You&apos;re here
                          </span>
                        )}
                      </span>
                      <span
                        className={`mt-2.5 block text-[13px] leading-tight font-semibold ${here ? "text-[var(--hr-muted)]" : "group-hover:text-[var(--hr-accent)]"}`}
                      >
                        {d.title} {!here && <span aria-hidden>→</span>}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-[var(--hr-muted)]">
                        {d.note}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── under the turning page: the next version (outside the header, so it fills the screen) ── */}
      {going &&
        createPortal(
          <div className="fixed inset-0 z-[1]" style={{ background: going.wipe }} />,
          document.body,
        )}
    </div>
  );
}
