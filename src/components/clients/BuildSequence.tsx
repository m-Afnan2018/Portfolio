"use client";

/**
 * BuildSequence — "Watch your website get built."
 *
 * A pinned, centred scene. As you scroll, a browser in the middle builds a
 * website in front of you, one stage per process step, while around it:
 *   · a day counter rolls from DAY 01 to DAY 30
 *   · the stage's name drifts past behind the browser in giant outlined type
 *   · the browser starts tilted back and flattens as the site comes together
 *   · small moments float in beside it: the client's first message, the
 *     approved quote, a design comment that gets resolved, the first enquiry,
 *     the nightly backup
 *   · a five-stop timeline along the bottom fills, captioning the current step
 *
 * Stages inside the browser:
 *   1 brief     a sticky note with the client's goals
 *   2 proposal  dashed wireframe blocks draw themselves
 *   3 build     blocks fill with real design while code types in a panel
 *   4 launch    the URL types itself, padlock + "Live" pop, confetti
 *   5 care      an uptime dashboard slides up and its graph draws
 *
 * Without motion (or JS) the markup already shows the finished, live site.
 */
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { buildDemo, buildMoments, process } from "@/data/clients";

const CONFETTI = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2;
  const r = 80 + (i % 3) * 30;
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r * 0.7,
    c: ["#2563eb", "#38bdf8", "#22c55e", "#22d3ee", "#fbbf24"][i % 5],
    rot: i * 47,
  };
});

const pad = (n: number) => String(n).padStart(2, "0");

