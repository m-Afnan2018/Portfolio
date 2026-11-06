"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionFlag } from "@/hooks/useScrollStore";
import { GLYPHS } from "@/lib/utils";
import { duration, ease, reveal } from "@/lib/motion";

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  /** "view": compile in when scrolled into view · "hover": re-scramble on hover · "mount": on mount */
  trigger?: "view" | "hover" | "mount" | "both";
  delay?: number;
}

/**
 * Text that "compiles" in from random glyphs. The real text is always in the
 * DOM (aria-label) so screen readers and crawlers never see the noise.
 */
export function ScrambleText({ text, as: Tag = "span", className, trigger = "view", delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionFlag();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;
      const run = () =>
        gsap.to(el, {
          duration: duration.reveal,
          delay,
          ease: ease.soft,
          scrambleText: { text, chars: GLYPHS, speed: 0.6, revealDelay: 0.15 },
        });
      if (trigger === "mount") run();
      if (trigger === "view" || trigger === "both") {
        el.textContent = "";
        ScrollTrigger.create({ trigger: el, start: reveal.start, once: true, onEnter: run });
      }
      if (trigger === "hover" || trigger === "both") {
        const parent = (el.closest("a,button") as HTMLElement) ?? el;
        const onEnter = () =>
          gsap.to(el, { duration: duration.micro, ease: "none", scrambleText: { text, chars: GLYPHS, speed: 1 } });
        parent.addEventListener("mouseenter", onEnter);
        return () => parent.removeEventListener("mouseenter", onEnter);
      }
    },
    { dependencies: [text, reduced, trigger], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
