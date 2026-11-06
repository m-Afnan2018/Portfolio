/**
 * "Recent results" — an editorial list, not cards.
 *
 * Each case is a full-width row on the white page, separated by rules:
 *   · a giant result number that starts as an outline and fills with the blue
 *     gradient as you scroll, counting up at the same time
 *   · case number, title and a three-part story (problem / what I did / result)
 *   · the case's live illustration, which wipes open as the row arrives:
 *       speed     two page loads side by side; "after" paints first
 *       deploy    one git push sends a deploy wave across a grid of client sites
 *       payments  a phone runs sign-in → role → pay → payment successful
 */
"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { caseStudies, testimonials, type CaseStudy } from "@/data/clients";

/* label shown above each illustration */
const LABEL: Record<CaseStudy["visual"], string> = {
  speed: "performance · before / after",
  deploy: "deploys · production",
  payments: "app · accounts & checkout",
};

const v = (name: string, value: string) => ({ [name]: value }) as CSSProperties;

/* ── speed: before vs after ───────────────────────────────────────────── */
function MiniPage({ lane }: { lane: "before" | "after" }) {
  return (
    <div className={`cl-race cl-race-${lane} flex flex-col`}>
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-semibold text-white/80">
          {lane === "before" ? "Before" : "After"}
        </span>
        <span className="cl-race-done font-semibold text-[#4ade80]">✓ loaded</span>
      </div>
      <div className="mt-2 flex flex-1 flex-col overflow-hidden rounded-[12px] border border-white/10 bg-white/[0.04]">
        <div className="h-1 bg-white/10">
          <span
            className={`cl-race-bar block h-full origin-left ${lane === "before" ? "bg-white/45" : "bg-gradient-to-r from-[#2563eb] to-[#67e8f9]"}`}
          />
        </div>
        <div className="cl-race-page flex flex-1 flex-col gap-2 p-3">
          <span className="block h-2.5 w-[65%] rounded bg-white/70" />
          <span className="block h-1.5 w-[90%] rounded bg-white/25" />
          <span className="block h-1.5 w-[55%] rounded bg-white/25" />
          <span className="block h-4 w-14 rounded-full bg-[#2563eb]" />
          <span className="mt-1 block min-h-16 flex-1 rounded-[8px] bg-gradient-to-br from-[#2563eb] to-[#38bdf8]" />
          <span className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((k) => (
              <span key={k} className="h-10 rounded-[6px] bg-white/[0.12]" />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

function SpeedVisual() {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="grid flex-1 grid-cols-2 gap-4">
        <MiniPage lane="before" />
        <MiniPage lane="after" />
      </div>
      <div className="space-y-2.5 rounded-[14px] border border-white/10 bg-white/[0.04] p-4 text-[12px]">
        <p className="font-semibold tracking-[0.12em] text-white/45 uppercase">Time to load</p>
        <div className="flex items-center gap-3">
          <span className="w-12 text-white/60">Before</span>
          <span className="h-2.5 flex-1 rounded-full bg-white/30" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-12 text-white/60">After</span>
          <span className="flex flex-1 items-center gap-2">
            <span className="h-2.5 w-[65%] rounded-full bg-gradient-to-r from-[#2563eb] to-[#67e8f9]" />
            <span className="font-semibold text-[#7dd3fc]">−35%</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── deploy: one push, every site ─────────────────────────────────────── */
function DeployVisual() {
  const cols = 6;
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[12px]">
        <span className="rounded-full bg-white/[0.08] px-3 py-1">
          <span className="text-[#7dd3fc]">$</span> git push origin main
        </span>
        <span className="cl-deploy-msg text-white/60">→ deploying to every site…</span>
      </div>
      <div className="mt-4 grid flex-1 grid-cols-6 gap-2.5">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="cl-site relative flex min-h-[44px] flex-col gap-1 overflow-hidden rounded-[8px] bg-white/[0.08] p-1.5"
            style={v("--d", `${(Math.floor(i / cols) + (i % cols)) * 0.11}s`)}
          >
            <span className="h-1 w-[60%] rounded bg-white/45" />
            <span className="h-1 w-[85%] rounded bg-white/20" />
            <span className="mt-auto h-[38%] rounded-[4px] bg-white/[0.12]" />
            <span className="cl-site-dot absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-white/40" />
          </span>
        ))}
      </div>
      <p className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12px] text-white/70">
        <span>
          <span className="text-[#4ade80]">●</span> all live · zero downtime
        </span>
        <span className="font-mono text-white/50">Docker · Nginx · CI/CD</span>
      </p>
    </div>
  );
}

