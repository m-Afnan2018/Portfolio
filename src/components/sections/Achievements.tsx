"use client";

import type { ReactNode } from "react";
import { achievements, openSource } from "@/data/profile";
import { copy } from "@/data/copy";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";

/** Achievements: terminal progress-bar counters (particles burst when each finishes) + GitHub heatmap. */
export function Achievements({ heatmap }: { heatmap: ReactNode }) {
  return (
    <section
      id="achievements"
      data-scene="7"
      aria-labelledby="achievements-title"
      className="relative min-h-screen px-[5vw] py-24 lg:pl-[calc(5vw+60px)] xl:pr-[calc(5vw+56px)]"
    >
      <SectionHeading id="achievements-title" eyebrow={copy.achievements.eyebrow} parts={copy.achievements.title} />
      <div className="mt-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="mb-2 font-mono text-sm text-muted">
            <span className="text-accent">❯</span> cat stats.md | progress
          </p>
          {achievements.map((a, i) => (
            <Counter key={a.label} item={a} index={i} />
          ))}
          <div className="border-t border-line pt-6 font-mono text-sm">
            <p className="text-muted">
              <span className="text-secondary">open-source</span> → <span className="text-text">{openSource.project}</span>
            </p>
            <p className="mt-2 max-w-[60ch] text-[13px] text-faint">{openSource.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-16">{heatmap}</div>
    </section>
  );
}
