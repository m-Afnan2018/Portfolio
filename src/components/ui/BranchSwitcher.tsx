"use client";

/**
 * BranchSwitcher — how the developer site changes version.
 *
 * Each version of the site is a git branch:
 *   main       → this developer portfolio
 *   recruiter  → /hr
 *   client     → /work-with-me
 *
 * <BranchButton> (tab bar + status bar) opens a VS Code-style Quick Pick
 * ("Select a branch to checkout", type to filter, ↑↓ Enter). Picking a branch
 * — or typing `git checkout recruiter` in the hidden terminal — plays the
 * checkout: a terminal panel rises and types the command, then the next
 * version's colour wipes up and the page changes.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useScrollStore } from "@/hooks/useScrollStore";
import { handoffTo } from "@/lib/handoff";
import { usePersonaMark } from "@/hooks/usePersonaMark";
import { setPersona, type Persona } from "@/lib/persona";
import { ease } from "@/lib/motion";
import { playSound } from "@/lib/sound";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

export const BRANCHES: {
  id: Persona;
  branch: string;
  href: string;
  title: string;
  detail: string;
  commit: string;
  wipe: string;
  ink: string;
}[] = [
  {
    id: "dev",
    branch: "main",
    href: "/",
    title: "Developer portfolio",
    detail: "code, infrastructure, 3D — the full story",
    commit: "a3f9c21",
    wipe: "var(--bg)",
    ink: "var(--text)",
  },
  {
    id: "hr",
    branch: "recruiter",
    href: "/hr",
    title: "Recruiter brief",
    detail: "one page: experience, skills, availability, résumé",
    commit: "7be04d8",
    wipe: "#ffffff",
    ink: "#15171c",
  },
  {
    id: "client",
    branch: "client",
    href: "/work-with-me",
    title: "Work with me",
    detail: "services, process, pricing, start a project",
    commit: "e41b9a0",
    wipe: "#2563eb",
    ink: "#ffffff",
  },
];

/** the git-branch control used in the tab bar and the status bar */
export function BranchButton({ variant }: { variant: "tab" | "status" }) {
  const set = useScrollStore((s) => s.set);
  const open = () => {
    playSound("tick");
    set({ branchOpen: true });
  };
  if (variant === "status")
    return (
      <button
        type="button"
        onClick={open}
        title="Switch version (git checkout)"
        aria-label="Switch site version — current branch main"
        className="group bg-primary text-bg flex items-center gap-1.5 px-3 transition-[filter] hover:brightness-110"
      >
        <Icon name="branch" size={12} /> main
        <span
          aria-hidden
          className="text-[9px] opacity-70 transition-transform group-hover:translate-y-px"
        >
          ▾
        </span>
      </button>
    );
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Switch site version"
      className="group border-line text-muted hover:border-primary hover:text-primary flex h-7 items-center gap-2 rounded-[2px] border px-2.5 font-mono text-[11px] transition-colors"
    >
      <Icon name="branch" size={12} />
      <span>
        <span className="text-faint hidden xl:inline">branch: </span>main
      </span>
      <span aria-hidden className="text-faint group-hover:text-primary text-[9px]">
        ▾
      </span>
    </button>
  );
}

/** types a string out once, character by character */
function TypeOut({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((x) => Math.min(text.length, x + 1)), 26);
    return () => clearInterval(id);
  }, [text]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="caret ml-0.5" />}
    </>
  );
}

