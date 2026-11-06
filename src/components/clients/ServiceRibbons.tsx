"use client";

/**
 * ServiceRibbons — two tapes crossing in an X over the seam between the dark
 * hero and the white services section.
 *
 *   front tape  blue, solid white words: the services
 *   back tape   sky blue, dark outlined words: the outcomes
 *
 * They run in opposite directions, speed up with scroll velocity and reverse
 * when you scroll back up. Entering the screen, they rotate from flat into
 * the X. The ✺ separators spin with the speed. Hover slows them; the whole
 * band is one link to #services.
 */
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { marqueeWords, ribbonPromises } from "@/data/clients";

const COPIES = 3; // enough to cover a tilted, 120vw-wide tape twice over

function Star({ className }: { className?: string }) {
  return (
    <svg
      data-star
      viewBox="0 0 40 40"
      aria-hidden
      className={`h-[0.62em] w-[0.62em] shrink-0 ${className ?? ""}`}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x="18"
          y="2"
          width="4"
          height="36"
          rx="2"
          fill="currentColor"
          transform={`rotate(${i * 22.5} 20 20)`}
        />
      ))}
    </svg>
  );
}

function Tape({ words, variant }: { words: readonly string[]; variant: "front" | "back" }) {
  const front = variant === "front";
  return (
    <div
      data-tape={variant}
      className={`absolute top-1/2 left-[-10vw] w-[120vw] ${
        front
          ? "z-10 bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#0ea5e9] text-white shadow-[0_30px_60px_-20px_rgba(37,99,235,0.6)]"
          : "z-0 bg-[#7dd3fc] text-[var(--cl-ink)]"
      }`}
    >
      <div
        data-track
        className="flex w-max items-center py-[0.32em] text-[clamp(2.2rem,5.6vw,5.4rem)]"
      >
        {Array.from({ length: COPIES }, (_, c) =>
          words.map((w, i) => (
            <span key={`${c}-${i}`} className="flex items-center">
              <span
                className={`cl-display px-[0.45em] leading-none whitespace-nowrap ${front ? "" : "cl-ribbon-outline"}`}
              >
                {w}
              </span>
              <Star className={front ? "text-white/90" : "text-[#1d4ed8]"} />
            </span>
          )),
        )}
      </div>
    </div>
  );
}

export function ServiceRibbons() {
  const root = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(root);
      const [front, back] = [
        q("[data-tape='front']")[0],
        q("[data-tape='back']")[0],
      ] as HTMLElement[];

      // the X: final tilt of each tape, both centred on the band's middle line
      gsap.set(front, { yPercent: -50, rotation: -6 });
      gsap.set(back, { yPercent: -50, rotation: 5 });
      if (reduced) return;

      // entering: tapes start flat and apart, then swing into the X
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "center center",
            scrub: 0.8,
          },
        })
        .fromTo(front, { rotation: 0, y: -30 }, { rotation: -6, y: 0, ease: "none" }, 0)
        .fromTo(back, { rotation: 0, y: 30 }, { rotation: 5, y: 0, ease: "none" }, 0);

      // drift: each tape loops one copy-width; scroll velocity adds speed and sets direction
      const tracks = [
        { el: front.querySelector<HTMLElement>("[data-track]")!, dir: -1, x: 0 },
        { el: back.querySelector<HTMLElement>("[data-track]")!, dir: 1, x: 0 },
      ];
      const stars = q("[data-star]") as HTMLElement[];
      let scrollDir = 1;
      let boost = 0;
      let hover = 1; // eased toward 0.2 while hovered
      let hoverTarget = 1;
      let spin = 0;

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          // only a real scroll flips direction — smooth-scroll settling reports tiny ± jitter
          if (Math.abs(v) > 60) scrollDir = v > 0 ? 1 : -1;
          boost = Math.max(boost, Math.min(Math.abs(v) / 90, 22));
        },
      });

      const tick = (_t: number, dtMs: number) => {
        if (!st.isActive) return;
        const dt = Math.min(dtMs, 64) / 1000;
        boost *= 0.92;
        hover += (hoverTarget - hover) * 0.08;
        const speed = (70 + boost * 40) * hover; // px per second
        for (const t of tracks) {
          const copy = t.el.scrollWidth / COPIES;
          if (!copy) continue;
          t.x = gsap.utils.wrap(-copy, 0, t.x + t.dir * scrollDir * speed * dt);
          gsap.set(t.el, { x: t.x });
        }
        spin += scrollDir * speed * dt * 0.9;
        gsap.set(stars, { rotation: spin });
      };
      gsap.ticker.add(tick);

      const el = root.current!;
      const enter = () => (hoverTarget = 0.2);
      const leave = () => (hoverTarget = 1);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);

      return () => {
        gsap.ticker.remove(tick);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  return (
    <a
      ref={root}
      href="#services"
      aria-label="See all services"
      data-cursor="See services"
      className="cl-ribbons relative z-10 block h-[clamp(150px,15vw,230px)] overflow-x-clip"
    >
      <div aria-hidden>
        <Tape words={ribbonPromises} variant="back" />
        <Tape words={marqueeWords} variant="front" />
      </div>
    </a>
  );
}
