"use client";

/**
 * "Why work with me" — the argument, shown rather than told.
 *
 *  · headline     "…without the agency runaround." — a strike draws through
 *                 the runaround as you scroll
 *  · comparison   two diagrams drawn by the scroll: the agency path relays
 *                 through five hand-offs (with revision loops) while a request
 *                 crawls along it and a ticket's wait climbs; the
 *                 direct path is one clean line with a pulse running along it.
 *                 Counters underneath compare people / invoices / turnaround.
 *  · reasons      four cards, each with a small looping scene of its own
 */
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { agencyVsMe, reasons } from "@/data/clients";
import { BrandMark } from "@/components/brand/BrandMark";

/*
 * agency diagram (viewBox 520×300): a U-shaped relay — across the top, down,
 * and all the way back — so "your site" ends up next to where you started.
 * Hops sit on the path; the request disappears into each one for a while.
 */
const PILL_W = 124;
const HOPS = [
  { x: 150, y: 70, status: "forwarded" },
  { x: 290, y: 70, status: "in review" },
  { x: 430, y: 70, status: "queued" },
  { x: 430, y: 215, status: "ticket open" },
  { x: 290, y: 215, status: "awaiting reply" },
];
const RELAY = "M48 70 H406 Q430 70 430 94 V191 Q430 215 406 215 H128";
const LOOPS = [
  { d: "M412 52 C 392 14, 328 14, 308 52", label: "revisions ×3", lx: 360, ly: 22 },
  { d: "M330 197 C 372 162, 440 150, 462 92", label: "escalated", lx: 372, ly: 160 },
];
const STRAIGHT = "M30 150 H490";

/* ── reason scenes ─────────────────────────────────────────────────────── */
function OrbitScene() {
  return (
    <div className="relative mx-auto h-[150px] w-[150px]">
      <div className="absolute inset-[18px] rounded-full border border-dashed border-[var(--cl-accent)]/30" />
      <div className="cl-orbit absolute inset-0">
        {["Design", "Code", "Server"].map((t, i) => (
          <span
            key={t}
            className="absolute top-1/2 left-1/2 h-0 w-0"
            style={{ transform: `rotate(${i * 120}deg) translateY(-62px)` }}
          >
            <span
              className="cl-orbit-counter block h-0 w-0"
              style={{ "--r": `${-i * 120}deg` } as CSSProperties}
            >
              <span className="block w-max -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap shadow-[0_6px_16px_-6px_rgba(11,17,32,0.3)]">
                {t}
              </span>
            </span>
          </span>
        ))}
      </div>
      <BrandMark
        size={56}
        className="absolute inset-0 m-auto !rounded-full shadow-[0_10px_30px_-8px_rgba(37,99,235,0.7)]"
      />
    </div>
  );
}

