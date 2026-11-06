"use client";

/**
 * LivePanel — the hero's "your business, running" dashboard.
 *
 * A 3D stack of glass cards at different depths that tilts with the pointer:
 *   main window  visitors-now counter (rolling digits), live traffic chart
 *                that scrolls as new points arrive, three small metrics
 *   uptime       30-day heartbeat bars, the newest one pulsing
 *   score        performance ring that draws itself to 98
 *   feed         notifications cycling in: orders, enquiries, deploys…
 * Everything is illustrative ("yourbusiness.com"). Timers pause off-screen;
 * reduced motion shows a still dashboard.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { heroLive } from "@/data/clients";

const POINTS = 28;
const W = 440;
const H = 110;
const STEP = W / (POINTS - 3); // point 0 sits one step left of the frame, the last one step right
const TICK = 1500;

function seed() {
  const out: number[] = [];
  let v = 0.5;
  for (let i = 0; i < POINTS; i++) {
    v = Math.min(0.9, Math.max(0.2, v + Math.sin(i * 1.7) * 0.1 + (i % 5 === 0 ? 0.07 : -0.012)));
    out.push(v);
  }
  return out;
}

/** smooth path through the points (Catmull-Rom → cubic Bézier) */
function smoothPath(vals: number[]) {
  const pts = vals.map((v, i) => [(i - 1) * STEP, H - v * H * 0.84 - 8] as const);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  const end = pts[pts.length - 1][0];
  return { line: d, area: `${d} L${end},${H} L${pts[0][0]},${H} Z`, now: pts[pts.length - 2] };
}

