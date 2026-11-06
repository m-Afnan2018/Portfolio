"use client";

/**
 * ClientVersionSwitch — how /work-with-me changes version, in its own
 * language: a bold, agency-style full-screen menu.
 *
 *  · "Viewing as Client" pill opens a navy menu that slides down from the top
 *  · three huge rows (Client · Recruiter · Developer); hovering one slides it,
 *    fills its arrow and shows a miniature of that version following the cursor
 *  · picking one: a circle of the next version's colour grows from the click
 *    until it fills the screen, with its name, then the page changes
 * Rendered into .cl-root (not the header — its backdrop blur would trap
 * fixed layers) so it keeps the page's fonts and colours.
 */
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { setPersona, type Persona } from "@/lib/persona";
import { usePersonaMark } from "@/hooks/usePersonaMark";
import { handoffTo } from "@/lib/handoff";
import { MiniClient, MiniDev, MiniHr } from "@/components/hr/HrVersionSwitch";

const ease = [0.16, 1, 0.3, 1] as const;

type Row = {
  id: Persona;
  href: string;
  title: string;
  land: string;
  who: string;
  note: string;
  color: string;
  ink: string;
  mini: ReactNode;
};
const ROWS: Row[] = [
  {
    id: "client",
    href: "/work-with-me",
    title: "Client",
    land: "Work with me",
    who: "Hiring for a project",
    note: "services, pricing and a project brief",
    color: "#2563eb",
    ink: "#fff",
    mini: MiniClient,
  },
  {
    id: "hr",
    href: "/hr",
    title: "Recruiter",
    land: "Recruiter brief",
    who: "Hiring for a role",
    note: "a one-page brief: experience, skills, résumé",
    color: "#ffffff",
    ink: "#15171c",
    mini: MiniHr,
  },
  {
    id: "dev",
    href: "/",
    title: "Developer",
    land: "Developer portfolio",
    who: "Here for the code",
    note: "the full portfolio — code, infrastructure, 3D",
    color: "#05070d",
    ink: "#e5e7eb",
    mini: MiniDev,
  },
];

