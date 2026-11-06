"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ambientCode } from "@/data/boot";
import { useReducedMotionFlag } from "@/hooks/useScrollStore";

/**
 * "terminal clear" between sections: as the band scrolls through, lines of
 * code rapidly fill it (clip-path wipe from the left) then clear (wipe out to
 * the right), ending on the command that "opens" the next section. It sits in
 * the document flow and is scrubbed, so it never blocks scrolling.
 */
export function SectionTransition({ command, seed = 0 }: { command: string; seed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionFlag();

  useGSAP(
    () => {
      if (reduced) return;
      const rows = ref.current!.querySelectorAll<HTMLElement>("[data-row]");
      const cmd = ref.current!.querySelector<HTMLElement>("[data-cmd]");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 25%", scrub: 0.6 },
      });
      tl.fromTo(
        rows,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", stagger: 0.04, duration: 0.5, ease: "none" },
      )
        .to(rows, { clipPath: "inset(0 0 0 100%)", stagger: 0.03, duration: 0.4, ease: "none" }, ">0.1")
        .fromTo(cmd, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, "<0.2");
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={ref} aria-hidden className="relative h-[22vh] min-h-[160px] overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center gap-1 px-[5vw] font-mono text-[11px] text-faint/50 lg:pl-[calc(5vw+60px)]">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} data-row className={reduced ? "hidden" : "truncate"}>
            {ambientCode[(i + seed) % ambientCode.length]} {ambientCode[(i + seed + 5) % ambientCode.length]}
          </div>
        ))}
      </div>
      <div
        data-cmd
        className="absolute inset-0 flex items-center px-[5vw] font-mono text-sm text-muted lg:pl-[calc(5vw+60px)]"
      >
        <span className="text-accent">❯</span>&nbsp;{command}
        <span className="caret ml-1" />
      </div>
    </div>
  );
}
