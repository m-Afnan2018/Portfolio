"use client";

import { motion } from "framer-motion";
import { sections } from "@/data/sections";
import { profile } from "@/data/profile";
import { useScrollStore } from "@/hooks/useScrollStore";
import { scrollToId } from "@/hooks/useLenis";
import { cn } from "@/lib/utils";
import { ScrambleText } from "./ScrambleText";
import { Icon } from "./Icon";
import { playSound } from "@/lib/sound";
import { BranchButton } from "./BranchSwitcher";
import { BrandMark } from "@/components/brand/BrandMark";

const DOT: Record<string, string> = {
  "home.tsx": "bg-primary",
  "about.json": "bg-warn",
  "skills.ts": "bg-primary",
  "experience.log": "bg-muted",
  "projects/": "bg-secondary",
  "infra.yml": "bg-danger",
  "stats.md": "bg-accent",
  "contact.sh": "bg-accent",
};

/** Top bar styled as editor tabs; the active tab follows the scroll. */
export function IdeTabs() {
  const active = useScrollStore((s) => s.activeSection);
  const set = useScrollStore((s) => s.set);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-11 items-stretch border-b border-line bg-glass backdrop-blur-xl">
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("home");
        }}
        className="group flex shrink-0 items-center gap-2 whitespace-nowrap border-r border-line px-4 font-mono text-xs text-muted transition-colors hover:text-text lg:pl-[60px]"
        aria-label={`${profile.name} — back to top`}
      >
        <BrandMark size={20} draw className="mr-1" />
        <span className="text-primary">~/</span>
        <span className="text-text">{profile.handle}</span>
        <span className="hidden text-faint sm:inline">— portfolio</span>
      </a>

      <nav aria-label="Sections" className="no-scrollbar hidden min-w-0 flex-1 overflow-x-auto md:flex">
        <ul className="flex">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className="relative">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    playSound("tick");
                    scrollToId(s.id);
                  }}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative flex h-11 items-center gap-2 border-r border-line px-4 font-mono text-xs transition-colors duration-300",
                    isActive ? "bg-bg/70 text-text" : "text-faint hover:bg-surface/40 hover:text-muted",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", DOT[s.file] ?? "bg-muted")} />
                  <ScrambleText text={s.file} trigger="hover" />
                  {isActive && (
                    <motion.span
                      layoutId="tab-indicator"
                      className="absolute inset-x-0 top-0 h-px bg-primary shadow-[0_0_12px_var(--primary)]"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="ml-auto flex items-center gap-2 px-3">
        <BranchButton variant="tab" />
        <button
          type="button"
          onClick={() => set({ paletteOpen: true })}
          className="hidden items-center gap-2 rounded-[2px] border border-line px-2.5 py-1 font-mono text-[11px] text-faint transition-colors hover:border-primary hover:text-primary lg:flex"
          aria-label="Open command palette"
        >
          <Icon name="search" size={12} /> ⌘K
        </button>
        <a
          href={profile.resume}
          download
          className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-primary sm:block"
        >
          resume.pdf
        </a>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("contact");
          }}
          className="rounded-[2px] bg-primary px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-bg transition-colors hover:bg-text"
        >
          hire me
        </a>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center text-muted md:hidden"
          aria-label="Open file tree navigation"
          onClick={() => set({ mobileNavOpen: true })}
        >
          <Icon name="menu" size={18} />
        </button>
      </div>
    </header>
  );
}