/* ── payments: sign in → role → pay → done ────────────────────────────── */
function PaymentsVisual() {
  const screen = "cl-screen absolute inset-0 flex flex-col p-4";
  return (
    <div className="flex h-full items-center justify-center gap-10">
      <div className="relative h-[320px] w-[170px] shrink-0 overflow-hidden rounded-[28px] border-[6px] border-[#1e293b] bg-white text-[var(--cl-ink)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
        <span className="absolute top-1.5 left-1/2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-[#1e293b]" />

        <div className={screen} style={v("--s", "0s")}>
          <span className="mt-6 h-8 w-8 rounded-[10px] bg-[var(--cl-accent)]" />
          <p className="cl-display mt-3 text-[16px]">Welcome back</p>
          <span className="mt-4 rounded-[8px] border border-[var(--cl-rule)] px-2 py-1.5 text-[10px] text-[var(--cl-muted)]">
            priya@company.in
          </span>
          <span className="mt-2 rounded-[8px] border border-[var(--cl-rule)] px-2 py-1.5 text-[10px] tracking-[0.2em] text-[var(--cl-muted)]">
            ••••••••
          </span>
          <span className="mt-3 rounded-full bg-[var(--cl-accent)] py-2 text-center text-[11px] font-semibold text-white">
            Sign in
          </span>
          <span className="mt-2 rounded-full border border-[var(--cl-rule)] py-1.5 text-center text-[10px]">
            Continue with Google
          </span>
        </div>

        <div className={screen} style={v("--s", "2s")}>
          <p className="mt-6 text-[10px] text-[var(--cl-muted)]">Signed in as</p>
          <p className="cl-display text-[15px]">Priya S.</p>
          <span className="mt-2 w-fit rounded-full bg-[var(--cl-accent)] px-2 py-0.5 text-[10px] font-semibold text-white">
            Admin
          </span>
          <p className="mt-4 text-[10px] font-semibold tracking-[0.1em] text-[var(--cl-muted)] uppercase">
            You can
          </p>
          {["View reports", "Manage team", "Refund orders"].map((t) => (
            <span key={t} className="mt-1.5 flex items-center gap-1.5 text-[11px]">
              <span className="text-[#16a34a]">✓</span> {t}
            </span>
          ))}
          <span className="mt-1.5 text-[11px] text-[var(--cl-muted)] line-through">
            Delete workspace
          </span>
        </div>

        <div className={screen} style={v("--s", "4s")}>
          <p className="mt-6 text-[10px] text-[var(--cl-muted)]">Checkout</p>
          <p className="cl-display text-[15px]">Annual plan</p>
          <span className="mt-3 flex justify-between rounded-[8px] bg-[var(--cl-soft)] px-2 py-2 text-[11px]">
            Total <b>₹4,999</b>
          </span>
          <span className="mt-3 grid grid-cols-3 gap-1 text-center text-[9px]">
            {["UPI", "Card", "Netbanking"].map((m, i) => (
              <span
                key={m}
                className={`rounded-[6px] border px-1 py-1.5 ${i === 0 ? "border-[var(--cl-accent)] text-[var(--cl-accent)]" : "border-[var(--cl-rule)]"}`}
              >
                {m}
              </span>
            ))}
          </span>
          <span className="cl-pay-btn mt-auto mb-2 rounded-full bg-[var(--cl-ink)] py-2.5 text-center text-[11px] font-semibold text-white">
            Pay ₹4,999
          </span>
        </div>

        <div className={`${screen} items-center justify-center text-center`} style={v("--s", "6s")}>
          <span className="cl-pay-check flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e] text-[24px] text-white">
            ✓
          </span>
          <p className="cl-display mt-3 text-[15px]">Payment successful</p>
          <p className="mt-1 text-[10px] text-[var(--cl-muted)]">Receipt sent by email</p>
        </div>
      </div>

      <ol className="hidden space-y-3 text-[14px] text-white sm:block">
        {["Secure sign-in", "Role-based access", "Online payment", "Receipt & records"].map(
          (t, i) => (
            <li
              key={t}
              className="cl-flow-step flex items-center gap-3"
              style={v("--s", `${i * 2}s`)}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current/30 font-mono text-[11px]">
                {i + 1}
              </span>
              {t}
            </li>
          ),
        )}
      </ol>
    </div>
  );
}

