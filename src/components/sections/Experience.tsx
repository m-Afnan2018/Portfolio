"use client";

/**
 * Experience as `git log --graph`. Jobs are commits on main; education is a
 * branch that merged in. The graph line draws itself as you scroll while the
 * camera flies down the Core's helix and each commit node lights up.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { copy } from "@/data/copy";
import { useReducedMotionFlag } from "@/hooks/useScrollStore";
import { duration, ease } from "@/lib/motion";
import { fakeHash, cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Commit {
  hash: string;
  refs: string[];
  date: string;
  title: string;
  where: string;
  body: string[];
  lane: 0 | 1;
  current?: boolean;
}

const commits: Commit[] = [
  ...experience.map<Commit>((j) => ({
    hash: j.hash,
    refs: [j.tag ?? "", j.branch !== "main" ? `origin/${j.branch}` : ""].filter(Boolean),
    date: j.period,
    title: `feat: ${j.role}`,
    where: `${j.company} · ${j.mode}`,
    body: j.bullets,
    lane: 0,
    current: j.current,
  })),
  ...profile.education.map<Commit>((e) => ({
    hash: fakeHash(e.school),
    refs: ["branch: edu"],
    date: e.period,
    title: `chore: ${e.degree}`,
    where: e.school,
    body: [],
    lane: 1,
  })),
];

export function Experience() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotionFlag();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-graph-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-graph]", start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-commit]").forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 72%" } });
        tl.from(el.querySelector("[data-node]"), { scale: 0, duration: 0.6, ease: "back.out(3)" })
          .from(el.querySelectorAll("[data-line]"), {
            x: -24,
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
            duration: duration.reveal,
            ease: ease.out,
            stagger: 0.06,
          }, "<0.1");
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="experience"
      data-scene="4"
      aria-labelledby="experience-title"
      className="relative min-h-[200vh] px-[5vw] py-24 lg:pl-[calc(5vw+60px)] xl:pr-[calc(5vw+56px)]"
    >
      <SectionHeading id="experience-title" eyebrow={copy.experience.eyebrow} parts={copy.experience.title} />
      <p className="mt-8 font-mono text-sm text-muted">
        <span className="text-accent">❯</span> {copy.experience.command}
      </p>

      <ol data-graph className="relative mt-16 max-w-3xl md:ml-[4vw]" aria-label="Work history">
        {/* lane 0 (main) */}
        <span aria-hidden className="absolute bottom-0 left-[11px] top-2 w-px bg-line" />
        <span aria-hidden data-graph-line className="absolute bottom-0 left-[11px] top-2 w-px origin-top bg-primary shadow-[0_0_10px_var(--primary)]" />
        {commits.map((c, i) => {
          const first = c.lane === 1 && commits[i - 1]?.lane === 0;
          return (
            <li key={c.hash} data-commit className={cn("relative pb-20 pl-14 last:pb-0", c.lane === 1 && "pl-24")}>
              {/* lane 1 (edu branch) connector */}
              {c.lane === 1 && (
                <>
                  <span aria-hidden className="absolute bottom-0 left-[51px] top-0 w-px bg-secondary/50" />
                  {first && (
                    <svg aria-hidden className="absolute -top-10 left-[11px] h-12 w-11 overflow-visible" viewBox="0 0 41 48" fill="none">
                      <path d="M0 0 C 0 30, 40 18, 40 48" stroke="var(--secondary)" strokeOpacity="0.6" />
                    </svg>
                  )}
                </>
              )}
              <span
                data-node
                aria-hidden
                className={cn(
                  "absolute top-1 flex h-[23px] w-[23px] items-center justify-center rounded-full border-2 bg-bg",
                  c.lane === 0 ? "left-0 border-primary" : "left-10 border-secondary",
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", c.current ? "animate-pulse bg-accent" : c.lane === 0 ? "bg-primary" : "bg-secondary")} />
              </span>
              <div className="font-mono text-[13px] leading-relaxed">
                <p data-line className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-warn">commit {c.hash}</span>
                  {c.refs.map((r) => (
                    <span key={r} className={cn("rounded-[2px] px-1.5 py-px text-[11px]", r.startsWith("HEAD") ? "bg-accent/15 text-accent" : r.startsWith("branch") ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary")}>
                      {r}
                    </span>
                  ))}
                </p>
                <p data-line className="text-faint">Author: {profile.name} &lt;{profile.email}&gt;</p>
                <p data-line className="text-faint">Date:&nbsp;&nbsp; {c.date}</p>
              </div>
              <div className="glass mt-5 rounded-[8px] p-5 sm:p-6">
                <h3 data-line className="t-h3 text-text">
                  <span className="font-mono text-[0.6em] text-secondary">{c.title.split(":")[0]}: </span>
                  {c.title.split(": ")[1]}
                </h3>
                <p data-line className="mt-2 font-mono text-sm text-primary">@ {c.where}</p>
                {c.body.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {c.body.map((b) => (
                      <li data-line key={b} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                        <span className="font-mono text-accent">+</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-16 max-w-3xl font-mono text-xs text-faint md:ml-[4vw]">(END) — press q to quit, or keep scrolling</p>
    </section>
  );
}