/** each digit is a 0–9 reel that slides to its value */
export function Rolling({ value }: { value: number | string }) {
  const chars = String(value).split("");
  return (
    <span className="inline-flex tabular-nums" aria-label={String(value)}>
      {chars.map((d, i) =>
        /\d/.test(d) ? (
          <span key={`${chars.length}-${i}`} className="cl-reel" aria-hidden>
            <span className="cl-reel-strip" style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
              {"0123456789".split("").map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={`${chars.length}-${i}`} className="cl-reel" aria-hidden>
            {d}
          </span>
        ),
      )}
    </span>
  );
}

const FEED_ICON: Record<string, { glyph: string; tone: string }> = {
  order: { glyph: "₹", tone: "bg-[#22c55e]/15 text-[#4ade80]" },
  lead: { glyph: "✉", tone: "bg-[#38bdf8]/15 text-[#7dd3fc]" },
  deploy: { glyph: "↑", tone: "bg-[#2563eb]/25 text-[#93c5fd]" },
  ssl: { glyph: "✓", tone: "bg-white/10 text-white" },
  backup: { glyph: "⟳", tone: "bg-[#22d3ee]/15 text-[#67e8f9]" },
};

// 30-day uptime: one short blip a few weeks ago keeps it honest
const UPTIME = Array.from({ length: 30 }, (_, i) => (i === 11 ? "blip" : "ok"));

export function LivePanel() {
  const root = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const chart = useRef<SVGGElement>(null);
  const [vals, setVals] = useState(seed);
  const [visitors, setVisitors] = useState(128);
  const [orders, setOrders] = useState(37);
  const [feedIx, setFeedIx] = useState(0);
  const [armed, setArmed] = useState(false);
  const running = useRef(true);

  // live data — pauses when the hero is off-screen; nothing ticks for reduced motion
  useEffect(() => {
    const el = root.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const armT = setTimeout(() => setArmed(true), reduced ? 0 : 1600);
    if (reduced) return () => clearTimeout(armT);

    const io = new IntersectionObserver(([e]) => (running.current = e.isIntersecting));
    io.observe(el);
    const data = setInterval(() => {
      if (!running.current || document.hidden) return;
      setVals((v) => {
        const last = v[v.length - 1];
        const next = Math.min(0.9, Math.max(0.22, last + (Math.random() - 0.45) * 0.24));
        return [...v.slice(1), next];
      });
      setVisitors((n) => Math.min(186, Math.max(96, n + Math.round((Math.random() - 0.42) * 9))));
    }, TICK);
    const feed = setInterval(() => {
      if (!running.current || document.hidden) return;
      setFeedIx((i) => (i + 1) % heroLive.feed.length);
    }, 3200);
    return () => {
      clearTimeout(armT);
      clearInterval(data);
      clearInterval(feed);
      io.disconnect();
    };
  }, []);

  // an "order" arriving in the feed bumps today's order count
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (feedIx > 0 && heroLive.feed[feedIx].kind === "order") setOrders((o) => o + 1);
  }, [feedIx]);

  // the chart scrolls left by one step each time a point arrives
  useLayoutEffect(() => {
    const g = chart.current;
    if (!g || !armed) return;
    g.style.transition = "none";
    g.style.transform = `translateX(${STEP}px)`;
    void g.getBoundingClientRect();
    g.style.transition = `transform ${TICK}ms linear`;
    g.style.transform = "translateX(0px)";
  }, [vals, armed]);

  // pointer tilt — the cards sit at different depths, so this reads as parallax
  useEffect(() => {
    const t = tilt.current;
    if (!t) return;
    gsap.set(t, { rotationY: -8, rotationX: 5, transformPerspective: 1600 });
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !matchMedia("(pointer: fine)").matches
    )
      return;
    const rx = gsap.quickTo(t, "rotationX", { duration: 1.2, ease: "power3.out" });
    const ry = gsap.quickTo(t, "rotationY", { duration: 1.2, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      if (!running.current) return;
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      ry(x * 16 - 8);
      rx(-y * 12 + 5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const { line, area, now } = smoothPath(vals);
  const item = heroLive.feed[feedIx];
  const icon = FEED_ICON[item.kind];
  const circ = 2 * Math.PI * 30;

  return (
    <div
      ref={root}
      data-panel
      className="relative mx-auto w-full max-w-[500px] select-none"
      data-cursor="It's live"
    >
      <div ref={tilt} className="relative [transform-style:preserve-3d]">
        {/* ── main window ── */}
        <div data-chip-wrap className="cl-glass relative overflow-hidden rounded-[22px]">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <span className="flex gap-1.5" aria-hidden>
              <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1 text-[12px] text-white/60">
              <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-[#4ade80]" aria-hidden>
                <path
                  d="M3.5 5V3.8a2.5 2.5 0 0 1 5 0V5M2.5 5h7v5h-7z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              <span className="truncate">{heroLive.domain}/dashboard</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-[#22c55e]/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#4ade80]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="cl-pulse absolute inset-0 rounded-full bg-[#22c55e]" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              </span>
              LIVE
            </span>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-white/45 uppercase">
              Visitors right now
            </p>
            <div className="mt-1.5 flex items-end gap-3">
              <p className="cl-display text-[clamp(2.6rem,4.2vw,3.5rem)] leading-none">
                <Rolling value={visitors} />
              </p>
              <span className="mb-1 rounded-full bg-[#38bdf8]/15 px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap text-[#7dd3fc]">
                ▲ 18% this week
              </span>
            </div>

            {/* traffic chart */}
            <div className="relative mt-4 h-[110px] overflow-hidden">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden
              >
                <defs>
                  <linearGradient id="cl-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#38bdf8" stopOpacity="0.32" />
                    <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="cl-stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#2563eb" />
                    <stop offset="1" stopColor="#67e8f9" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2={W}
                    y1={H * y}
                    y2={H * y}
                    stroke="rgba(255,255,255,0.07)"
                    strokeDasharray="3 5"
                  />
                ))}
                <g ref={chart}>
                  <path d={area} fill="url(#cl-area)" />
                  <path
                    d={line}
                    fill="none"
                    stroke="url(#cl-stroke)"
                    strokeWidth="2.2"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              </svg>
              {/* the "now" dot rides the right end of the line */}
              <span
                aria-hidden
                className="absolute right-0 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#67e8f9] shadow-[0_0_0_4px_rgba(103,232,249,0.18),0_0_18px_#67e8f9] transition-[top] duration-[1500ms] ease-linear"
                style={{ top: `${(now[1] / H) * 100}%` }}
              />
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-2">
              <div className="cl-metric">
                <dt>Orders today</dt>
                <dd>
                  <Rolling value={orders} />
                </dd>
              </div>
              <div className="cl-metric">
                <dt>Page load</dt>
                <dd>0.8s</dd>
              </div>
              <div className="cl-metric">
                <dt>Uptime</dt>
                <dd>99.98%</dd>
              </div>
            </dl>
          </div>
          {/* light sweep across the glass */}
          <span aria-hidden className="cl-sheen" />
        </div>

        {/* ── uptime heartbeat ── */}
        <div className="absolute -top-16 left-2 w-[210px] [transform:translateZ(70px)] sm:-top-[4.5rem] sm:-left-14 sm:w-[250px]">
          <div data-chip-wrap className="cl-glass rounded-[16px] p-3.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold">Uptime · 30 days</span>
              <span className="text-[#4ade80]">All good</span>
            </div>
            <div className="mt-2.5 flex h-7 items-end gap-[3px]" aria-hidden>
              {UPTIME.map((s, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-[2px] ${
                    s === "blip"
                      ? "h-[55%] bg-[#fbbf24]"
                      : i === UPTIME.length - 1
                        ? "cl-beat h-full bg-[#4ade80]"
                        : "h-full bg-[#22c55e]/75"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── performance ring ── */}
        <div className="absolute top-[17%] -right-12 hidden [transform:translateZ(110px)] sm:block">
          <div data-chip-wrap className="cl-glass flex items-center gap-3 rounded-[18px] p-3 pr-4">
            <svg viewBox="0 0 72 72" className="h-14 w-14 -rotate-90" aria-hidden>
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
              />
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="#4ade80"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={armed ? circ * 0.02 : circ}
                style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)" }}
              />
            </svg>
            <div>
              <p className="cl-display text-[26px] leading-none">98</p>
              <p className="mt-1 text-[11px] leading-tight text-white/55">
                Performance
                <br />
                score
              </p>
            </div>
          </div>
        </div>

        {/* ── notification feed ── */}
        <div className="absolute -bottom-14 left-2 w-[270px] [transform:translateZ(150px)] sm:-left-16 sm:w-[300px]">
          <div data-chip-wrap className="relative h-[68px]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={feedIx}
                className="cl-glass cl-glass-strong absolute inset-0 flex items-center gap-3 overflow-hidden rounded-[16px] px-3.5"
                initial={{ opacity: 0, y: 26, scale: 0.94, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -22, scale: 0.96, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[15px] font-semibold ${icon.tone}`}
                >
                  {icon.glyph}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold">{item.title}</span>
                  <span className="block truncate text-[12px] text-white/55">{item.meta}</span>
                </span>
                <span className="self-start pt-3 text-[10px] text-white/40">now</span>
                <span
                  aria-hidden
                  className="cl-feed-timer absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-[#2563eb] to-[#67e8f9]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