export function BuildSequence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      const el = root.current!;
      const url = q("[data-b='url']")[0] as HTMLElement;
      const spark = el.querySelector<SVGPathElement>("[data-b='spark']")!;
      const sparkLen = spark.getTotalLength();
      const bits = q("[data-b='confetti'] > span") as HTMLElement[];
      const words = q("[data-word]") as HTMLElement[];
      const day = q("[data-day]")[0] as HTMLElement;
      const stops = q("[data-stop]") as HTMLElement[];
      const caps = q("[data-cap]") as HTMLElement[];
      const fill = q("[data-fill]")[0];

      // ── start from a blank page ──
      gsap.set(q("[data-b='skin']"), { autoAlpha: 0 });
      gsap.set(q(".cl-wire"), { autoAlpha: 1, scaleX: 0, transformOrigin: "left center" });
      gsap.set(q("[data-b='note']"), { autoAlpha: 0, y: 40, rotation: -8, scale: 0.9 });
      gsap.set(q("[data-b='code']"), { autoAlpha: 0, xPercent: 30 });
      gsap.set(q("[data-b='codeline']"), { clipPath: "inset(0 100% 0 0)" });
      gsap.set(q("[data-b='lock'], [data-b='live']"), { autoAlpha: 0, scale: 0.4 });
      gsap.set(q("[data-b='dash']"), { autoAlpha: 0, yPercent: 40 });
      gsap.set(q("[data-b='status']"), { autoAlpha: 0, x: -10 });
      gsap.set(q("[data-b='pin']"), { autoAlpha: 0, scale: 0.6, transformOrigin: "left top" });
      gsap.set(q("[data-b='resolved']"), { autoAlpha: 0 });
      gsap.set(bits, { autoAlpha: 0, x: 0, y: 0, scale: 0 });
      gsap.set(spark, { strokeDasharray: sparkLen, strokeDashoffset: sparkLen });
      gsap.set(q("[data-b='cursor']"), { autoAlpha: 1 });
      gsap.set(q("[data-float]"), { autoAlpha: 0, y: 30, scale: 0.94 });
      gsap.set(q("[data-stamp]"), { autoAlpha: 0, scale: 2.2, rotation: -24 });
      gsap.set(words, { autoAlpha: 0, xPercent: 18 });
      gsap.set(q("[data-tilt]"), {
        rotationX: 26,
        scale: 0.86,
        y: 30,
        transformPerspective: 1400,
        transformOrigin: "50% 100%",
      });
      gsap.set(fill, { scaleX: 0 });
      day.textContent = pad(1);
      url.textContent = "about:blank";

      const steps = process.length;
      const setStep = (i: number) => {
        stops.forEach((s, k) => (s.dataset.state = k < i ? "done" : k === i ? "active" : "todo"));
        caps.forEach((c, k) => (c.dataset.active = String(k === i)));
      };
      setStep(0);

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: q("[data-pin]")[0],
          start: "top top",
          end: () => `+=${window.innerHeight * 4.6}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setStep(Math.min(steps - 1, Math.floor(self.progress * steps * 0.999)));
            gsap.set(fill, { scaleX: self.progress });
          },
        },
      });

      // ── backdrop word + day counter, per stage ──
      words.forEach((w, i) => {
        tl.to(w, { autoAlpha: 1, xPercent: 0, duration: 0.25, ease: "power2.out" }, i)
          .to(w, { xPercent: -10, duration: 0.6, ease: "none" }, i + 0.25)
          .to(w, { autoAlpha: 0, xPercent: -18, duration: 0.15, ease: "power2.in" }, i + 0.85);
      });
      const d = { v: 1 };
      buildMoments.forEach((m, i) => {
        const long = i === 2; // the build itself takes most of the days
        tl.to(
          d,
          {
            v: m.day,
            duration: long ? 0.85 : 0.3,
            ease: "none",
            onUpdate: () => (day.textContent = pad(Math.round(d.v))),
          },
          i + (long ? 0 : 0.05),
        );
      });

      // ── floating moments: in early in each stage, out before the next ──
      buildMoments.forEach((_, i) => {
        const f = q(`[data-float='${i}']`);
        tl.to(
          f,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.2, stagger: 0.12, ease: "back.out(1.6)" },
          i + 0.12,
        ).to(f, { autoAlpha: 0, y: -20, duration: 0.12, ease: "power2.in" }, i + 0.86);
      });

      // ── the browser flattens as the site comes together ──
      tl.to(
        q("[data-tilt]"),
        { rotationX: 0, scale: 1, y: 0, duration: 2.2, ease: "power2.inOut" },
        0,
      );

      // 1 · brief
      tl.to(
        q("[data-b='note']"),
        { autoAlpha: 1, y: 0, rotation: -3, scale: 1, duration: 0.45 },
        0.1,
      ).from(
        q("[data-b='noteitem']"),
        { autoAlpha: 0, x: -12, stagger: 0.12, duration: 0.3 },
        0.35,
      );

      // 2 · proposal / wireframe
      tl.to(
        q("[data-b='note']"),
        { autoAlpha: 0, y: -30, rotation: 4, scale: 0.85, duration: 0.35 },
        1.0,
      )
        .to(q("[data-b='cursor']"), { autoAlpha: 0, duration: 0.1 }, 1.0)
        .to(q(".cl-wire"), { scaleX: 1, duration: 0.5, stagger: 0.07, ease: "power2.inOut" }, 1.1)
        .to(
          q("[data-stamp]"),
          { autoAlpha: 1, scale: 1, rotation: -10, duration: 0.18, ease: "back.out(2.4)" },
          1.45,
        );

      // 3 · design & build — then a design comment, resolved
      tl.to(q("[data-b='skin']"), { autoAlpha: 1, duration: 0.35, stagger: 0.06 }, 2.0)
        .to(q(".cl-wire"), { autoAlpha: 0, duration: 0.3, stagger: 0.04 }, 2.15)
        .to(q("[data-b='code']"), { autoAlpha: 1, xPercent: 0, duration: 0.35 }, 2.25)
        .to(
          q("[data-b='codeline']"),
          { clipPath: "inset(0 0% 0 0)", duration: 0.12, stagger: 0.06, ease: "none" },
          2.4,
        )
        .to(q("[data-b='code']"), { autoAlpha: 0, xPercent: 20, duration: 0.25 }, 2.8)
        .to(
          q("[data-b='pin']"),
          { autoAlpha: 1, scale: 1, duration: 0.15, ease: "back.out(2)" },
          2.45,
        )
        .to(q("[data-b='logo']"), { scale: 1.25, duration: 0.15, ease: "back.out(2)" }, 2.7)
        .to(q("[data-b='resolved']"), { autoAlpha: 1, duration: 0.1 }, 2.72)
        .to(q("[data-b='pin']"), { autoAlpha: 0, scale: 0.8, duration: 0.12 }, 2.9);

      // 4 · launch
      tl.to(
        url,
        {
          duration: 0.45,
          scrambleText: { text: buildDemo.domain, chars: "lowerCase", speed: 0.6 },
          ease: "none",
        },
        3.0,
      )
        .to(
          q("[data-b='lock']"),
          { autoAlpha: 1, scale: 1, duration: 0.2, ease: "back.out(3)" },
          3.45,
        )
        .to(
          q("[data-b='live']"),
          { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(3)" },
          3.5,
        )
        .to(q("[data-tilt]"), { scale: 1.035, duration: 0.15, ease: "power2.out" }, 3.5)
        .to(q("[data-tilt]"), { scale: 1, duration: 0.3, ease: "power2.inOut" }, 3.65)
        .to(bits, { autoAlpha: 1, scale: 1, duration: 0.12, stagger: 0.005 }, 3.5);
      CONFETTI.forEach((c, i) => {
        tl.to(
          bits[i],
          { x: c.x, y: c.y, rotation: c.rot, duration: 0.4, ease: "power2.out" },
          3.52,
        );
      });
      tl.to(bits, { autoAlpha: 0, duration: 0.2 }, 3.85);

      // 5 · care
      tl.to(q("[data-b='dash']"), { autoAlpha: 1, yPercent: 0, duration: 0.35 }, 4.0)
        .to(spark, { strokeDashoffset: 0, duration: 0.6, ease: "none" }, 4.15)
        .to(q("[data-b='status']"), { autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.25 }, 4.3)
        .to({}, { duration: 0.3 }, 4.8);
    },
    { scope: root },
  );

  const float =
    "cl-glass cl-glass-strong pointer-events-none absolute z-20 hidden rounded-[16px] px-4 py-3 text-[13px] leading-snug opacity-0 lg:block";

  return (
    <section
      ref={root}
      id="process"
      aria-labelledby="cl-process"
      className="scroll-mt-16 bg-[var(--cl-ink)] text-white"
    >
      <div data-pin className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="cl-stage-bg absolute inset-0"
            style={{ "--glow": "#2563eb" } as CSSProperties}
          />
          <div className="cl-hero-grid absolute inset-0 opacity-50" />
          <div className="cl-grain" />
        </div>

        {/* ── header row: title + day counter ── */}
        <div className="relative mx-auto flex w-full max-w-[1320px] items-end justify-between gap-6 px-5 pt-24 sm:px-8 lg:pt-[10vh]">
          <div>
            <p className="cl-eyebrow !text-[#38bdf8]">How it works</p>
            <h2
              id="cl-process"
              className="cl-display mt-3 text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1]"
            >
              Watch your website get built.
            </h2>
          </div>
          <p className="shrink-0 text-right" aria-hidden>
            <span className="block font-mono text-[11px] tracking-[0.2em] text-white/45 uppercase">
              Day
            </span>
            <span
              data-day
              className="cl-display block text-[clamp(2.6rem,5.4vw,5rem)] leading-[0.9] tabular-nums"
            >
              {pad(buildMoments[buildMoments.length - 1].day)}
            </span>
          </p>
        </div>

        {/* ── centre: giant word behind, browser in front, moments beside ── */}
        <div className="relative flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden items-center justify-center overflow-hidden md:flex"
          >
            {buildMoments.map((m) => (
              <span
                key={m.word}
                data-word
                className="cl-display cl-build-word absolute text-[clamp(6rem,22vw,22rem)] leading-none whitespace-nowrap opacity-0"
              >
                {m.word}
              </span>
            ))}
          </div>

          <div className="relative w-full max-w-[720px] lg:max-w-[min(52vw,calc((100svh-440px)*1.45))]">
            {/* floating moments (desktop) */}
            <div
              data-float="0"
              className={`${float} top-[12%] -left-[30%] max-w-[250px] rounded-bl-[4px]`}
            >
              <span className="mb-1 block text-[11px] text-white/45">New message · client</span>
              {buildMoments[0].left}
            </div>
            <div
              data-float="0"
              className={`${float} top-[34%] -right-[24%] max-w-[210px] rounded-br-[4px] !bg-[#2563eb]`}
            >
              {buildMoments[0].right}
            </div>

            <div data-float="1" className={`${float} top-[18%] -left-[31%] w-[240px]`}>
              <span className="block text-[11px] text-white/45">Proposal · PDF</span>
              <span className="mt-1 block font-semibold">{buildMoments[1].left}</span>
              <span className="mt-3 block h-1.5 w-[80%] rounded-full bg-white/15" />
              <span className="mt-1.5 block h-1.5 w-[60%] rounded-full bg-white/15" />
              <span
                data-stamp
                className="absolute -right-6 -bottom-5 rounded-[8px] border-2 border-[#4ade80] bg-[#0b1120] px-2.5 py-1 text-[13px] font-bold tracking-wide text-[#4ade80] uppercase"
              >
                {buildMoments[1].right}
              </span>
            </div>

            <div data-float="2" className={`${float} top-[14%] -left-[28%] max-w-[240px]`}>
              <span className="mb-1 block text-[11px] text-white/45">
                Preview link · updates live
              </span>
              <span className="font-mono text-[12px] text-[#7dd3fc]">{buildMoments[2].left}</span>
            </div>

            <div
              data-float="3"
              className={`${float} top-[20%] -left-[29%] max-w-[230px] !bg-[#16a34a]/90`}
            >
              <span className="mb-1 block text-[11px] text-white/75">
                Contact form · 2 hours after launch
              </span>
              {buildMoments[3].left}
            </div>
            <div
              data-float="3"
              className={`${float} top-[40%] -right-[22%] !flex items-center gap-3 max-lg:!hidden`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-[5px] border-[#4ade80] text-[15px] font-bold">
                98
              </span>
              <span className="text-[12px] text-white/70">
                Performance
                <br />
                score
              </span>
            </div>

            <div data-float="4" className={`${float} top-[16%] -left-[27%] max-w-[220px]`}>
              <span className="mb-1 block text-[11px] text-white/45">Email · 1 Dec</span>
              {buildMoments[4].left} ✓
            </div>
            <div data-float="4" className={`${float} top-[46%] -right-[24%] max-w-[220px]`}>
              <span className="text-[#4ade80]">●</span> {buildMoments[4].right}
            </div>

            {/* the browser */}
            <div data-tilt className="cl-browser relative" aria-hidden>
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 font-mono text-[12px] text-white/70">
                  <svg
                    data-b="lock"
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 shrink-0 text-[#4ade80]"
                    fill="currentColor"
                  >
                    <path d="M4 7V5a4 4 0 1 1 8 0v2h.5A1.5 1.5 0 0 1 14 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5v-5A1.5 1.5 0 0 1 3.5 7H4Zm2 0h4V5a2 2 0 1 0-4 0v2Z" />
                  </svg>
                  <span data-b="url" className="truncate">
                    {buildDemo.domain}
                  </span>
                </div>
                <span
                  data-b="live"
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#22c55e]/15 px-2.5 py-1 text-[11px] font-semibold text-[#4ade80]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" /> Live
                </span>
              </div>

              {/* viewport */}
              <div className="relative aspect-[16/10] bg-[#f8fafc] text-[var(--cl-ink)]">
                <span
                  data-b="cursor"
                  className="absolute top-[8%] left-[6%] h-5 w-[2px] animate-pulse bg-[var(--cl-ink)] opacity-0"
                />

                {/* the site */}
                <div className="absolute inset-0 flex flex-col gap-[3.5%] p-[4.5%]">
                  <div className="relative h-[8%]">
                    <div className="cl-wire" />
                    <div data-b="skin" className="flex h-full items-center justify-between">
                      <span className="cl-display flex items-center gap-1.5 text-[clamp(10px,1.2vw,15px)]">
                        <span
                          data-b="logo"
                          className="mr-[0.15em] h-[1.1em] w-[1.1em] rounded-[4px] bg-[var(--cl-accent)]"
                        />
                        {buildDemo.siteName}
                      </span>
                      <span className="flex items-center gap-[1.4vw] text-[clamp(7px,0.8vw,11px)] text-[var(--cl-muted)]">
                        <span>Services</span>
                        <span>About</span>
                        <span className="rounded-full bg-[var(--cl-ink)] px-[0.9em] py-[0.35em] text-white">
                          Contact
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="grid h-[44%] grid-cols-2 gap-[4%]">
                    <div className="relative">
                      <div className="cl-wire" />
                      <div data-b="skin" className="flex h-full flex-col justify-center">
                        <span className="text-[clamp(6px,0.7vw,10px)] font-semibold tracking-wider text-[var(--cl-accent-ink)] uppercase">
                          Welcome
                        </span>
                        <p className="cl-display mt-[0.4em] text-[clamp(14px,2.3vw,34px)] leading-[0.95]">
                          {buildDemo.siteHeadline[0]}
                          <br />
                          {buildDemo.siteHeadline[1]}
                        </p>
                        <span className="mt-[0.9em] w-fit rounded-full bg-[var(--cl-accent)] px-[1em] py-[0.5em] text-[clamp(7px,0.8vw,11px)] font-semibold text-white">
                          Book a visit →
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="cl-wire" />
                      <div
                        data-b="skin"
                        className="relative h-full overflow-hidden rounded-[10px] bg-gradient-to-br from-[#2563eb] via-[#38bdf8] to-[#a5f3fc]"
                      >
                        <div className="absolute bottom-[10%] left-[10%] h-[34%] w-[46%] rounded-[8px] bg-white/85 shadow-lg" />
                        <div className="absolute top-[14%] right-[12%] h-[28%] w-[28%] rounded-full bg-white/30" />
                      </div>
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-3 gap-[3%]">
                    {["Fast", "Mobile-ready", "Easy to edit"].map((t, i) => (
                      <div key={t} className="relative">
                        <div className="cl-wire" />
                        <div
                          data-b="skin"
                          className="flex h-full flex-col justify-end rounded-[10px] bg-white p-[8%] shadow-[0_1px_0_rgba(0,0,0,0.06),0_8px_20px_-12px_rgba(0,0,0,0.25)]"
                        >
                          <span
                            className={`mb-auto h-[22%] w-[22%] rounded-[6px] ${["bg-[var(--cl-accent)]", "bg-[var(--cl-ink)]", "bg-[#38bdf8]"][i]}`}
                          />
                          <span className="text-[clamp(8px,0.95vw,13px)] font-semibold">{t}</span>
                          <span className="mt-[4%] h-[6%] w-[80%] rounded bg-black/10" />
                          <span className="mt-[3%] h-[6%] w-[55%] rounded bg-black/10" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* design comment pin on the logo */}
                <div
                  data-b="pin"
                  className="absolute top-[4%] left-[24%] z-10 flex items-start gap-1.5 opacity-0"
                >
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full rounded-tl-none bg-[var(--cl-accent)] text-[10px] font-bold text-white shadow-lg">
                    Y
                  </span>
                  <span className="rounded-[10px] bg-white px-2.5 py-1.5 text-[clamp(8px,0.9vw,12px)] font-medium shadow-[0_10px_24px_-10px_rgba(11,17,32,0.5)]">
                    {buildMoments[2].right}
                    <span data-b="resolved" className="ml-1.5 font-semibold text-[#16a34a]">
                      Resolved ✓
                    </span>
                  </span>
                </div>

                {/* brief sticky note */}
                <div
                  data-b="note"
                  className="absolute top-[22%] left-[27%] w-[46%] rounded-[6px] bg-[#dbeafe] p-[3%] text-[#1e3a8a] opacity-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)]"
                >
                  <p className="text-[clamp(9px,1.05vw,14px)] font-bold">{buildDemo.brief.title}</p>
                  <ul className="mt-[0.6em] space-y-[0.4em] text-[clamp(8px,0.95vw,13px)]">
                    {buildDemo.brief.items.map((it) => (
                      <li key={it} data-b="noteitem">
                        ✓ {it}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* code panel */}
                <div
                  data-b="code"
                  className="absolute right-[4%] bottom-[6%] w-[52%] rounded-[10px] bg-[#0c1324] p-[2.5%] font-mono text-[clamp(7px,0.85vw,12px)] leading-[1.6] text-[#e2e8f0] opacity-0 shadow-2xl"
                >
                  {buildDemo.code.map((l, i) => (
                    <div key={i} data-b="codeline" className="whitespace-pre">
                      <span className="mr-[1.2em] text-white/30">{i + 1}</span>
                      <span
                        className={
                          i === 0 || i === buildDemo.code.length - 1
                            ? "text-[#c4b5fd]"
                            : l.includes("<")
                              ? "text-[#38bdf8]"
                              : ""
                        }
                      >
                        {l}
                      </span>
                    </div>
                  ))}
                </div>

                {/* confetti */}
                <div data-b="confetti" className="pointer-events-none absolute top-[40%] left-1/2">
                  {CONFETTI.map((c, i) => (
                    <span
                      key={i}
                      className="absolute h-2 w-1.5 rounded-[1px] opacity-0"
                      style={{ background: c.c }}
                    />
                  ))}
                </div>

                {/* care dashboard */}
                <div
                  data-b="dash"
                  className="absolute bottom-[5%] left-[4%] w-[48%] rounded-[12px] bg-[var(--cl-ink)] p-[3%] text-white shadow-[0_24px_48px_-16px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-center justify-between text-[clamp(8px,0.9vw,12px)]">
                    <span className="font-semibold">Uptime · last 30 days</span>
                    <span className="text-[#4ade80]">●</span>
                  </div>
                  <svg viewBox="0 0 200 40" className="mt-[4%] h-auto w-full" fill="none">
                    <path
                      data-b="spark"
                      d="M0 30 L20 26 L40 28 L60 18 L80 22 L100 12 L120 16 L140 8 L160 12 L180 6 L200 9"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <ul className="mt-[3%] space-y-[0.3em] text-[clamp(7px,0.8vw,11px)] text-white/70">
                    {buildDemo.status.map((s) => (
                      <li key={s} data-b="status">
                        ✓ {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── timeline ── */}
        <div className="relative mx-auto w-full max-w-[1320px] px-5 pb-10 sm:px-8 lg:pb-[6vh]">
          <ol className="relative grid grid-cols-5">
            <span
              aria-hidden
              className="absolute top-[13px] right-[10%] left-[10%] h-px bg-white/15"
            >
              <span
                data-fill
                className="block h-full w-full origin-left bg-gradient-to-r from-[#2563eb] to-[#67e8f9]"
              />
            </span>
            {process.map((p, i) => (
              <li
                key={p.title}
                data-stop
                data-state="done"
                className="cl-stop relative flex flex-col items-center text-center"
              >
                <span className="cl-stop-dot relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-[var(--cl-ink)] font-mono text-[11px] transition-all duration-300">
                  {i + 1}
                </span>
                <span className="cl-stop-label mt-2.5 text-[12px] font-semibold transition-colors duration-300 sm:text-[14px]">
                  {p.title}
                </span>
              </li>
            ))}
          </ol>
          <div className="relative mt-4 grid min-h-[3em] text-center">
            {process.map((p, i) => (
              <p
                key={p.title}
                data-cap
                data-active={i === process.length - 1}
                className="cl-cap mx-auto max-w-xl text-[14px] leading-relaxed text-white/60 [grid-area:1/1] sm:text-[15px]"
              >
                {p.body}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
