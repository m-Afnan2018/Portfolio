"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { copy } from "@/data/copy";
import { useReducedMotionFlag } from "@/hooks/useScrollStore";
import { duration, ease, reveal, stagger } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CodeBlock } from "@/components/ui/CodeBlock";

export function About({ codeHtml, code }: { codeHtml: string; code: string }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotionFlag();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-reveal]", {
        y: 40,
        opacity: 0,
        filter: "blur(10px)",
        duration: duration.reveal,
        ease: ease.out,
        stagger: stagger.item,
        scrollTrigger: { trigger: "[data-reveal-group]", start: reveal.start },
      });
      gsap.from("[data-code]", {
        clipPath: "inset(0 0 100% 0)",
        duration: duration.section,
        ease: ease.inOut,
        scrollTrigger: { trigger: "[data-code]", start: reveal.start },
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="about"
      data-scene="2"
      aria-labelledby="about-title"
      className="relative min-h-screen px-[5vw] py-24 lg:pl-[calc(5vw+60px)] xl:pr-[calc(5vw+56px)]"
    >
      <SectionHeading id="about-title" eyebrow={copy.about.eyebrow} parts={copy.about.title} className="md:text-right" />

      <div className="mt-16 grid gap-10 md:grid-cols-12 lg:mt-24">
        {/* columns 1–5 are left open for the Core's laptop form */}
        <div data-reveal-group className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-7">
          <p data-reveal className="t-h3 !font-medium text-text">
            {profile.summary}
          </p>
          <p data-reveal className="t-body mt-6">
            {profile.summaryExtra}
          </p>
          <dl data-reveal className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-line bg-line font-mono text-xs">
            {[
              ["based in", `${profile.location} · ${profile.timezoneLabel}`],
              ["sites in prod", "20+"],
              ["education", `${profile.education[0].degree} '24`],
              ["status", profile.availability],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface/80 p-4">
                <dt className="text-faint">{k}</dt>
                <dd className="mt-1 text-text">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div data-code className="md:col-span-12 lg:col-span-6 lg:col-start-7">
          <CodeBlock html={codeHtml} code={code} filename={copy.about.file} />
        </div>
      </div>
    </section>
  );
}