export function ClientVersionSwitch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [going, setGoing] = useState<{ row: Row; x: number; y: number } | null>(null);
  const [host, setHost] = useState<Element | null>(null);
  usePersonaMark("client");

  // the floating preview follows the cursor, a little behind
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 220, damping: 26 });
  const py = useSpring(my, { stiffness: 220, damping: 26 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHost(document.querySelector(".cl-root") ?? document.body);
  }, []);

  // while open: Esc closes, the page underneath doesn't scroll
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const html = document.documentElement.style;
    html.setProperty("overflow", "hidden");
    window.addEventListener("keydown", key);
    return () => {
      html.removeProperty("overflow");
      window.removeEventListener("keydown", key);
      setHover(null);
    };
  }, [open]);

  const go = (row: Row, e: MouseEvent) => {
    if (row.id === "client") {
      setOpen(false);
      return;
    }
    setPersona(row.id);
    router.prefetch(row.href);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(row.href);
      return;
    }
    setGoing({ row, x: e.clientX, y: e.clientY });
    setTimeout(() => {
      handoffTo(row.id);
      router.push(row.href);
    }, 1150);
  };

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        data-cursor="Switch"
        className="group flex h-11 shrink-0 items-center gap-2 rounded-full border border-current/25 px-4 text-sm font-medium transition-colors hover:border-current/60"
      >
        <span className="hidden opacity-70 lg:inline">Viewing as</span>
        <span>Client</span>
        <span
          aria-hidden
          className="flex h-5 w-5 items-center justify-center rounded-full bg-current/10 text-[11px] transition-transform duration-500 group-hover:rotate-180"
        >
          ⇄
        </span>
      </button>

      {host &&
        createPortal(
          <>
            {/* ── the menu ── */}
            <AnimatePresence>
              {open && (
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Choose your version of this site"
                  data-lenis-prevent
                  className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-[var(--cl-ink)] text-white"
                  initial={{ clipPath: "inset(0 0 100% 0)" }}
                  animate={{ clipPath: "inset(0 0 0% 0)" }}
                  exit={{ clipPath: "inset(0 0 100% 0)" }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                  onPointerMove={(e) => {
                    mx.set(e.clientX);
                    my.set(e.clientY);
                  }}
                >
                  <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div
                      className="cl-stage-bg absolute inset-0"
                      style={{ "--glow": "#2563eb" } as CSSProperties}
                    />
                    <div className="cl-hero-grid absolute inset-0 opacity-50" />
                    <div className="cl-grain" />
                  </div>

                  <div className="relative mx-auto flex w-full max-w-[1320px] items-center justify-between px-5 pt-6 sm:px-8">
                    <p className="text-[13px] font-semibold tracking-[0.16em] text-white/50 uppercase">
                      Choose your version
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      data-cursor="Close"
                      className="group flex h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-medium transition-colors hover:bg-white hover:text-[var(--cl-ink)]"
                    >
                      Close{" "}
                      <span className="transition-transform duration-500 group-hover:rotate-90">
                        ✕
                      </span>
                    </button>
                  </div>

                  <ul
                    className="relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-center px-5 py-10 sm:px-8"
                    onPointerLeave={() => setHover(null)}
                  >
                    {ROWS.map((r, i) => {
                      const here = r.id === "client";
                      const on = hover === i;
                      return (
                        <motion.li
                          key={r.id}
                          className="border-b border-white/10 first:border-t"
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 + i * 0.08, duration: 0.8, ease }}
                        >
                          <button
                            type="button"
                            onPointerEnter={() => setHover(i)}
                            onFocus={() => setHover(i)}
                            onClick={(e) => go(r, e)}
                            aria-current={here ? "page" : undefined}
                            data-cursor={here ? "Here" : "Open"}
                            className="relative flex w-full items-center gap-5 py-6 text-left sm:gap-10 sm:py-8"
                          >
                            <span className="w-8 font-mono text-[13px] text-white/40">
                              0{i + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className={`cl-display block text-[clamp(2.8rem,8.5vw,8rem)] leading-[0.9] tracking-[-0.05em] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                  on
                                    ? "translate-x-4 text-white"
                                    : hover !== null
                                      ? "text-white/30"
                                      : "text-white"
                                }`}
                              >
                                {r.title}
                                {here && (
                                  <span className="ml-4 align-middle font-sans text-[clamp(0.8rem,1.2vw,1rem)] font-semibold tracking-normal text-[#4ade80]">
                                    ● you&apos;re here
                                  </span>
                                )}
                              </span>
                              <span className="mt-2 block text-[15px] text-white/55">
                                {r.who} — {r.note}
                              </span>
                            </span>
                            <span
                              aria-hidden
                              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border text-xl transition-all duration-500 sm:h-20 sm:w-20 ${
                                on
                                  ? "-rotate-45 border-transparent bg-[var(--cl-accent)]"
                                  : "border-white/25"
                              }`}
                            >
                              →
                            </span>
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>

                  {/* preview that follows the cursor (fine pointers) */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none fixed top-0 left-0 z-10 hidden w-[190px] [@media(pointer:fine)]:block"
                    style={{ x: px, y: py, translateX: "28px", translateY: "-60%" }}
                    animate={{
                      opacity: hover === null ? 0 : 1,
                      scale: hover === null ? 0.7 : 1,
                      rotate: hover === null ? -8 : -4,
                    }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-[10px] border border-white/20 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
                      {hover !== null && ROWS[hover].mini}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── circle reveal into the next version ── */}
            {going && (
              <motion.div
                className="fixed inset-0 z-[110]"
                style={{ background: going.row.color }}
                initial={{ clipPath: `circle(0px at ${going.x}px ${going.y}px)` }}
                animate={{ clipPath: `circle(150vmax at ${going.x}px ${going.y}px)` }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              />
            )}
          </>,
          host,
        )}
    </>
  );
}
