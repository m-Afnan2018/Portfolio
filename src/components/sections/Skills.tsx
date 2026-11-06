"use client";

/**
 * Skills — pinned. The Core becomes a sphere of orbiting tech labels; as you
 * scroll, it slides right and a package.json panel scrubs its dependencies
 * past. Hovering a dependency highlights its label in 3D.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { skillGroups } from "@/data/skills";
import { profile } from "@/data/profile";
import { copy } from "@/data/copy";
import { useReducedMotionFlag, useScrollStore } from "@/hooks/useScrollStore";
import { ease } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

const KEY = "text-[#c4b5fd] [[data-theme=light]_&]:text-secondary";

function PackageJson() {
  const set = useScrollStore((s) => s.set);
  const hovered = useScrollStore((s) => s.hoveredSkill);
  const groups = skillGroups.filter((g) => g.id !== "tools");
  const dev = skillGroups.find((g) => g.id === "tools")!;
  let ln = 0;

  const line = (children: React.ReactNode, className?: string) => {
    ln++;
    return (
      <div className={cn("flex", className)}>
        <span aria-hidden className="mr-4 w-8 shrink-0 select-none text-right text-faint/60">
          {ln}
        </span>
        <span className="min-w-0">{children}</span>
      </div>
    );
  };

  const dep = (s: { name: string; version: string; note: string }, last: boolean) => (
    <li
      key={s.name}
      onMouseEnter={() => {
        set({ hoveredSkill: s.name });
        playSound("tick");
      }}
      onMouseLeave={() => set({ hoveredSkill: null })}
      onFocus={() => set({ hoveredSkill: s.name })}
      onBlur={() => set({ hoveredSkill: null })}
      tabIndex={0}
      data-cursor="highlight"
      className={cn(
        "rounded-[2px] transition-colors duration-300 focus:outline-none",
        hovered === s.name ? "bg-primary/10" : "hover:bg-white/[0.03]",
      )}
    >
      {line(
        <>
          {"    "}
          <span className={KEY}>&quot;{s.name}&quot;</span>
          <span className="text-faint">: </span>
          <span className="text-accent">&quot;{s.version}&quot;</span>
          <span className="text-faint">{last ? "" : ","}</span>
          <span className="ml-3 hidden italic text-faint sm:inline">
            {"// "}
            {s.note}
          </span>
        </>,
      )}
    </li>
  );

  return (
    <div className="font-mono text-[12.5px] leading-[1.85] text-text sm:text-[13px]">
      {line("{")}
      {line(
        <>
          {"  "}
          <span className={KEY}>&quot;name&quot;</span>: <span className="text-accent">&quot;@{profile.handle}/skills&quot;</span>,
        </>,
      )}
      {line(
        <>
          {"  "}
          <span className={KEY}>&quot;version&quot;</span>: <span className="text-accent">&quot;{profile.version.slice(1)}&quot;</span>,
        </>,
      )}
      {line(
        <>
          {"  "}
          <span className={KEY}>&quot;dependencies&quot;</span>: {"{"}
        </>,
      )}
      {groups.map((g, gi) => (
        <div key={g.id}>
          {line(<>{"    // "}{g.label}</>, "italic text-faint")}
          <ul>{g.skills.map((s, i) => dep(s, gi === groups.length - 1 && i === g.skills.length - 1))}</ul>
        </div>
      ))}
      {line("  },")}
      {line(
        <>
          {"  "}
          <span className={KEY}>&quot;devDependencies&quot;</span>: {"{"}
        </>,
      )}
      <ul>{dev.skills.map((s, i) => dep(s, i === dev.skills.length - 1))}</ul>
      {line("  }")}
      {line("}")}
    </div>
  );
}

export function Skills() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionFlag();
  const isMobile = useScrollStore((s) => s.isMobile);

  useGSAP(
    () => {
      if (reduced || isMobile) return;
      const panel = root.current!.querySelector<HTMLElement>("[data-panel]")!;
      const inner = root.current!.querySelector<HTMLElement>("[data-panel-inner]")!;
      const body = root.current!.querySelector<HTMLElement>("[data-panel-body]")!;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin.current,
          // content taller than the viewport → pin by its bottom so nothing is cut off
          start: () => (pin.current!.offsetHeight > window.innerHeight + 1 ? "bottom bottom" : "top top"),
          end: () => `+=${window.innerHeight * 1.8}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(panel, { xPercent: -30, autoAlpha: 0, filter: "blur(12px)" }, { xPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.3, ease: ease.out })
        .to(inner, { y: () => -Math.max(0, inner.scrollHeight - body.clientHeight), duration: 0.7, ease: "none" }, ">-0.05");
    },
    { scope: root, dependencies: [reduced, isMobile], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="skills" data-scene="3" aria-labelledby="skills-title" className="relative">
      <div ref={pin} className="relative flex min-h-screen flex-col px-[5vw] pb-12 pt-24 lg:min-h-screen lg:pl-[calc(5vw+60px)] xl:pr-[calc(5vw+56px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="skills-title" eyebrow={copy.skills.eyebrow} parts={copy.skills.title} />
          <p className="t-label hidden md:block">{copy.skills.hint}</p>
        </div>
        <div className="mt-10 grid flex-1 gap-8 lg:min-h-0 lg:grid-cols-12">
          <div
            data-panel
            data-no-drag
            className="glass relative overflow-hidden rounded-[8px] lg:col-span-6 lg:h-full xl:col-span-5"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-xs text-faint">
              <span>{copy.skills.file}</span>
              <span className="text-accent">✓ {skillGroups.reduce((n, g) => n + g.skills.length, 0)} packages, 0 vulnerabilities</span>
            </div>
            <div data-panel-body className="lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[42px] lg:overflow-hidden">
              <div data-panel-inner className="px-2 py-4">
                <PackageJson />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
