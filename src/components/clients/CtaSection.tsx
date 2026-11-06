"use client";

/**
 * Closing call-to-action — "Let's build it together."
 *
 *  · deep-blue band with slow drifting light blobs and grain
 *  · the two headline lines slide apart as you scroll (one left, one right)
 *  · a magnetic round "Start a project" button with text orbiting the arrow
 *  · live chips: availability, reply time, and the local time in India
 */
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { clientsPage } from "@/data/clients";
import { profile } from "@/data/profile";

/** the current time where I am, ticking */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      timeZone: profile.timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const tick = () => setNow(fmt.format(new Date()).toUpperCase());
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={className}>
      {now || "—"} {profile.timezoneLabel}
    </span>
  );
}

const RING = "START A PROJECT • START A PROJECT • ";

export function CtaSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 };
      // the lines slide apart (desktop — on phones they'd leave the screen)
      if (matchMedia("(min-width: 1024px)").matches) {
        gsap.fromTo(
          q("[data-line='a']"),
          { xPercent: 6 },
          { xPercent: -6, ease: "none", scrollTrigger: st },
        );
        gsap.fromTo(
          q("[data-line='b']"),
          { xPercent: -4 },
          { xPercent: 8, ease: "none", scrollTrigger: st },
        );
      }
      gsap.from(q("[data-chip]"), {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="cl-cta"
      className="relative isolate overflow-hidden bg-[#1d4ed8] py-24 text-white sm:py-32"
    >
      {/* drifting light */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="cl-blob absolute -top-[30%] -left-[10%] h-[70vh] w-[70vh] rounded-full bg-[#38bdf8] opacity-50 blur-[110px]" />
        <span className="cl-blob cl-blob-2 absolute -right-[10%] -bottom-[40%] h-[80vh] w-[80vh] rounded-full bg-[#0b1120] opacity-60 blur-[120px]" />
        <span className="cl-blob cl-blob-3 absolute top-[20%] left-[40%] h-[45vh] w-[45vh] rounded-full bg-[#67e8f9] opacity-25 blur-[100px]" />
        <div className="cl-hero-grid absolute inset-0 opacity-40" />
        <div className="cl-grain" />
      </div>

      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <p className="text-[14px] font-semibold tracking-[0.04em] text-white/75">
          — Your project, next
        </p>

        <div className="mt-6 grid items-end gap-12 lg:grid-cols-[1fr_auto]">
          <h2
            id="cl-cta"
            className="cl-display text-[clamp(3.4rem,10.5vw,10.5rem)] leading-[0.86] tracking-[-0.05em]"
          >
            <span data-line="a" className="block whitespace-nowrap">
              Let&apos;s build
            </span>
            <span data-line="b" className="block whitespace-nowrap">
              it <span className="cl-cta-outline">together.</span>
            </span>
          </h2>

          {/* the button: text orbiting an arrow */}
          <span data-magnetic="0.4" className="inline-block justify-self-start lg:justify-self-end">
            <a
              href="#inquiry"
              data-cursor="Let's go"
              aria-label="Start a project"
              className="group relative flex h-44 w-44 items-center justify-center rounded-full bg-[var(--cl-ink)] text-white shadow-[0_30px_60px_-20px_rgba(11,17,32,0.7)] sm:h-52 sm:w-52"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100" />
              <svg
                aria-hidden
                viewBox="0 0 200 200"
                className="cl-ring absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]"
              >
                <defs>
                  <path
                    id="cl-ring-path"
                    d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
                  />
                </defs>
                <text
                  fontSize="13.5"
                  fontWeight="600"
                  letterSpacing="2.4"
                  className="fill-white transition-colors duration-500 group-hover:fill-[var(--cl-ink)]"
                >
                  <textPath href="#cl-ring-path" textLength="485">
                    {RING}
                  </textPath>
                </text>
              </svg>
              <span
                aria-hidden
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cl-accent)] text-[26px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-rotate-45"
              >
                →
              </span>
            </a>
          </span>
        </div>

        {/* live chips */}
        <ul className="mt-14 flex flex-wrap gap-3 text-[14px]">
          <li
            data-chip
            className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="cl-pulse absolute inset-0 rounded-full bg-[#4ade80]" />
              <span className="relative h-2 w-2 rounded-full bg-[#4ade80]" />
            </span>
            {clientsPage.availability}
          </li>
          <li
            data-chip
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur"
          >
            {clientsPage.responseTime}
          </li>
          <li
            data-chip
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur"
          >
            <span className="text-white/60">My time ·</span>
            <LiveClock className="font-semibold tabular-nums" />
          </li>
        </ul>
      </div>
    </section>
  );
}