const VISUAL: Record<CaseStudy["visual"], () => ReactNode> = {
  speed: SpeedVisual,
  deploy: DeployVisual,
  payments: PaymentsVisual,
};

export function WorkSection() {
  const realTestimonials = testimonials.filter((t) => !t.placeholder);
  const root = useRef<HTMLElement>(null);
  const total = String(caseStudies.length).padStart(2, "0");

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-case]", root.current);
      rows.forEach((row) => {
        const fill = row.querySelector<HTMLElement>("[data-num-fill]")!;
        const nums = row.querySelectorAll<HTMLElement>("[data-num]");
        const target = Number(nums[0].dataset.num);
        const n = { v: 0 };

        // the big number: outline → gradient fill, counting up with the scroll
        gsap.set(fill, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(n, {
          v: target,
          ease: "none",
          scrollTrigger: { trigger: row, start: "top 85%", end: "top 30%", scrub: 0.6 },
          onUpdate: () => nums.forEach((el) => (el.textContent = String(Math.round(n.v)))),
        });
        gsap.to(fill, {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: { trigger: row, start: "top 80%", end: "top 30%", scrub: 0.6 },
        });

        // the rule draws, the story rises, the illustration wipes open
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 78%", once: true } });
        tl.from(row.querySelector("[data-rule]"), { scaleX: 0, duration: 1.2, ease: "expo.out" })
          .from(row.querySelectorAll("[data-rise]"), { y: 36, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.1)
          .from(
            row.querySelector("[data-media]"),
            { clipPath: "inset(18% 0 18% 0 round 28px)", scale: 0.94, duration: 1.3, ease: "expo.out" },
            0.15,
          );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" aria-labelledby="cl-work" className="scroll-mt-16 py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="mb-10 grid gap-8 lg:mb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-reveal className="cl-eyebrow">
              Client work
            </p>
            <h2 id="cl-work" data-split className="cl-display mt-4 text-[clamp(2.4rem,6vw,5.4rem)] leading-[0.95]">
              Recent results.
            </h2>
          </div>
          <p data-reveal className="text-[17px] leading-relaxed text-[var(--cl-muted)] lg:col-span-4 lg:col-start-9">
            The problem, what I built, and what changed — from production work I run today.
          </p>
        </div>

        {caseStudies.map((c, i) => {
          const Visual = VISUAL[c.visual];
          const story = [
            { k: "The problem", v: c.problem },
            { k: "What I did", v: c.solution },
            { k: "The result", v: c.result },
          ];
          return (
            <article key={`${c.title}-${i}`} data-case aria-labelledby={`case-${i}`} className="relative py-14 lg:py-20">
              <span data-rule aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--cl-ink)]/15" />

              <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                {/* number + story */}
                <div className="lg:col-span-6">
                  <p data-rise className="flex flex-wrap items-center gap-3 text-[13px]">
                    <span className="font-mono text-[var(--cl-muted)]">
                      {String(i + 1).padStart(2, "0")} / {total}
                    </span>
                    <span className="h-px w-8 bg-[var(--cl-ink)]/20" />
                    <span className="font-medium text-[var(--cl-accent-ink)]">{c.industry}</span>
                    {c.placeholder && <span className="cl-todo">todo</span>}
                  </p>

                  {/* the result, huge: outline underneath, gradient fill wiped in on top */}
                  <div data-rise className="mt-5 flex items-end gap-5">
                    <span className="cl-display relative block text-[clamp(6rem,13vw,12rem)] leading-[0.8] tracking-[-0.06em] tabular-nums">
                      <span className="cl-num-outline">
                        <span data-num={c.metric.value}>{c.metric.value}</span>
                        {c.metric.suffix}
                      </span>
                      <span data-num-fill aria-hidden className="cl-num-fill absolute inset-0">
                        <span data-num={c.metric.value}>{c.metric.value}</span>
                        {c.metric.suffix}
                      </span>
                    </span>
                    <span className="mb-2 max-w-[11rem] text-[15px] leading-snug text-[var(--cl-muted)]">{c.metric.label}</span>
                  </div>

                  <h3 id={`case-${i}`} data-rise className="cl-display mt-8 max-w-[20ch] text-[clamp(1.7rem,2.8vw,2.5rem)] leading-[1.05]">
                    {c.title}
                  </h3>

                  <dl className="mt-8 grid gap-6 sm:grid-cols-3">
                    {story.map((st, k) => (
                      <div key={st.k} data-rise className={k === 2 ? "border-l-2 border-[var(--cl-accent)] pl-4 sm:border-l-0 sm:pl-0" : ""}>
                        <dt className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-[var(--cl-muted)] uppercase">
                          <span className={k === 2 ? "text-[var(--cl-accent)]" : ""}>0{k + 1}</span>
                          {st.k}
                        </dt>
                        <dd
                          className={`mt-2 text-[15px] leading-relaxed ${k === 2 ? "font-semibold text-[var(--cl-ink)]" : "text-[var(--cl-ink-2)]"}`}
                        >
                          {st.v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div data-rise className="mt-8 flex flex-wrap items-center gap-2">
                    {c.services.map((sv) => (
                      <span key={sv} className="cl-tag">
                        {sv}
                      </span>
                    ))}
                    {c.liveUrl && (
                      <a href={c.liveUrl} target="_blank" rel="noreferrer" data-cursor="Visit" className="cl-svc-cta ml-2 text-sm font-semibold text-[var(--cl-accent-ink)]">
                        Visit site ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* live illustration */}
                <div className="lg:col-span-6 lg:pt-10">
                  <div
                    data-media
                    aria-hidden
                    className="relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-[28px] bg-[var(--cl-ink)] text-white"
                  >
                    <div className="cl-stage-bg absolute inset-0" style={v("--glow", "#2563eb")} />
                    <div className="cl-hero-grid absolute inset-0 opacity-40" />
                    <p className="relative flex items-center justify-between px-6 pt-5 font-mono text-[11px] text-white/45">
                      {LABEL[c.visual]}
                      <span className="flex items-center gap-1.5 font-sans text-[10px] font-semibold tracking-wide text-[#4ade80]">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="cl-pulse absolute inset-0 rounded-full bg-[#22c55e]" />
                          <span className="relative h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                        </span>
                        LIVE
                      </span>
                    </p>
                    <div className="relative flex-1 p-6 pt-4">
                      <Visual />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        <span aria-hidden className="block h-px bg-[var(--cl-ink)]/15" />

        {realTestimonials.length > 0 && (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {realTestimonials.map((tm) => (
              <figure key={tm.name} data-reveal className="cl-card p-8">
                <blockquote className="cl-display text-[24px] leading-snug font-semibold tracking-[-0.02em]">“{tm.quote}”</blockquote>
                <figcaption className="mt-5 text-sm text-[var(--cl-muted)]">
                  <span className="font-semibold text-[var(--cl-ink)]">{tm.name}</span> · {tm.role}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
