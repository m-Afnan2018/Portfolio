"use client";

/**
 * PersonaGate — "who's visiting?" on a first visit to "/".
 *
 * A full-screen triptych: three tall panels, each a live window into its
 * version's world — Developer (dark, code typing itself), Recruiter (paper,
 * a résumé with a "Hiring?" stamp), Client (blue, drifting light, live chips).
 * Hovering / focusing a panel widens it and reveals "Enter →". Choosing one
 * makes that panel grow to fill the screen, then:
 *   developer → the gate fades and the terminal boot sequence starts
 *   recruiter / client → the page changes to /hr or /work-with-me
 *
 * Shown pre-paint by the .js-ask class (root <head> script), so there's no
 * flash of the site first; the entrance is pure CSS so it plays before
 * hydration. Keys 1/2/3, ←→ / ↑↓ + Enter, or click. Esc = "just looking".
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { personas, setPersona, type Persona } from "@/lib/persona";
import { getLenis } from "@/hooks/useLenis";
import { playSound } from "@/lib/sound";
import { handoffTo } from "@/lib/handoff";
import { BrandMark } from "@/components/brand/BrandMark";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const asking = () => document.documentElement.classList.contains("js-ask");

/* ── the three worlds ─────────────────────────────────────────────────── */
const CODE: ReactNode[][] = [
  [
    <span key="a" className="text-[#c4b5fd]">
      const
    </span>,
    " visitor = ",
    <span key="b" className="text-[#22d3ee]">
      await
    </span>,
    " whoami();",
  ],
  [
    <span key="a" className="text-[#c4b5fd]">
      if
    </span>,
    " (visitor.loves(",
    <span key="b" className="text-[#86efac]">
      &quot;code&quot;
    </span>,
    ")) {",
  ],
  [
    "  open(",
    <span key="a" className="text-[#86efac]">
      &quot;~/portfolio&quot;
    </span>,
    ");",
  ],
  ["}"],
];

function DevScene() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="pg-grid absolute inset-0" />
      <div className="absolute -top-[20%] -right-[30%] h-[70%] w-[90%] rounded-full bg-[#22d3ee] opacity-[0.12] blur-[90px]" />
      <div className="absolute top-[16%] right-[8%] left-[10%] hidden font-mono text-[clamp(11px,0.95vw,14px)] leading-[1.9] text-white/75 lg:block">
        {CODE.map((line, i) => (
          <p
            key={i}
            className="pg-type flex whitespace-pre"
            style={{ animationDelay: `${0.9 + i * 0.55}s` }}
          >
            <span className="mr-4 text-white/25">{i + 1}</span>
            {line}
          </p>
        ))}
        <span className="caret mt-1 ml-7 inline-block" />
      </div>
    </div>
  );
}

function HrScene() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="pg-ruled absolute inset-0" />
      <div className="absolute top-[14%] left-1/2 hidden w-[min(62%,240px)] -translate-x-1/2 lg:block">
        <div className="pg-float -rotate-3 rounded-[10px] border border-[#e6e6e6] bg-[#fafafa] p-4 shadow-[0_24px_50px_-24px_rgba(21,23,28,0.45)]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15171c] text-[10px] font-bold text-white">
              MA
            </span>
            <span className="space-y-1">
              <span className="block h-1.5 w-20 rounded-full bg-[#15171c]" />
              <span className="block h-1 w-14 rounded-full bg-[#15171c]/30" />
            </span>
          </div>
          <div className="mt-3.5 space-y-1.5">
            {[92, 78, 86, 64, 80].map((w, i) => (
              <span
                key={i}
                className="block h-1 rounded-full bg-[#15171c]/15"
                style={{ width: `${w}%` }}
              />
            ))}
            <span className="block h-1 w-[45%] rounded-full bg-[#2563eb]/70" />
          </div>
          <span className="pg-stamp absolute -right-6 -bottom-5 rotate-[-14deg] rounded-[6px] border-2 border-[#2563eb] bg-[#fafafa]/90 px-2 py-0.5 text-[10px] font-extrabold tracking-[0.12em] whitespace-nowrap text-[#2563eb] uppercase">
            Hiring? Start here
          </span>
        </div>
      </div>
    </div>
  );
}

