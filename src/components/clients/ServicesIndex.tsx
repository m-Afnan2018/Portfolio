"use client";

/**
 * Services showcase.
 *
 * Desktop: the six services scroll by on the left as large blocks — the one
 * being read is bright, the rest step back — while a sticky dark stage on the
 * right plays that service's live scene (ServiceVisuals). A six-part progress
 * bar on the stage fills with the scroll and doubles as navigation.
 * Phones: each block carries its own scene inline; no sticky stage.
 */
import { useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { services } from "@/data/clients";
import { ServiceVisual } from "./ServiceVisuals";

// stage glow per service, in the page's blue family
const GLOW = ["#2563eb", "#0ea5e9", "#38bdf8", "#22d3ee", "#6366f1", "#22c55e"];
const glow = (c: string) => ({ "--glow": c }) as CSSProperties;

export function ServicesIndex() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const blocks = q("[data-svc]") as HTMLElement[];
      const fills = q("[data-seg-fill]") as HTMLElement[];
      blocks.forEach((b, i) => {
        ScrollTrigger.create({
          trigger: b,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
          onUpdate: (self) => fills[i] && gsap.set(fills[i], { scaleX: self.progress }),
          onLeave: () => fills[i] && gsap.set(fills[i], { scaleX: 1 }),
          onLeaveBack: () => fills[i] && gsap.set(fills[i], { scaleX: 0 }),
        });
      });

      // each block's checklist draws in as it arrives
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        blocks.forEach((b) => {
          gsap.from(b.querySelectorAll("[data-inc]"), {
            x: -16,
            autoAlpha: 0,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: b, start: "top 60%", once: true },
          });
        });
      }
    },
    { scope: root },
  );

  const svc = services[active];

  return (
    <div ref={root} className="relative grid gap-x-14 lg:grid-cols-12">
      {/* ── scrolling service blocks ── */}
      <div className="lg:col-span-5">
        {services.map((s, i) => (
          <article
            key={s.id}
            id={`svc-${s.id}`}
            data-svc
            data-active={active === i}
            aria-labelledby={`svc-${s.id}-title`}
            className="cl-svc flex scroll-mt-24 flex-col justify-center border-t border-[var(--cl-rule)] py-14 first:border-t-0 lg:min-h-[78vh] lg:border-t-0 lg:py-10"
          >
            {/* phones: the scene sits right here */}
            <div className="relative mb-8 h-[300px] overflow-hidden rounded-[24px] bg-[var(--cl-ink)] text-white sm:h-[380px] lg:hidden">
              <div className="cl-stage-bg absolute inset-0" style={glow(GLOW[i])} />
              <div className="absolute inset-5">
                <ServiceVisual id={s.id} active={active === i} />
              </div>
            </div>

            <p className="flex items-center gap-3 font-mono text-[13px] text-[var(--cl-muted)]">
              <span className="text-[var(--cl-accent)]">{String(i + 1).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-current opacity-40" />
              {s.timeline}
            </p>
            <h3
              id={`svc-${s.id}-title`}
              className="cl-display mt-4 text-[clamp(2.3rem,4.2vw,4rem)] leading-[0.98]"
            >
              {s.title}
            </h3>
            <p className="mt-5 max-w-[30rem] text-[17px] leading-relaxed text-[var(--cl-ink-2)]">
              {s.summary}
            </p>
            <ul className="mt-6 space-y-3">
              {s.includes.map((x) => (
                <li key={x} data-inc className="flex items-center gap-3 text-[15px] font-medium">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--cl-accent-soft)] text-[12px] text-[var(--cl-accent)]">
                    ✓
                  </span>
                  {x}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="cl-tag">{s.stack}</span>
              <a
                href="#inquiry"
                className="cl-svc-cta text-sm font-semibold text-[var(--cl-accent-ink)]"
              >
                Get a quote for this <span aria-hidden>→</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* ── sticky stage (desktop) ── */}
      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-[12vh] h-[76vh]">
          <div className="relative flex h-full flex-col overflow-hidden rounded-[32px] bg-[var(--cl-ink)] text-white shadow-[0_50px_100px_-40px_rgba(11,17,32,0.6)]">
            <div className="cl-stage-bg absolute inset-0" style={glow(GLOW[active])} />
            <div className="cl-hero-grid absolute inset-0 opacity-60" />
            <div className="cl-grain" />

            {/* which service, and the six-part progress / nav */}
            <div className="relative flex items-center justify-between gap-6 px-7 pt-6">
              <div className="min-w-0">
                <p className="font-mono text-[12px] text-white/45">
                  Service {String(active + 1).padStart(2, "0")} /{" "}
                  {String(services.length).padStart(2, "0")}
                </p>
                <p key={svc.id} className="cl-display cl-swap mt-1 truncate text-[22px]">
                  {svc.title}
                </p>
              </div>
              <nav aria-label="Jump to a service" className="flex shrink-0 gap-1.5">
                {services.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#svc-${s.id}`}
                    aria-label={s.title}
                    aria-current={active === i ? "true" : undefined}
                    data-cursor={s.title}
                    className="group relative block h-8 w-9 py-3.5"
                  >
                    <span className="block h-[3px] overflow-hidden rounded-full bg-white/15 transition-colors group-hover:bg-white/30">
                      <span
                        data-seg-fill
                        className="block h-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#67e8f9]"
                      />
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            {/* the scenes — all mounted, only the active one shown and animating */}
            <div className="relative flex-1">
              {services.map((s, i) => (
                <div
                  key={s.id}
                  data-active={active === i}
                  aria-hidden={active !== i}
                  className="cl-stage-item absolute inset-x-10 top-6 bottom-10"
                >
                  <ServiceVisual id={s.id} active={active === i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
