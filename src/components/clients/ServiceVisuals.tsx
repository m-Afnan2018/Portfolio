"use client";

/**
 * ServiceVisuals — one small, living scene per service, shown on the sticky
 * stage of the services showcase (and inline on phones).
 *
 *   apps        dashboard: revenue ticks up, a user's role changes, a payment lands
 *   stores      product page: a cursor picks a size, adds to cart, order confirmed
 *   websites    page in edit mode: the headline is retyped, mirrored on a phone
 *   hosting     terminal deploy with green checks; server health beside it
 *   automation  workflow: data pulses travel form → sheet → AI → email / WhatsApp
 *   care        monthly checklist that ticks itself off, then stamps "all done"
 *
 * Each scene is drawn at 460×360 and scaled to fit its box. Scenes only
 * animate while active; everything is illustrative.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Rolling } from "./LivePanel";

const VW = 460;
const VH = 360;

const reducedNow = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** steps 0…count-1 on a loop while active */
function useStep(active: boolean, count: number, ms: number) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active || reducedNow()) return;
    const id = setInterval(() => setStep((s) => (s + 1) % count), ms);
    return () => clearInterval(id);
  }, [active, count, ms]);
  return step;
}

/** scales a fixed 460×360 scene to fit its container */
function FitBox({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(() =>
      setScale(Math.min(el.clientWidth / VW, el.clientHeight / VH, 1.3)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="absolute inset-0 flex items-center justify-center">
      <div
        className="relative shrink-0"
        style={{ width: VW, height: VH, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

const Check = ({ on = true }: { on?: boolean }) => (
  <span
    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] transition-all duration-500 ${
      on ? "scale-100 bg-[#22c55e] text-white" : "scale-90 border border-white/20 text-transparent"
    }`}
  >
    ✓
  </span>
);

/* ── 01 web apps ───────────────────────────────────────────────────────── */
const ROLE_TONE: Record<string, string> = {
  Viewer: "bg-white/10 text-white/70",
  Editor: "bg-[#38bdf8]/20 text-[#7dd3fc]",
  Admin: "bg-[#2563eb] text-white",
};
const BARS = [
  [40, 55, 48, 70, 62, 80, 74],
  [45, 52, 60, 66, 70, 76, 88],
  [50, 58, 54, 72, 78, 84, 92],
  [42, 60, 66, 64, 82, 88, 96],
];

function AppsVisual({ active }: { active: boolean }) {
  const step = useStep(active, 4, 1700);
  const users = [
    ["Priya S.", "Admin"],
    ["Rahul K.", ["Viewer", "Editor", "Admin", "Admin"][step]],
    ["Aisha M.", "Viewer"],
  ];
  return (
    <FitBox>
      <div className="cl-glass absolute inset-0 flex overflow-hidden rounded-[18px]">
        <div className="flex w-12 flex-col items-center gap-3 border-r border-white/10 bg-white/[0.03] py-4">
          <span className="h-6 w-6 rounded-[7px] bg-[#2563eb]" />
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-5 w-5 rounded-[6px] ${i === 0 ? "bg-white/25" : "bg-white/10"}`}
            />
          ))}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold">Team dashboard</p>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
              This month
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="cl-metric">
              <dt>Revenue</dt>
              <dd className="!text-[20px]">
                ₹<Rolling value={[48200, 49100, 53300, 54150][step].toLocaleString("en-IN")} />
              </dd>
            </div>
            <div className="cl-metric">
              <dt>Active users</dt>
              <dd className="!text-[20px]">
                <Rolling value={[312, 318, 325, 331][step]} />
              </dd>
            </div>
          </dl>
          <div className="mt-3 flex h-[84px] items-end gap-2 rounded-[12px] border border-white/[0.07] bg-white/[0.03] px-3 pt-3 pb-2">
            {BARS[step].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-[4px] bg-gradient-to-t from-[#2563eb] to-[#38bdf8] transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-white/45 uppercase">
            Users &amp; roles
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {users.map(([n, r], i) => (
              <li key={n} className="flex items-center gap-2.5 text-[12px]">
                <span
                  className={`h-6 w-6 rounded-full ${["bg-[#f472b6]/70", "bg-[#38bdf8]/70", "bg-[#a78bfa]/70"][i]}`}
                />
                <span className="flex-1">{n}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors duration-500 ${ROLE_TONE[r]}`}
                >
                  {r}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={`cl-glass cl-glass-strong absolute -right-6 -bottom-5 flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          step >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#22c55e]/15 text-[#4ade80]">
          ₹
        </span>
        <span>
          <span className="block text-[12px] font-semibold">Payment received</span>
          <span className="block text-[11px] text-white/55">₹4,999 · paid online</span>
        </span>
      </div>
    </FitBox>
  );
}

/* ── 02 online stores ──────────────────────────────────────────────────── */
// cursor waypoints inside the 460×360 scene: size chip → button → cart → order bar
const CURSOR = [
  [292, 196],
  [330, 268],
  [420, 30],
  [300, 318],
];

function StoreVisual({ active }: { active: boolean }) {
  const step = useStep(active, 4, 1500);
  const [cart, setCart] = useState(2);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (active && step === 1) setCart((c) => (c >= 9 ? 3 : c + 1));
  }, [step, active]);
  const [cx, cy] = CURSOR[step];
  return (
    <FitBox>
      <div className="absolute inset-0 overflow-hidden rounded-[18px] bg-white text-[var(--cl-ink)] shadow-[0_30px_60px_-24px_rgba(2,6,23,0.8)]">
        <div className="flex items-center justify-between border-b border-[var(--cl-rule)] px-4 py-2.5">
          <span className="cl-display text-[15px]">threadline.</span>
          <span className="flex gap-4 text-[11px] text-[var(--cl-muted)]">
            <span>Shop</span>
            <span>New</span>
            <span>Sale</span>
          </span>
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cl-soft)]">
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden
            >
              <path
                d="M3 4h2l1.6 8.2a1.5 1.5 0 0 0 1.5 1.2h6.3a1.5 1.5 0 0 0 1.4-1.1L17 7H6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              key={cart}
              className="cl-pop absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--cl-accent)] px-1 text-[10px] font-bold text-white"
            >
              {cart}
            </span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="relative h-[268px] overflow-hidden rounded-[14px] bg-gradient-to-br from-[#dbeafe] via-[#bfdbfe] to-[#93c5fd]">
            <svg
              viewBox="0 0 120 120"
              className="absolute inset-0 m-auto h-[70%] w-[70%] drop-shadow-xl"
              aria-hidden
            >
              <path
                d="M38 22 22 32l8 18 10-5v53h40V45l10 5 8-18-16-10c-3 6-10 10-22 10s-19-4-22-10Z"
                fill="#1e3a8a"
              />
              <path
                d="M38 22c3 6 10 10 22 10s19-4 22-10"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            </svg>
            <span className="absolute top-3 left-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold">
              NEW
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-[11px] text-[var(--cl-muted)]">Men · Shirts</p>
            <p className="cl-display mt-1 text-[20px] leading-tight">Linen Shirt — Navy</p>
            <p className="mt-1 text-[11px] text-[#f59e0b]">
              ★★★★★ <span className="text-[var(--cl-muted)]">128 reviews</span>
            </p>
            <p className="mt-2 text-[20px] font-bold">₹1,499</p>
            <p className="mt-3 text-[11px] font-semibold">Size</p>
            <div className="mt-1.5 flex gap-1.5">
              {["S", "M", "L", "XL"].map((s) => (
                <span
                  key={s}
                  className={`flex h-8 w-9 items-center justify-center rounded-[8px] border text-[12px] font-semibold ${
                    s === "M"
                      ? "border-[var(--cl-ink)] bg-[var(--cl-ink)] text-white"
                      : "border-[var(--cl-rule)]"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
            <span
              className={`mt-auto flex h-11 items-center justify-center rounded-full text-[13px] font-semibold text-white transition-all duration-300 ${
                step === 1 || step === 2
                  ? "scale-95 bg-[#16a34a]"
                  : "scale-100 bg-[var(--cl-accent)]"
              }`}
            >
              {step === 1 || step === 2 ? "Added ✓" : "Add to cart"}
            </span>
          </div>
        </div>
        <div
          className={`absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-[14px] bg-[var(--cl-ink)] px-4 py-3 text-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            step === 3 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Check />
          <span className="flex-1 text-[12px]">
            <b>Order #10{40 + cart} confirmed</b> · paid by UPI
          </span>
          <span className="text-[11px] text-white/55">just now</span>
        </div>
      </div>
      {/* the shopper's cursor */}
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute h-6 w-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] transition-all duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ left: cx, top: cy }}
        aria-hidden
      >
        <path
          d="M4 3l15 7-6.5 1.8L10 18z"
          fill="#0b1120"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </FitBox>
  );
}

/* ── 03 business websites ──────────────────────────────────────────────── */
const HEADLINES = ["Smile with confidence.", "Gentle care for families.", "Book your visit today."];

function WebsiteVisual({ active }: { active: boolean }) {
  const [ix, setIx] = useState(0);
  const [n, setN] = useState(HEADLINES[0].length);
  // hold → erase → type the next headline → hold …
  useEffect(() => {
    if (!active || reducedNow()) return;
    let phase: "hold" | "erase" | "type" = "hold";
    let hold = 0;
    let cur = HEADLINES[ix].length;
    let i = ix;
    const id = setInterval(() => {
      if (phase === "hold") {
        if (++hold > 22) phase = "erase";
      } else if (phase === "erase") {
        cur = Math.max(0, cur - 2);
        if (cur === 0) {
          i = (i + 1) % HEADLINES.length;
          setIx(i);
          phase = "type";
        }
      } else if (++cur >= HEADLINES[i].length) {
        phase = "hold";
        hold = 0;
      }
      setN(cur);
    }, 70);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  const text = HEADLINES[ix].slice(0, n);

  return (
    <FitBox>
      <div className="absolute top-0 left-0 h-[320px] w-[370px] overflow-hidden rounded-[18px] bg-white text-[var(--cl-ink)] shadow-[0_30px_60px_-24px_rgba(2,6,23,0.8)]">
        <div className="flex items-center gap-2 border-b border-[var(--cl-rule)] bg-[var(--cl-soft)] px-3 py-2">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <i key={i} className="h-2 w-2 rounded-full bg-[#cbd5e1]" />
            ))}
          </span>
          <span className="flex-1 truncate rounded-full bg-white px-2.5 py-0.5 text-[10px] text-[var(--cl-muted)]">
            sharmadental.in
          </span>
          <span className="rounded-full bg-[var(--cl-accent)] px-2 py-0.5 text-[9px] font-bold tracking-wide text-white">
            EDITING
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between text-[10px] text-[var(--cl-muted)]">
            <span className="cl-display text-[13px] text-[var(--cl-ink)]">Sharma Dental</span>
            <span className="flex gap-3">
              <span>About</span>
              <span>Treatments</span>
              <span>Contact</span>
            </span>
          </div>
          <div className="mt-5 inline-flex items-center gap-2.5 rounded-[8px] bg-[var(--cl-ink)] px-2.5 py-1 text-[11px] text-white">
            <b>B</b>
            <i>I</i>
            <span>Aa</span>
            <span className="h-3 w-px bg-white/30" />
            <span>Link</span>
          </div>
          <p className="cl-display mt-2 min-h-[2.2em] rounded-[6px] text-[28px] leading-[1.05] outline-2 outline-offset-4 outline-[var(--cl-accent)] outline-dashed">
            {text}
            <span className="cl-caret" />
          </p>
          <div className="mt-4 space-y-1.5">
            <span className="block h-2 w-[88%] rounded-full bg-[#e2e8f0]" />
            <span className="block h-2 w-[72%] rounded-full bg-[#e2e8f0]" />
          </div>
          <span className="mt-5 inline-flex rounded-full bg-[var(--cl-accent)] px-4 py-2 text-[11px] font-semibold text-white">
            Book a visit →
          </span>
        </div>
        <span className="absolute right-3 bottom-3 rounded-full bg-[#22c55e]/15 px-2 py-0.5 text-[10px] font-semibold text-[#15803d]">
          ✓ Saved · live instantly
        </span>
      </div>
      {/* the same page on a phone */}
      <div className="absolute right-0 bottom-0 h-[250px] w-[128px] overflow-hidden rounded-[22px] border-[5px] border-[#0f172a] bg-white text-[var(--cl-ink)] shadow-[0_30px_60px_-20px_rgba(2,6,23,0.9)]">
        <div className="mx-auto mt-1 h-1.5 w-10 rounded-full bg-[#0f172a]" />
        <div className="px-2.5 pt-3">
          <p className="cl-display text-[9px]">Sharma Dental</p>
          <p className="cl-display mt-3 min-h-[3.3em] text-[14px] leading-[1.1]">{text}</p>
          <span className="mt-2 block h-1.5 w-[90%] rounded-full bg-[#e2e8f0]" />
          <span className="mt-1 block h-1.5 w-[70%] rounded-full bg-[#e2e8f0]" />
          <span className="mt-3 inline-flex rounded-full bg-[var(--cl-accent)] px-2.5 py-1 text-[8px] font-semibold text-white">
            Book a visit
          </span>
          <span className="mt-3 block h-16 rounded-[10px] bg-gradient-to-br from-[#dbeafe] to-[#93c5fd]" />
        </div>
      </div>
    </FitBox>
  );
}

/* ── 04 hosting ────────────────────────────────────────────────────────── */
const DEPLOY = [
  { t: "$ git push origin main", tone: "text-white" },
  { t: "→ building image…  done in 18s", tone: "text-white/60" },
  { t: "→ running checks…  24 passed", tone: "text-white/60" },
  { t: "→ deploying to production…", tone: "text-white/60" },
  { t: "✓ live at yourbusiness.com · 42s", tone: "text-[#4ade80]" },
  { t: "✓ zero downtime · SSL valid 89 days", tone: "text-[#4ade80]" },
];

function HostingVisual({ active }: { active: boolean }) {
  const step = useStep(active, DEPLOY.length + 4, 650); // a few beats to read the result
  const shown = Math.min(step + 1, DEPLOY.length);
  const done = shown === DEPLOY.length;
  return (
    <FitBox>
      <div className="absolute top-0 left-0 h-[236px] w-[460px] overflow-hidden rounded-[16px] border border-white/10 bg-[#050913] font-mono text-[12px] shadow-[0_30px_60px_-24px_rgba(2,6,23,0.9)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2 text-[10px] text-white/40">
          <span className="flex gap-1">
            <i className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <i className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <i className="h-2 w-2 rounded-full bg-[#28c840]" />
          </span>
          deploy — production
        </div>
        <div className="space-y-1.5 p-4">
          {DEPLOY.slice(0, shown).map((l, i) => (
            <p key={l.t} className={`cl-line-in ${l.tone}`}>
              {l.t}
              {i === shown - 1 && !done && <span className="cl-caret" />}
            </p>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 grid w-[460px] grid-cols-3 gap-2.5">
        {(
          [
            ["CPU", done ? 18 : 64],
            ["Memory", done ? 41 : 58],
            ["Disk", 37],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="cl-glass rounded-[14px] p-3">
            <div className="flex justify-between text-[11px]">
              <span className="text-white/55">{k}</span>
              <span className="font-semibold tabular-nums">{v}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8] transition-[width] duration-1000"
                style={{ width: `${v}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div
        className={`cl-glass cl-glass-strong absolute top-[160px] right-[-14px] flex items-center gap-2 rounded-[12px] px-3 py-2 text-[12px] transition-all duration-700 ${
          done ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <span className="text-[#4ade80]">●</span> HTTPS · A+ rating
      </div>
    </FitBox>
  );
}

/* ── 05 automation ─────────────────────────────────────────────────────── */
// node boxes (px in the 460×360 scene); the pulse reaches each at the given second of a 3.2s run
const NODES = [
  {
    x: 0,
    y: 131,
    w: 88,
    label: "New enquiry",
    sub: "website form",
    glyph: "✉",
    tone: "#38bdf8",
    at: 0,
  },
  {
    x: 124,
    y: 131,
    w: 88,
    label: "Google Sheet",
    sub: "row added",
    glyph: "▦",
    tone: "#22c55e",
    at: 0.45,
  },
  {
    x: 248,
    y: 131,
    w: 88,
    label: "AI summary",
    sub: "lead scored",
    glyph: "✦",
    tone: "#a78bfa",
    at: 1.25,
  },
  {
    x: 364,
    y: 36,
    w: 96,
    label: "Email you",
    sub: "with summary",
    glyph: "@",
    tone: "#60a5fa",
    at: 2.05,
  },
  {
    x: 364,
    y: 236,
    w: 96,
    label: "WhatsApp",
    sub: "auto-reply sent",
    glyph: "◉",
    tone: "#4ade80",
    at: 2.05,
  },
];
const EDGES = [
  { d: "M88 175 H124", begin: "0s" },
  { d: "M212 175 H248", begin: "0.8s" },
  { d: "M336 165 C 352 165, 348 80, 364 80", begin: "1.6s" },
  { d: "M336 185 C 352 185, 348 280, 364 280", begin: "1.6s" },
];

function AutomationVisual({ active }: { active: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const s = svg.current;
    if (!s) return;
    if (active && !reducedNow()) s.unpauseAnimations();
    else s.pauseAnimations();
  }, [active]);
  return (
    <FitBox>
      <svg
        ref={svg}
        viewBox={`0 0 ${VW} ${VH}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        {EDGES.map((e) => (
          <path
            key={e.d}
            d={e.d}
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="4 5"
            fill="none"
            opacity="0.6"
          />
        ))}
        {EDGES.map((e) => (
          <circle
            key={`p-${e.d}`}
            r="4.5"
            fill="#67e8f9"
            opacity="0"
            style={{ filter: "drop-shadow(0 0 6px #67e8f9)" }}
          >
            <animateMotion
              dur="3.2s"
              begin={e.begin}
              repeatCount="indefinite"
              keyPoints="0;1;1"
              keyTimes="0;0.15;1"
              calcMode="linear"
              path={e.d}
            />
            <animate
              attributeName="opacity"
              dur="3.2s"
              begin={e.begin}
              repeatCount="indefinite"
              values="1;1;0;0"
              keyTimes="0;0.15;0.16;1"
            />
          </circle>
        ))}
      </svg>
      {NODES.map((n) => (
        <div
          key={n.label}
          className="cl-glass cl-node absolute flex flex-col gap-1.5 rounded-[14px] p-2.5"
          style={{ left: n.x, top: n.y, width: n.w, animationDelay: `${n.at}s` }}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[13px]"
            style={{ background: `${n.tone}26`, color: n.tone }}
          >
            {n.glyph}
          </span>
          <span className="text-[12px] leading-tight font-semibold">{n.label}</span>
          <span className="text-[10px] leading-tight text-white/50">{n.sub}</span>
        </div>
      ))}
      <p className="absolute top-2 left-0 text-[11px] font-semibold tracking-[0.12em] text-white/45 uppercase">
        Runs on its own · 24/7
      </p>
      <p className="absolute bottom-2 left-0 text-[11px] text-white/45">
        <span className="text-[#4ade80]">●</span> 1,284 runs this month · 0 failed
      </p>
    </FitBox>
  );
}

/* ── 06 care plans ─────────────────────────────────────────────────────── */
const CARE = [
  "WordPress & plugins updated",
  "Security scan — all clean",
  "30 backups verified",
  "Uptime 99.99% this month",
  "3 content changes done",
];

function CareVisual({ active }: { active: boolean }) {
  const step = useStep(active, CARE.length + 4, 700);
  // reduced motion shows the finished report (read after mount — never during server render)
  const [still, setStill] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setStill(reducedNow()), []);
  const ticked = still ? CARE.length : Math.min(step, CARE.length);
  const pct = Math.round((ticked / CARE.length) * 100);
  const circ = 2 * Math.PI * 34;
  return (
    <FitBox>
      <div className="cl-glass absolute inset-0 rounded-[18px] p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] text-white/45 uppercase">
              Monthly care report
            </p>
            <p className="cl-display mt-1 text-[22px]">November</p>
          </div>
          <div className="relative h-[72px] w-[72px]">
            <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden>
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="7"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#4ade80"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct / 100)}
                style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[15px] font-semibold tabular-nums">
              {pct}%
            </span>
          </div>
        </div>
        <ul className="mt-3 space-y-2">
          {CARE.map((c, i) => (
            <li
              key={c}
              className={`flex items-center gap-3 rounded-[12px] border px-3 py-2 text-[13px] transition-all duration-500 ${
                i < ticked
                  ? "border-[#22c55e]/25 bg-[#22c55e]/[0.07]"
                  : "border-white/[0.07] bg-white/[0.03] text-white/55"
              }`}
            >
              <Check on={i < ticked} />
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`absolute right-5 bottom-5 rotate-[-8deg] rounded-[10px] border-2 border-[#4ade80] bg-[#0b1120]/80 px-3 py-1 text-[13px] font-bold tracking-wide text-[#4ade80] uppercase transition-all duration-500 ${
          ticked === CARE.length ? "scale-100 opacity-100" : "scale-150 opacity-0"
        }`}
      >
        All done ✓
      </div>
    </FitBox>
  );
}

const VISUALS: Record<string, (p: { active: boolean }) => ReactNode> = {
  apps: AppsVisual,
  stores: StoreVisual,
  websites: WebsiteVisual,
  hosting: HostingVisual,
  automation: AutomationVisual,
  care: CareVisual,
};

export function ServiceVisual({ id, active }: { id: string; active: boolean }) {
  const V = VISUALS[id];
  return V ? <V active={active} /> : null;
}