/** the Quick Pick + checkout transition (mount once, in AppShell) */
export function BranchSwitcher() {
  const router = useRouter();
  const open = useScrollStore((s) => s.branchOpen);
  const checkout = useScrollStore((s) => s.checkout);
  const set = useScrollStore((s) => s.set);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [lines, setLines] = useState(0);
  const [wipe, setWipe] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  usePersonaMark("dev");

  const items = useMemo(() => {
    const q = query
      .trim()
      .toLowerCase()
      .replace(/^git\s+(checkout|switch)\s*/, "");
    return BRANCHES.filter(
      (b) => !q || `${b.branch} ${b.title} ${b.detail}`.toLowerCase().includes(q),
    );
  }, [query]);

  const close = () => {
    set({ branchOpen: false });
    setQuery("");
    setActive(0);
  };

  const pick = (b: (typeof BRANCHES)[number]) => {
    close();
    if (b.id !== "dev") set({ checkout: b.id as "hr" | "client" });
  };

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 30);
  }, [open]);

  // checkout: type the command, then wipe, then navigate
  useEffect(() => {
    if (!checkout) return;
    const b = BRANCHES.find((x) => x.id === checkout)!;
    setPersona(b.id);
    router.prefetch(b.href);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(b.href);
      return;
    }
    playSound("whoosh");
    const t = [
      setTimeout(() => setLines(2), 800),
      setTimeout(() => setLines(3), 1100),
      setTimeout(() => setLines(4), 1400),
      setTimeout(() => setWipe(true), 1600),
      setTimeout(() => {
        handoffTo(b.id);
        router.push(b.href);
      }, 2300),
    ];
    return () => t.forEach(clearTimeout);
  }, [checkout, router]);

  const target = BRANCHES.find((x) => x.id === checkout);

  return (
    <>
      {/* ── Quick Pick ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] flex items-start justify-center px-4 pt-[9vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="bg-bg/50 absolute inset-0 backdrop-blur-[2px]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Switch to branch"
              initial={{ y: -12, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: ease.outBezier }}
              className="border-line-strong bg-surface relative w-full max-w-[620px] overflow-hidden rounded-[6px] border font-mono text-[13px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
              onKeyDown={(e) => {
                if (e.key === "Escape") close();
                else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => (a + 1) % Math.max(1, items.length));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => (a - 1 + items.length) % Math.max(1, items.length));
                } else if (e.key === "Enter" && items[active]) {
                  e.preventDefault();
                  pick(items[active]);
                }
              }}
            >
              <div className="border-line flex items-center gap-2 border-b px-3 py-2.5">
                <Icon name="branch" size={14} className="text-primary" />
                <input
                  ref={input}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  placeholder="Select a branch to checkout"
                  aria-label="Filter branches"
                  className="text-text placeholder:text-faint min-w-0 flex-1 bg-transparent outline-none"
                />
                <kbd className="border-line text-faint rounded-[2px] border px-1.5 text-[10px]">
                  esc
                </kbd>
              </div>
              <p className="text-faint px-3 pt-2.5 pb-1 text-[10px] tracking-[0.14em] uppercase">
                branches · each one is a version of this site
              </p>
              <ul className="pb-1.5" role="listbox">
                {items.map((b, i) => (
                  <li key={b.id} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => pick(b)}
                      className={cn(
                        "relative flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                        i === active ? "bg-primary/[0.12] text-text" : "text-muted",
                      )}
                    >
                      {i === active && (
                        <span className="bg-primary absolute inset-y-0 left-0 w-[2px]" />
                      )}
                      <Icon
                        name="branch"
                        size={14}
                        className={i === active ? "text-primary" : "text-faint"}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className={i === active ? "text-primary" : "text-text"}>
                            {b.branch}
                          </span>
                          <span className="text-faint truncate font-sans text-[12px]">
                            — {b.title}
                          </span>
                        </span>
                        <span className="text-faint block truncate font-sans text-[12px]">
                          {b.detail}
                        </span>
                      </span>
                      {b.id === "dev" ? (
                        <span className="border-accent/40 text-accent rounded-[2px] border px-1.5 text-[10px]">
                          ● current
                        </span>
                      ) : (
                        <span className="text-faint text-[11px]">{b.commit}</span>
                      )}
                    </button>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="text-faint px-3 py-3">No branch matches “{query}”</li>
                )}
              </ul>
              <p className="border-line text-faint flex justify-between gap-4 border-t px-3 py-1.5 text-[10px]">
                <span>↑↓ navigate · ↵ checkout</span>
                <span className="hidden sm:inline">
                  or type `git checkout client` in the terminal ( ` )
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── checkout transition ── */}
      <AnimatePresence>
        {target && (
          <motion.div
            className="fixed inset-0 z-[95]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            aria-live="polite"
          >
            <div className="bg-bg/70 absolute inset-0 backdrop-blur-sm" />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: ease.outBezier }}
              className="border-line-strong absolute inset-x-4 bottom-[12vh] mx-auto max-w-[640px] overflow-hidden rounded-[6px] border bg-[#05070d] font-mono text-[13px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
            >
              <div className="border-line text-faint flex items-center gap-2 border-b px-3 py-2 text-[11px]">
                <span className="flex gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className="ml-2">TERMINAL — afnan@portfolio</span>
              </div>
              <div className="text-text space-y-1.5 p-4">
                <p>
                  <span className="text-accent">visitor@afnan</span>:
                  <span className="text-primary">~/portfolio</span>${" "}
                  <TypeOut text={`git checkout ${target.branch}`} />
                </p>
                {lines >= 2 && (
                  <p className="text-muted">Switched to branch &apos;{target.branch}&apos;</p>
                )}
                {lines >= 3 && (
                  <p className="text-faint">
                    → building {target.title.toLowerCase()} <span className="text-accent">✓</span>{" "}
                    0.4s
                  </p>
                )}
                {lines >= 4 && <p className="text-accent">→ opening {target.href}</p>}
              </div>
            </motion.div>

            {/* the next version's colour wipes up */}
            <motion.div
              className="absolute inset-0"
              style={{ background: target.wipe }}
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: wipe ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
              transition={{ duration: 0.7, ease: ease.inOutBezier }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