function ClientScene() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="pg-drift absolute -top-[20%] -left-[30%] h-[70%] w-[120%] rounded-full bg-[#38bdf8] opacity-50 blur-[80px]" />
      <div className="pg-drift pg-drift-2 absolute -right-[30%] bottom-[10%] h-[60%] w-[100%] rounded-full bg-[#0b1120] opacity-40 blur-[90px]" />
      <div className="absolute top-[16%] left-[10%] hidden flex-col gap-3 lg:flex">
        {[
          ["✓", "Update is live", "deployed in 42s"],
          ["✉", "New enquiry", "contact form · now"],
        ].map(([g, t, m], i) => (
          <span
            key={t}
            className="pg-float flex w-fit items-center gap-2.5 rounded-[14px] border border-white/25 bg-white/15 px-3 py-2 text-white backdrop-blur-md"
            style={{ animationDelay: `${i * 1.4}s`, marginLeft: i ? "18%" : 0 }}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white/20 text-[12px]">
              {g}
            </span>
            <span>
              <span className="block text-[12px] font-semibold">{t}</span>
              <span className="block text-[11px] text-white/70">{m}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

const PANELS: Record<
  Persona,
  {
    who: string;
    title: string;
    desc: string;
    bg: string;
    ink: string;
    sub: string;
    accent: string;
    scene: ReactNode;
    tag: string;
  }
> = {
  dev: {
    who: "Here for the code",
    title: "Developer",
    desc: "The full portfolio — projects, infrastructure, 3D and all the details.",
    bg: "bg-[#05070d]",
    ink: "text-white",
    sub: "text-white/60",
    accent: "bg-[#22d3ee] text-[#05070d]",
    scene: <DevScene />,
    tag: "~/portfolio",
  },
  hr: {
    who: "Hiring for a role",
    title: "Recruiter",
    desc: "A one-page brief: experience, skills, availability and résumé.",
    bg: "bg-[#ffffff]",
    ink: "text-[#15171c]",
    sub: "text-[#15171c]/60",
    accent: "bg-[#15171c] text-white",
    scene: <HrScene />,
    tag: "/hr",
  },
  client: {
    who: "Hiring for a project",
    title: "Client",
    desc: "Websites, stores and web apps — services, pricing and a quick brief.",
    bg: "bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#0ea5e9]",
    ink: "text-white",
    sub: "text-white/70",
    accent: "bg-white text-[#1d4ed8]",
    scene: <ClientScene />,
    tag: "/work-with-me",
  },
};

export function PersonaGate() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [focus, setFocus] = useState<number | null>(null);
  const [leaving, setLeaving] = useState<Persona | null>(null);
  const [fade, setFade] = useState(false);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  // not asked this visit → unmount; otherwise hold the page still
  useEffect(() => {
    if (!asking()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
      return;
    }
    let raf = 0;
    const hold = () => {
      const l = getLenis();
      if (l) l.stop();
      else raf = requestAnimationFrame(hold);
    };
    hold();
    return () => cancelAnimationFrame(raf);
  }, []);

  function choose(p: Persona) {
    if (leaving) return;
    setPersona(p);
    setLeaving(p);
    setFocus(personas.findIndex((x) => x.id === p));
    playSound("whoosh");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (p === "dev") {
      setTimeout(() => setFade(true), reduced ? 0 : 950);
      return;
    }
    // drop the scroll lock now; data-leaving keeps the gate visible until the route changes
    document.documentElement.classList.remove("js-ask");
    const target = personas.find((x) => x.id === p)!.href;
    router.prefetch(target);
    setTimeout(
      () => {
        if (!reduced) handoffTo(p);
        router.push(target);
      },
      reduced ? 0 : 1000,
    );
  }

  /** developer chosen and the gate has faded → hand over to the loader */
  function release() {
    document.documentElement.classList.remove("js-ask");
    window.dispatchEvent(new Event("persona:chosen"));
    if (!document.documentElement.classList.contains("js-boot")) getLenis()?.start();
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (leaving || e.metaKey || e.ctrlKey || e.altKey) return;
      const byKey = personas.findIndex((p) => p.key === e.key);
      if (byKey >= 0) {
        e.preventDefault();
        choose(personas[byKey].id);
      } else if (e.key === "Escape") {
        e.preventDefault();
        choose("dev");
      } else if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Tab"].includes(e.key)) {
        e.preventDefault();
        const back =
          e.key === "ArrowLeft" || e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey);
        const from = focus ?? (back ? 0 : personas.length - 1);
        const n = (from + (back ? personas.length - 1 : 1)) % personas.length;
        setFocus(n);
        btns.current[n]?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, focus, leaving]);

  if (!open) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="persona-title"
      data-leaving={leaving && leaving !== "dev" ? "" : undefined}
      className="persona-gate fixed inset-0 z-[95] flex-col bg-[#05070d]"
      initial={false}
      animate={{ opacity: fade ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={() => fade && release()}
    >
      {/* ── the question, floating over all three ── */}
      <div
        className={cn(
          "pg-in pointer-events-none absolute top-5 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-500 sm:top-7",
          leaving && "opacity-0",
        )}
        style={{ animationDelay: "0.7s" }}
      >
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-[#0b1120]/75 py-1.5 pr-5 pl-1.5 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <BrandMark size={32} draw className="!rounded-full" />
          <h1 id="persona-title" className="text-[14px] whitespace-nowrap sm:text-[15px]">
            <span className="text-white/60">Hi, I&apos;m {profile.firstName} —</span>{" "}
            <span className="font-semibold">who&apos;s visiting?</span>
          </h1>
        </div>
      </div>

      {/* ── the triptych ── */}
      <div
        className="pg-row flex h-full w-full flex-col pt-[64px] lg:flex-row lg:pt-0"
        onPointerLeave={() => !leaving && setFocus(null)}
      >
        {personas.map((p, i) => {
          const c = PANELS[p.id];
          const chosen = leaving === p.id;
          const on = chosen || (!leaving && focus === i);
          const grow = leaving ? (chosen ? 1 : 0) : focus === null ? 1 : focus === i ? 1.75 : 0.8;
          return (
            <button
              key={p.id}
              ref={(el) => {
                btns.current[i] = el;
              }}
              type="button"
              onClick={() => choose(p.id)}
              onPointerEnter={() => !leaving && setFocus(i)}
              onFocus={() => !leaving && setFocus(i)}
              data-on={on}
              aria-label={`I'm a ${c.title.toLowerCase()} — ${c.desc}`}
              className={cn(
                "pg-panel group relative min-h-0 min-w-0 overflow-hidden text-left outline-none",
                c.bg,
                c.ink,
              )}
              style={{ flexGrow: grow, animationDelay: `${0.05 + i * 0.12}s` }}
            >
              <div className="pg-scene absolute inset-0">{c.scene}</div>
              {i > 0 && (
                <span
                  aria-hidden
                  className="absolute top-0 left-0 hidden h-full w-px bg-white/10 lg:block"
                />
              )}

              <div
                className={cn(
                  "absolute inset-0 flex flex-col justify-center p-6 transition-opacity duration-500 sm:p-8 lg:top-auto lg:justify-end lg:p-10",
                  chosen && "opacity-0",
                )}
              >
                <p
                  className={cn("pg-in flex items-center gap-3 font-mono text-[12px]", c.sub)}
                  style={{ animationDelay: `${0.5 + i * 0.12}s` }}
                >
                  <span>0{i + 1}</span>
                  <span className="h-px w-6 bg-current opacity-50" />
                  <span>{c.tag}</span>
                  <kbd className="ml-auto hidden rounded-[4px] border border-current px-1.5 py-0.5 text-[10px] opacity-60 lg:inline">
                    {p.key}
                  </kbd>
                </p>
                <p
                  className={cn("pg-in mt-2 text-[14px] font-medium lg:mt-4 lg:text-[15px]", c.sub)}
                  style={{ animationDelay: `${0.58 + i * 0.12}s` }}
                >
                  {c.who}
                </p>
                <span className="block overflow-hidden pb-[0.08em]">
                  <span
                    className="pg-rise pg-title font-display block text-[clamp(2.2rem,4.6vw,5rem)] leading-[0.95] font-bold tracking-[-0.045em] whitespace-nowrap"
                    style={{ animationDelay: `${0.62 + i * 0.12}s` }}
                  >
                    {c.title}
                  </span>
                </span>
                {/* revealed on focus (always shown on phones) */}
                <div className="grid lg:grid-rows-[0fr] lg:transition-[grid-template-rows] lg:duration-700 lg:ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-data-[on=true]:grid-rows-[1fr]">
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className={cn(
                        "mt-3 hidden max-w-[30ch] text-[15px] leading-relaxed sm:block",
                        c.sub,
                      )}
                    >
                      {c.desc}
                    </p>
                    <span
                      className={cn(
                        "mt-4 inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-semibold lg:mt-5 lg:h-11 lg:px-5",
                        c.accent,
                      )}
                    >
                      Enter{" "}
                      <span className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── skip ── */}
      <button
        type="button"
        onClick={() => choose("dev")}
        className={cn(
          "pg-in absolute top-7 right-6 z-20 hidden rounded-full border border-white/15 bg-[#0b1120]/70 px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-white/70 uppercase backdrop-blur-xl transition-[color,opacity] duration-500 hover:text-white lg:block",
          leaving && "pointer-events-none opacity-0",
        )}
        style={{ animationDelay: "1.1s" }}
      >
        esc · just looking
      </button>
    </motion.div>
  );
}
