"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { sections } from "@/data/sections";
import { scrollState, useReducedMotionFlag, useScrollStore } from "@/hooks/useScrollStore";
import { toggleTheme } from "@/lib/theme";
import { setSoundEnabled } from "@/lib/sound";
import { Icon } from "./Icon";
import { BranchButton } from "./BranchSwitcher";
import { cn } from "@/lib/utils";

function useIstClock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: profile.timezone, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/** VS Code-style status bar: branch, cursor position (= scroll), section, IST clock, toggles. */
export function StatusBar() {
  const active = useScrollStore((s) => s.activeSection);
  const theme = useScrollStore((s) => s.theme);
  const sound = useScrollStore((s) => s.sound);
  const motionPref = useScrollStore((s) => s.motionPref);
  const set = useScrollStore((s) => s.set);
  const reduced = useReducedMotionFlag();
  const time = useIstClock();
  const lnRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const file = sections.find((s) => s.id === active)?.file ?? "home.tsx";

  // Ln / % update every frame without React renders
  useEffect(() => {
    const tick = () => {
      if (lnRef.current) lnRef.current.textContent = `Ln ${Math.floor(scrollState.y / 24) + 1}, Col 1`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(scrollState.progress * 100)}%`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const toggleMotion = () => {
    const next = reduced ? "full" : "reduce";
    localStorage.setItem("motion", next);
    set({ motionPref: next });
  };
  const toggleSound = () => {
    const next = !sound;
    set({ sound: next });
    void setSoundEnabled(next);
  };

  const item = "flex h-full shrink-0 items-center gap-1.5 whitespace-nowrap px-2.5 transition-colors hover:bg-white/10";
  return (
    <footer
      aria-label="Status bar"
      className="fixed inset-x-0 bottom-0 z-50 flex h-[26px] items-stretch justify-between border-t border-line bg-surface/90 font-mono text-[11px] text-muted backdrop-blur-xl"
    >
      <div className="flex min-w-0 items-stretch">
        <BranchButton variant="status" />
        <span className={cn(item, "hidden sm:flex")}>⟳ 0↓ 1↑</span>
        <span className={cn(item, "hidden lg:flex")}>
          <span className="text-accent">✓</span> 0 errors · 0 warnings
        </span>
        <span className={cn(item, "hidden lg:flex")}>{file}</span>
      </div>
      <div className="flex min-w-0 items-stretch">
        <span ref={lnRef} className={cn(item, "hidden lg:flex")} aria-hidden>
          Ln 1, Col 1
        </span>
        <span ref={pctRef} className={cn(item, "hidden lg:flex")} aria-hidden>
          0%
        </span>
        <span className={cn(item, "hidden xl:flex")}>UTF-8 · TSX</span>
        <span className={cn(item, "hidden lg:flex")} suppressHydrationWarning>
          {profile.timezoneLabel} {time}
        </span>
        <button type="button" onClick={toggleMotion} className={item} aria-pressed={reduced} title="Reduce motion">
          {reduced ? "◌ motion: reduced" : "◉ motion: full"}
          {motionPref === "system" && <span className="hidden text-faint lg:inline"> (os)</span>}
        </button>
        <button type="button" onClick={toggleSound} className={cn(item, "hidden sm:flex")} aria-pressed={sound}>
          ♪ sound: {sound ? "on" : "off"}
        </button>
        <button
          type="button"
          onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
          className={item}
          aria-label={`Switch to ${theme === "dark" ? "light (blueprint)" : "dark (night)"} theme`}
        >
          <Icon name={theme === "dark" ? "moon" : "sun"} size={12} />
          <span className="hidden sm:inline">{theme === "dark" ? "night" : "blueprint"}</span>
        </button>
        <span className="flex items-center gap-1.5 px-3 text-accent">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-[ping-soft_2s_ease-out_infinite] rounded-full bg-accent" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="hidden whitespace-nowrap md:inline">{profile.availability}</span>
        </span>
      </div>
    </footer>
  );
}
