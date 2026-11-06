"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useReducedMotionFlag } from "@/hooks/useScrollStore";
import { duration, ease, reveal, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { TitlePart } from "@/data/copy";
import { ScrambleText } from "./ScrambleText";

/** A tiny CSS-3D cube that sits inline inside a heading. */
function InlineCube() {
  return (
    <span aria-hidden className="relative mx-[0.12em] inline-block h-[0.62em] w-[0.62em] align-[0.05em] [perspective:400px]">
      <span className="absolute inset-0 animate-[spin3d_8s_linear_infinite] [transform-style:preserve-3d]">
        {["rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)"].map(
          (t) => (
            <span
              key={t}
              className="absolute inset-0 border border-primary/80 bg-primary/10"
              style={{ transform: `${t} translateZ(0.31em)` }}
            />
          ),
        )}
      </span>
    </span>
  );
}

function InlineTerm() {
  return (
    <span
      aria-hidden
      className="glass mx-[0.15em] inline-flex h-[0.7em] items-center gap-[0.08em] rounded-[0.12em] px-[0.14em] align-[0.04em] font-mono text-[0.32em] leading-none tracking-normal text-accent"
    >
      &gt;_<span className="caret !w-[0.45em]" />
    </span>
  );
}

interface Props {
  id: string;
  eyebrow: string;
  parts: TitlePart[];
  className?: string;
  size?: "section" | "display";
}

/**
 * Section heading: a `// 0x. name` eyebrow that compiles in from glyphs, and
 * an editorial-scale title whose characters slide up out of masked lines.
 */
export function SectionHeading({ id, eyebrow, parts, className, size = "section" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionFlag();

  useGSAP(
    () => {
      if (reduced) return;
      const targets = ref.current!.querySelectorAll<HTMLElement>("[data-split]");
      const split = SplitText.create(targets, {
        type: "lines,chars",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 110,
            rotate: 4,
            duration: duration.reveal,
            ease: ease.out,
            stagger: stagger.char,
            scrollTrigger: { trigger: ref.current, start: reveal.start, once: true },
          }),
      });
      return () => split.revert();
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <ScrambleText text={eyebrow} className="t-label mb-5 block text-primary" />
      <h2 id={id} className={size === "display" ? "t-display" : "t-section"}>
        {parts.map((p, i) => (
          <span key={i} className={p.inline ? "inline-block whitespace-nowrap" : "inline"}>
            <span data-split className={cn(p.outline && "t-outline", p.accent && "text-primary")}>
              {p.text}
            </span>
            {p.inline === "cube" && <InlineCube />}
            {p.inline === "caret" && <span aria-hidden className="caret ml-[0.08em] !h-[0.75em] !w-[0.32em]" />}
            {p.inline === "term" && <InlineTerm />}
            {i < parts.length - 1 && " "}
          </span>
        ))}
      </h2>
    </div>
  );
}
