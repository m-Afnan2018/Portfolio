"use client";

/**
 * Hero for /work-with-me — "your business, running".
 *
 *  · background   a live WebGL aurora (HeroShader) that bends around the pointer
 *  · left         headline that rises in character by character, a rotating
 *                 promise word with an underline that draws per word, CTAs
 *  · right        LivePanel: a 3D dashboard of the client's future site, ticking
 *  · bottom       proof stats that count up
 *  · scroll out   copy, dashboard and background drift apart at different speeds
 * First visit per session is preceded by the blue counter curtain.
 */
import { useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { clientsPage, trustStats } from "@/data/clients";
import { HeroShader } from "./HeroShader";
import { LivePanel } from "./LivePanel";

const bookHref = clientsPage.bookingUrl || "#inquiry";
const bookExternal = Boolean(clientsPage.bookingUrl);

/** "20+" → [20, "+"], "2+ yrs" → [2, "+ yrs"], "35%" → [35, "%"] */
const parseStat = (v: string) => {
  const m = v.match(/^(\d+)(.*)$/);
  return m ? ([Number(m[1]), m[2]] as const) : ([null, v] as const);
};

export function ClientHero() {
  const root = useRef<HTMLElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(root);
      const rotator = q("[data-rotator] > span") as HTMLElement[];
      const rotLine = q("[data-rot-line]")[0];

      if (reduced) {
        gsap.set(rotator.slice(1), { autoAlpha: 0 });
        return;
      }

      // ── rotating promise word + underline that draws for each word ──
      gsap.set(rotator, { yPercent: 115 });
      gsap.set(rotator[0], { yPercent: 0 });
      gsap.set(rotLine, { scaleX: 0, transformOrigin: "left center" });
      const rot = gsap.timeline({ repeat: -1, paused: true });
      rotator.forEach((w, i) => {
        const next = rotator[(i + 1) % rotator.length];
        const at = i * 2.6;
        rot
          .set(rotLine, { transformOrigin: "left center" }, at)
          .to(rotLine, { scaleX: 1, duration: 1.1, ease: "expo.out" }, at)
          .set(rotLine, { transformOrigin: "right center" }, at + 1.7)
          .to(rotLine, { scaleX: 0, duration: 0.5, ease: "power3.in" }, at + 1.7)
          .to(w, { yPercent: -115, duration: 0.8, ease: "expo.inOut" }, at + 1.8)
          .fromTo(
            next,
            { yPercent: 115 },
            { yPercent: 0, duration: 0.8, ease: "expo.inOut", immediateRender: false },
            at + 1.8,
          );
      });

      // ── entrance ──
      const title = q("[data-hero-title]")[0] as HTMLElement;
      const split = SplitText.create(title, {
        type: "lines,chars",
        mask: "lines",
        linesClass: "cl-line",
      });
      gsap.set(split.chars, { yPercent: 120, rotate: 6 });
      gsap.set(title, { visibility: "visible" });
      gsap.set(q("[data-hero-in]"), { autoAlpha: 0, y: 30 });
      gsap.set(q("[data-chip-wrap]"), { autoAlpha: 0, y: 70, z: -160, rotationX: -18 });

      const counters = q("[data-hero-count]") as HTMLElement[];
      const enter = gsap.timeline({ paused: true, onComplete: () => void rot.play() });
      enter
        .to(split.chars, {
          yPercent: 0,
          rotate: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.016,
        })
        .to(
          q("[data-hero-in]"),
          { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.07 },
          0.3,
        )
        .to(
          q("[data-chip-wrap]"),
          {
            autoAlpha: 1,
            y: 0,
            z: 0,
            rotationX: 0,
            duration: 1.5,
            ease: "expo.out",
            stagger: 0.12,
          },
          0.45,
        );

      // proof stats count up once they're actually on screen (below the fold on phones)
      ScrollTrigger.create({
        trigger: q("[data-hero-stats]")[0],
        start: "top 95%",
        once: true,
        onEnter: () =>
          counters.forEach((el, i) => {
            el.textContent = "0";
            const n = { v: 0 };
            gsap.to(n, {
              v: Number(el.dataset.heroCount),
              duration: 1.8,
              delay: 0.7 + i * 0.08,
              ease: "power3.out",
              onUpdate: () => (el.textContent = String(Math.round(n.v))),
            });
          }),
      });

      // ── scroll out: layers part at different speeds ──
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        })
        .to(q("[data-hero-copy]"), { yPercent: 18, autoAlpha: 0.15, ease: "none" }, 0)
        .to(q("[data-panel-wrap]"), { yPercent: -22, scale: 0.92, ease: "none" }, 0)
        .to(q("[data-hero-bg]"), { yPercent: 25, scale: 1.12, autoAlpha: 0.45, ease: "none" }, 0)
        .to(q("[data-hero-stats]"), { autoAlpha: 0, y: 40, ease: "none" }, 0);

      // ── first-visit curtain ──
      const curtain = curtainRef.current;
      if (html.classList.contains("cl-intro") && curtain) {
        const counter = curtain.querySelector<HTMLElement>("[data-curtain-count]")!;
        const n = { v: 0 };
        gsap
          .timeline({
            onComplete: () => {
              html.classList.remove("cl-intro");
              try {
                sessionStorage.setItem("cl-intro", "1");
              } catch {}
              ScrollTrigger.refresh();
            },
          })
          .to(n, {
            v: 100,
            duration: 1.3,
            ease: "power2.inOut",
            onUpdate: () => (counter.textContent = String(Math.round(n.v))),
          })
          .to(
            curtain.querySelector("[data-curtain-inner]"),
            { yPercent: -40, autoAlpha: 0, duration: 0.6, ease: "power3.in" },
            "+=0.1",
          )
          .to(
            curtain,
            { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" },
            "-=0.25",
          )
          .add(() => {
            enter.play();
          }, "-=0.55");
      } else {
        enter.play();
      }
    },
    { scope: root },
  );

  return (
    <>
      {/* intro curtain (first visit per session) — outside the hero so it covers the header */}
      <div
        ref={curtainRef}
        aria-hidden
        className="cl-curtain fixed inset-0 z-[90] items-end justify-between bg-[var(--cl-accent)] p-6 text-white sm:p-10"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <div data-curtain-inner className="flex w-full items-end justify-between gap-6">
          <p className="cl-display max-w-[14ch] text-[clamp(1.6rem,4vw,3rem)] leading-[1]">
            Let&apos;s build something that works.
          </p>
          <p className="cl-display text-[clamp(4rem,14vw,12rem)] leading-[0.8] tabular-nums">
            <span data-curtain-count>0</span>
          </p>
        </div>
      </div>

      <section
        ref={root}
        id="cl-hero"
        aria-labelledby="cl-hero-title"
        className="cl-on-dark relative isolate overflow-hidden bg-[var(--cl-ink)] text-white"
      >
        {/* ── living background ── */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div data-hero-bg className="absolute inset-0">
            <div className="cl-hero-fallback absolute inset-0" />
            <HeroShader className="absolute inset-0 h-full w-full" />
          </div>
          <div className="cl-hero-grid absolute inset-0" />
          <div className="cl-grain" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--cl-ink)]" />
        </div>

        <div className="relative mx-auto grid min-h-[100svh] max-w-[1320px] grid-rows-[1fr_auto] px-5 pt-28 pb-8 sm:px-8 lg:pt-24">
          <div className="grid items-center gap-x-10 gap-y-24 pb-16 lg:grid-cols-12 lg:pb-10">
            {/* copy */}
            <div data-hero-copy className="lg:col-span-7">
              <p
                data-hero-in
                className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[13px] font-medium text-white/85 backdrop-blur"
              >
                <span className="relative flex h-2 w-2">
                  <span className="cl-pulse absolute inset-0 rounded-full bg-[#22c55e]" />
                  <span className="relative h-2 w-2 rounded-full bg-[#22c55e]" />
                </span>
                {clientsPage.availability}
              </p>

              <h1
                id="cl-hero-title"
                className="cl-display mt-7 text-[clamp(2.9rem,6.4vw,6.6rem)] leading-[0.94]"
              >
                <span data-hero-title className="block max-w-[10.5ch]">
                  {clientsPage.headline}
                </span>
                <span className="mt-[0.06em] block">
                  <span data-hero-in className="inline-block text-white/45">
                    {clientsPage.headlineAccent}
                  </span>
                </span>
                <span data-hero-in className="relative inline-block">
                  <span data-rotator className="cl-rotator">
                    {clientsPage.rotatingWords.map((w, i) => (
                      <span key={w} aria-hidden={i > 0} className="cl-hero-grad">
                        {w}
                      </span>
                    ))}
                  </span>
                  <span
                    data-rot-line
                    aria-hidden
                    className="absolute -bottom-[0.02em] left-0 h-[0.07em] w-full rounded-full bg-gradient-to-r from-[#2563eb] via-[#38bdf8] to-[#67e8f9]"
                  />
                </span>
              </h1>

              {/* CSS entrances (not GSAP): this copy is the page's main content, so it
                  starts rising the moment the page paints instead of after hydration */}
              <p
                className="cl-rise mt-8 max-w-[34rem] text-[clamp(1.02rem,1.35vw,1.15rem)] leading-relaxed text-white/65 [--d:0.55s]"
              >
                {clientsPage.intro}
              </p>
              <div className="cl-rise mt-9 flex flex-wrap items-center gap-3 [--d:0.65s]">
                <span data-magnetic="0.3" className="inline-block">
                  <a href="#inquiry" className="cl-btn cl-btn-primary cl-btn-glow">
                    Get a free quote{" "}
                    <span className="cl-btn-arrow" aria-hidden>
                      →
                    </span>
                  </a>
                </span>
                <span data-magnetic="0.3" className="inline-block">
                  <a
                    href={bookHref}
                    {...(bookExternal ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="cl-btn cl-btn-ghost"
                  >
                    Book a 20-min call
                  </a>
                </span>
              </div>
            </div>

            {/* live dashboard */}
            <div data-panel-wrap className="lg:col-span-5 lg:pl-6">
              <LivePanel />
            </div>
          </div>

          {/* proof */}
          <dl
            data-hero-stats
            className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-4"
          >
            {trustStats.map((s, i) => {
              const [num, suffix] = parseStat(s.value);
              return (
                <div
                  key={s.label}
                  className="cl-rise flex flex-col-reverse justify-end"
                  style={{ "--d": `${0.75 + i * 0.07}s` } as CSSProperties}
                >
                  <dt className="mt-2 max-w-[22ch] text-[13px] leading-snug text-white/50">
                    {s.label}
                  </dt>
                  <dd className="cl-display text-[clamp(1.8rem,2.8vw,2.5rem)] leading-none tabular-nums">
                    {num === null ? (
                      suffix
                    ) : (
                      <>
                        <span data-hero-count={num}>{num}</span>
                        <span className="text-[#7dd3fc]">{suffix}</span>
                      </>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>
    </>
  );
}