function OwnScene() {
  return (
    <ul className="mx-auto w-full max-w-[220px] space-y-2.5">
      {["Domain", "Hosting", "Code"].map((t, i) => (
        <li
          key={t}
          className="flex items-center justify-between rounded-[12px] bg-white px-3 py-2 text-[13px] font-medium shadow-[0_6px_16px_-10px_rgba(11,17,32,0.35)]"
        >
          {t}
          <span className="relative flex h-6 w-[92px] items-center rounded-full bg-[var(--cl-soft)] text-[10px] font-semibold">
            <span
              className="cl-own-knob absolute top-0.5 left-0.5 h-5 w-[44px] rounded-full"
              style={{ animationDelay: `${i * 0.35}s` }}
            />
            <span className="relative z-10 w-1/2 text-center text-[var(--cl-muted)]">Agency</span>
            <span
              className="cl-own-you relative z-10 w-1/2 text-center"
              style={{ animationDelay: `${i * 0.35}s` }}
            >
              You
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function LiveScene() {
  return (
    <div className="mx-auto w-full max-w-[220px]">
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className={`aspect-square rounded-full ${i < 21 ? "cl-live-dot bg-[#22c55e]" : "bg-[var(--cl-rule)]"}`}
            style={{ animationDelay: `${(i * 0.37) % 2.4}s` }}
          />
        ))}
      </div>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="cl-display text-[34px] leading-none">20+</span>
        <span className="text-[12px] text-[var(--cl-muted)]">sites live right now</span>
      </p>
    </div>
  );
}

function WeeksScene() {
  return (
    <div className="mx-auto w-full max-w-[240px]">
      <div className="relative h-[86px]">
        <span className="cl-bubble absolute top-0 left-[4%] rounded-[10px] rounded-bl-[3px] bg-white px-2.5 py-1.5 text-[11px] font-medium shadow-[0_6px_16px_-8px_rgba(11,17,32,0.35)]">
          Preview link is live ✓
        </span>
        <span className="cl-bubble cl-bubble-2 absolute top-[40px] right-0 rounded-[10px] rounded-br-[3px] bg-[var(--cl-accent)] px-2.5 py-1.5 text-[11px] font-medium text-white shadow-[0_6px_16px_-8px_rgba(37,99,235,0.6)]">
          Week 3 update: checkout done
        </span>
      </div>
      <div className="mt-2">
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--cl-rule)]">
          <span className="cl-weeks-fill block h-full origin-left rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8]" />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-[var(--cl-muted)]">
          {["W1", "W2", "W3", "W4", "W5", "W6"].map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const SCENES = [OrbitScene, OwnScene, LiveScene, WeeksScene];

/* ── section ───────────────────────────────────────────────────────────── */
export function WhySection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const strike = q("[data-strike]");
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(strike, { scaleX: 1 });
        return;
      }

      // strike through "the agency runaround"
      gsap.fromTo(
        strike,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: strike[0], start: "top 80%", end: "top 45%", scrub: 0.6 },
        },
      );

      // both diagrams draw with the scroll; the agency ticket's wait climbs alongside
      const tangle = root.current!.querySelector<SVGPathElement>("[data-tangle]")!;
      const straight = root.current!.querySelector<SVGPathElement>("[data-straight]")!;
      const tl = tangle.getTotalLength();
      const sl = straight.getTotalLength();
      const wait = q("[data-wait]")[0] as HTMLElement;
      gsap.set(tangle, { strokeDasharray: tl, strokeDashoffset: tl });
      gsap.set(straight, { strokeDasharray: sl, strokeDashoffset: sl });
      gsap.set(q("[data-loop]"), { autoAlpha: 0 });
      gsap.set([...q("[data-hop]"), ...q("[data-me-node]")], {
        scale: 0,
        transformOrigin: "center",
        transformBox: "fill-box",
      });

      const waitN = { v: 1 };
      const draw = gsap.timeline({
        scrollTrigger: {
          trigger: q("[data-compare]")[0],
          start: "top 75%",
          end: "center 40%",
          scrub: 0.8,
        },
      });
      draw
        .to(tangle, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0)
        .to(q("[data-hop]"), { scale: 1, ease: "back.out(2)", duration: 0.12, stagger: 0.17 }, 0.05)
        .to(q("[data-loop]"), { autoAlpha: 1, duration: 0.15, stagger: 0.25 }, 0.45)
        .to(q("[data-site]"), { attr: { fill: "#22c55e" }, duration: 0.1 }, 0.92)
        .to(q("[data-live]"), { attr: { opacity: 1 }, duration: 0.1 }, 0.92)
        .to(
          waitN,
          {
            v: 9,
            ease: "none",
            duration: 1,
            onUpdate: () => (wait.textContent = String(Math.round(waitN.v))),
          },
          0,
        )
        .to(straight, { strokeDashoffset: 0, ease: "power2.inOut", duration: 0.35 }, 0.1)
        .to(
          q("[data-me-node]"),
          { scale: 1, ease: "back.out(2)", duration: 0.12, stagger: 0.1 },
          0.1,
        );

      // counters under each diagram
      (q("[data-stat]") as HTMLElement[]).forEach((el) => {
        const n = { v: 0 };
        draw.to(
          n,
          {
            v: Number(el.dataset.stat),
            ease: "none",
            duration: 0.6,
            onUpdate: () => (el.textContent = String(Math.round(n.v))),
          },
          0.3,
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="cl-why"
      className="relative overflow-hidden bg-[var(--cl-soft)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <p data-reveal className="cl-eyebrow">
          Why work with me
        </p>
        <h2
          id="cl-why"
          className="cl-display mt-5 max-w-[17ch] text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.98]"
        >
          Agency-quality work, without{" "}
          <span className="relative inline-block text-[var(--cl-muted)]">
            the agency runaround.
            <span
              data-strike
              aria-hidden
              className="absolute top-[54%] -right-[2%] -left-[2%] h-[0.09em] origin-left -rotate-2 rounded-full bg-[var(--cl-accent)]"
            />
          </span>
        </h2>

        {/* ── the comparison ── */}
        <div data-compare className="mt-16 grid gap-5 lg:grid-cols-2">
          {/* agency */}
          <div className="relative overflow-hidden rounded-[28px] border border-[var(--cl-rule)] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] font-semibold tracking-[0.12em] text-[var(--cl-muted)] uppercase">
                {agencyVsMe.agency.label}
              </p>
              <span className="flex items-center gap-2 rounded-full bg-[#fef3c7] px-3 py-1 text-[12px] font-semibold text-[#92400e]">
                <span className="cl-blink-dot h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                <span>
                  Ticket #4821 · waiting{" "}
                  <span data-wait className="tabular-nums">
                    9
                  </span>{" "}
                  days
                </span>
              </span>
            </div>
            <div className="relative">
              {/* the agency's reply, in the empty middle of the U */}
              <span className="cl-bubble cl-bubble-slow absolute hidden sm:block top-[41%] left-[10%] z-10 max-w-[44%] rounded-[12px] rounded-tl-[3px] bg-[var(--cl-soft)] px-3 py-2 text-[12px] leading-snug text-[var(--cl-ink-2)] shadow-[0_8px_20px_-12px_rgba(11,17,32,0.4)]">
                &ldquo;Passed to the dev team — expect 5–7 business days 🙏&rdquo;
              </span>
              <svg
                viewBox="0 0 520 300"
                className="mt-4 h-auto w-full overflow-visible"
                aria-hidden
              >
                <defs>
                  <marker
                    id="cl-arrow"
                    viewBox="0 0 10 10"
                    refX="7"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 1 L9 5 L0 9 z" fill="#f43f5e" />
                  </marker>
                </defs>

                {/* the relay: faint guide, then the line the scroll draws */}
                <path
                  d={RELAY}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                  strokeDasharray="5 6"
                />
                <path
                  data-tangle
                  d={RELAY}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* back-and-forth */}
                {LOOPS.map((l) => (
                  <g key={l.label} data-loop>
                    <path
                      d={l.d}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1.8"
                      strokeDasharray="4 4"
                      markerEnd="url(#cl-arrow)"
                      opacity="0.8"
                    />
                    <text
                      x={l.lx}
                      y={l.ly}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#e11d48"
                    >
                      {l.label}
                    </text>
                  </g>
                ))}

                {/* the request, travelling — it vanishes into each department for a while */}
                <g>
                  <circle r="9" fill="#f59e0b" />
                  <text y="3.5" textAnchor="middle" fontSize="10" fill="#fff">
                    ✉
                  </text>
                  <animateMotion dur="11s" repeatCount="indefinite" path={RELAY} />
                </g>

                {/* start */}
                <circle cx="40" cy="70" r="7" fill="var(--cl-ink)" />
                <text
                  x="40"
                  y="46"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill="var(--cl-ink)"
                >
                  You
                </text>

                {/* departments */}
                {HOPS.map((h, i) => (
                  <g key={h.status} data-hop>
                    <rect
                      x={h.x - PILL_W / 2}
                      y={h.y - 16}
                      width={PILL_W}
                      height="32"
                      rx="16"
                      fill="#fff"
                      stroke="#cbd5e1"
                    />
                    <text
                      x={h.x}
                      y={h.y + 4.5}
                      textAnchor="middle"
                      fontSize="12.5"
                      fontWeight="600"
                      fill="var(--cl-ink-2)"
                    >
                      {agencyVsMe.agency.hops[i]}
                    </text>
                    <circle cx={h.x - 34} cy={h.y + 30} r="3" fill="#f59e0b" />
                    <text x={h.x - 27} y={h.y + 33.5} fontSize="11" fill="var(--cl-muted)">
                      {h.status}
                    </text>
                  </g>
                ))}

                {/* finish — it does get there, eventually */}
                <circle data-site cx="120" cy="215" r="8" fill="#cbd5e1" />
                <text
                  x="120"
                  y="248"
                  textAnchor="middle"
                  fontSize="12.5"
                  fontWeight="600"
                  fill="var(--cl-ink-2)"
                >
                  Your site
                </text>
                <text
                  data-live
                  x="120"
                  y="264"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#16a34a"
                  opacity="0"
                >
                  finally live
                </text>
              </svg>
            </div>
            <dl className="mt-4 grid grid-cols-3 items-end gap-3 border-t border-[var(--cl-rule)] pt-5">
              {agencyVsMe.agency.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1.5 text-[13px] text-[var(--cl-muted)]">{s.label}</dt>
                  <dd className="cl-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none text-[var(--cl-muted)]">
                    <span data-stat={s.value}>{s.value}</span>
                    {s.suffix}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* me */}
          <div className="relative overflow-hidden rounded-[28px] bg-[var(--cl-ink)] p-6 text-white sm:p-8">
            <div
              className="cl-stage-bg absolute inset-0"
              style={{ "--glow": "#2563eb" } as CSSProperties}
            />
            <div className="relative flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] font-semibold tracking-[0.12em] text-white/55 uppercase">
                {agencyVsMe.me.label}
              </p>
              <span className="flex items-center gap-2 rounded-full bg-[#22c55e]/15 px-3 py-1 text-[12px] font-semibold text-[#4ade80]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="cl-pulse absolute inset-0 rounded-full bg-[#22c55e]" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                </span>
                Replies the same day
              </span>
            </div>
            <div className="relative">
              <span className="cl-bubble absolute top-[8%] left-0 z-10 rounded-[12px] rounded-bl-[3px] bg-white px-3 py-2 text-[12px] font-medium text-[var(--cl-ink)]">
                Can we change the banner text?
              </span>
              <span className="cl-bubble cl-bubble-2 absolute right-0 bottom-[8%] z-10 rounded-[12px] rounded-br-[3px] bg-[var(--cl-accent)] px-3 py-2 text-[12px] font-medium text-white">
                Done — it&apos;s live ✓ <span className="text-white/60">· 14 min</span>
              </span>
              <svg viewBox="0 0 520 300" className="relative mt-4 h-auto w-full" aria-hidden>
                <path
                  d={STRAIGHT}
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="2"
                  strokeDasharray="5 6"
                />
                <path
                  data-straight
                  d={STRAIGHT}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle r="6" fill="#67e8f9" style={{ filter: "drop-shadow(0 0 8px #67e8f9)" }}>
                  <animateMotion dur="2.4s" repeatCount="indefinite" path={STRAIGHT} />
                </circle>
                {[
                  { x: 30, label: "You", fill: "#fff", r: 8 },
                  { x: 260, label: "Me", fill: "#2563eb", r: 28 },
                  { x: 490, label: "Your site", fill: "#22c55e", r: 8 },
                ].map((n) => (
                  <g key={n.label} data-me-node>
                    <circle cx={n.x} cy="150" r={n.r} fill={n.fill} />
                    {n.label === "Me" && (
                      <text
                        x={n.x}
                        y="155"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="700"
                        fill="#fff"
                      >
                        MA
                      </text>
                    )}
                    <text
                      x={n.x}
                      y={n.label === "Me" ? 204 : 180}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="600"
                      fill="rgba(255,255,255,0.8)"
                    >
                      {n.label === "Me" ? "design · code · server" : n.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <dl className="relative mt-4 grid grid-cols-3 items-end gap-3 border-t border-white/10 pt-5">
              {agencyVsMe.me.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1.5 text-[13px] text-white/55">{s.label}</dt>
                  <dd className="cl-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none">
                    {"display" in s && s.display ? (
                      <span className="cl-hero-grad">{s.display}</span>
                    ) : (
                      <>
                        <span data-stat={s.value}>{s.value}</span>
                        {s.suffix}
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ── the four reasons ── */}
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => {
            const Scene = SCENES[i];
            return (
              <li
                key={r.title}
                data-reveal
                data-spotlight
                className="relative overflow-hidden rounded-[28px] border border-[var(--cl-rule)] bg-white p-6"
              >
                <div className="flex h-[170px] items-center justify-center rounded-[20px] bg-[var(--cl-soft)]">
                  {Scene && <Scene />}
                </div>
                <p className="mt-6 font-mono text-[12px] text-[var(--cl-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-[20px] leading-snug font-semibold">{r.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--cl-muted)]">
                  {r.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
