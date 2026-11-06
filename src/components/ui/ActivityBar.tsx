"use client";

import { sections } from "@/data/sections";
import { profile } from "@/data/profile";
import { useScrollStore } from "@/hooks/useScrollStore";
import { scrollToId } from "@/hooks/useLenis";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

/** Slim VS Code-style activity bar (desktop only). */
export function ActivityBar() {
  const active = useScrollStore((s) => s.activeSection);
  const set = useScrollStore((s) => s.set);
  return (
    <aside
      aria-label="Quick navigation"
      className="fixed bottom-[26px] left-0 top-11 z-40 hidden w-12 flex-col items-center justify-between border-r border-line bg-glass py-3 backdrop-blur-xl lg:flex"
    >
      <ul className="flex flex-col gap-1">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(s.id);
              }}
              aria-label={s.label}
              title={s.file}
              className={cn(
                "relative flex h-10 w-12 items-center justify-center transition-colors duration-300",
                active === s.id ? "text-text" : "text-faint hover:text-muted",
              )}
            >
              {active === s.id && <span className="absolute inset-y-2 left-0 w-0.5 bg-primary" />}
              <Icon name={s.icon} size={18} />
            </a>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => set({ terminalOpen: true })}
          className="flex h-10 w-12 items-center justify-center text-faint transition-colors hover:text-accent"
          aria-label="Open terminal (backtick)"
          title="Terminal  `"
        >
          <Icon name="terminal" size={18} />
        </button>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 w-12 items-center justify-center text-faint transition-colors hover:text-text"
          aria-label="GitHub"
        >
          <Icon name="github" size={18} />
        </a>
      </div>
    </aside>
  );
}
