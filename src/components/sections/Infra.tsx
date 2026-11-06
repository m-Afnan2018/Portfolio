"use client";

/**
 * Infra — pinned. Scrolling drives the CI/CD pipeline: each stage ticks
 * green in sequence while 3D packets travel the same path above the Core's
 * server racks (both read lib/pipeline.ts, so they stay in lock-step).
 */
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { pipeline, infraFiles, infraStats } from "@/data/infra";
import { copy } from "@/data/copy";
import { scrollState, useReducedMotionFlag, useScrollStore } from "@/hooks/useScrollStore";
import { pipelineProgress } from "@/lib/pipeline";
import { duration, ease, reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CodeBlock } from "@/components/ui/CodeBlock";

export function Infra({ filesHtml }: { filesHtml: string[] }) {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionFlag();
  const isMobile = useScrollStore((s) => s.isMobile);
  const [liveStage, setStage] = useState(-1);
  const [tab, setTab] = useState(0);
  const stage = reduced ? pipeline.length - 1 : liveStage;

  // pin the stage while the pipeline runs
  useGSAP(
    () => {
      if (reduced || isMobile) return;
      gsap.timeline({
        scrollTrigger: {
          trigger: pin.current,
          // content taller than the viewport → pin by its bottom so nothing is cut off
          start: () => (pin.current!.offsetHeight > window.innerHeight + 1 ? "bottom bottom" : "top top"),
          end: () => `+=${window.innerHeight * 1.6}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: root, dependencies: [reduced, isMobile], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-stage]", {
        y: 30,
        opacity: 0,
        duration: duration.reveal,
        ease: ease.out,
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-pipeline]", start: reveal.start },
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  // pipeline progress → stage ticks (React) + continuous fill (direct style)
  useEffect(() => {
    if (reduced) {
      if (fill.current) fill.current.style.transform = "scaleX(1)";
      return;
    }
    let last = -2;
    const tick = () => {
      const local = scrollState.local.infra ?? 0;
      const p = pipelineProgress(isMobile ? Math.min(1, local * 1.6) : local);
      if (fill.current) fill.current.style.transform = `scaleX(${p / (pipeline.length - 1)})`;
      const s = p <= 0 ? -1 : Math.floor(p + 0.02);
      if (s !== last) {
        if (s > last && last > -2) playSound("tick");
        last = s;
        setStage(s);
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [reduced, isMobile]);

  const allGreen = stage >= pipeline.length - 1;

  return (
    <section
      ref={root}
      id="infra"
      data-scene="6"
      aria-labelledby="infra-title"
      className="relative"
    >
      <div
        ref={pin}
        className="relative flex min-h-screen flex-col gap-8 px-[5vw] pt-20 pb-10 lg:min-h-screen lg:pl-[calc(5vw+60px)] xl:pr-[calc(5vw+56px)]"
      >
        <div className="grid gap-6 lg:grid-cols-12">
          <SectionHeading
            id="infra-title"
            eyebrow={copy.infra.eyebrow}
            parts={copy.infra.title}
            className="lg:col-span-7"
          />
          <p className="t-body glass self-end rounded-[8px] p-5 lg:col-span-4 lg:col-start-9">
            {copy.infra.lead}
          </p>
        </div>

        {/* pipeline */}
        <div data-pipeline className="relative">
          <div
            aria-hidden
            className="bg-line absolute top-[22px] right-0 left-0 hidden h-px md:block"
          />
          <div
            aria-hidden
            ref={fill}
            className="bg-accent absolute top-[22px] right-0 left-0 hidden h-px origin-left shadow-[0_0_10px_var(--accent)] md:block"
            style={{ transform: "scaleX(0)" }}
          />
          <ol
            aria-label="CI/CD pipeline"
            className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6"
          >
            {pipeline.map((s, i) => {
              const done = stage >= i;
              const running = stage === i - 1;
              return (
                <li key={s.id} data-stage className="glass rounded-[8px] p-3.5 font-mono">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors duration-500",
                        done
                          ? "border-accent bg-accent text-bg"
                          : running
                            ? "border-warn text-warn"
                            : "border-line-strong text-faint",
                      )}
                    >
                      {done ? (
                        "✓"
                      ) : running ? (
                        <span className="border-warn h-2 w-2 animate-spin rounded-full border border-t-transparent" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span
                      className={cn(
                        "truncate text-[13px] transition-colors",
                        done ? "text-text" : "text-muted",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p className="text-faint mt-2 truncate text-[11px]">{s.detail}</p>
                  <p
                    className={cn(
                      "mt-1 truncate text-[11px] transition-colors",
                      done ? "text-accent" : "text-faint/60",
                    )}
                  >
                    $ {s.cmd}
                  </p>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 font-mono text-xs" aria-live="polite">
            {allGreen ? (
              <span className="text-accent">✓ deployed · all checks passed · 200 OK</span>
            ) : stage >= 0 ? (
              <span className="text-warn">
                ● running: {pipeline[Math.min(stage + 1, pipeline.length - 1)].label}…
              </span>
            ) : (
              <span className="text-faint">○ waiting for push — keep scrolling</span>
            )}
          </p>
        </div>

        {/* config files + stats */}
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-12">
          <div className="min-h-0 lg:col-span-6">
            <CodeBlock
              html={filesHtml[tab]}
              code={infraFiles[tab].code}
              filename={infraFiles[tab].name}
              maxHeight="min(34vh, 400px)"
              tabs={infraFiles.map((f, i) => ({
                name: f.name,
                active: i === tab,
                onClick: () => setTab(i),
              }))}
            />
          </div>
          <ul className="flex flex-wrap content-end gap-2 self-end font-mono text-xs lg:col-span-6 lg:justify-end">
            {infraStats.map((s) => (
              <li
                key={s}
                className="hairline bg-glass text-muted rounded-[2px] px-3 py-2 backdrop-blur"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
