"use client";

/**
 * Packages & pricing — from the "Website Packages & Pricing" document.
 *
 *  · three packages (Standard raised, with a turning gradient border); each
 *    "Choose" button loads that package into the estimate below
 *  · "Build your estimate": pick a package, switch on add-ons; the total rolls,
 *    the 50 / 30 / 20 payment schedule and yearly running costs update live,
 *    and "Send me this quote" pre-fills the inquiry form (cl:quote event)
 *  · "Compare every feature": the at-a-glance table, folded away by default
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  addOns,
  packageCompare,
  packages,
  paymentSchedule,
  runningCosts,
  type PackageId,
} from "@/data/clients";
import { Rolling } from "./LivePanel";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const budgetFor = (total: number) =>
  total < 25000
    ? "Under ₹25,000"
    : total <= 35000
      ? "₹25,000 – ₹35,000"
      : total <= 65000
        ? "₹35,000 – ₹65,000"
        : "₹65,000+";

const Tick = ({ className = "" }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    className={`h-5 w-5 shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m5 10.5 3.2 3L15 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function PricingSection() {
  const [pkg, setPkg] = useState<PackageId>("standard");
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [extraPages, setExtraPages] = useState(0);
  const [compareOpen, setCompareOpen] = useState(false);
  const root = useRef<HTMLElement>(null);

  // package prices count up when they come into view (own observer: the global
  // [data-count] trigger is measured before the pinned section above grows the page)
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...root.current!.querySelectorAll<HTMLElement>("[data-price]")];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const el = e.target as HTMLElement;
          const target = Number(el.dataset.price);
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / 1400);
            el.textContent = inr(Math.round((target * (1 - Math.pow(1 - p, 3))) / 100) * 100);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
      { threshold: 0.6 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const chosen = packages.find((p) => p.id === pkg)!;
  const isPremium = pkg === "premium";
  const lines = useMemo(() => {
    const out: { name: string; price: number }[] = [];
    for (const a of addOns) {
      if (isPremium && a.inPremium) continue;
      if (a.id === "page") {
        if (extraPages > 0)
          out.push({
            name: `${extraPages} extra page${extraPages > 1 ? "s" : ""}`,
            price: a.price * extraPages,
          });
      } else if (picked[a.id]) out.push({ name: a.name, price: a.price });
    }
    return out;
  }, [picked, extraPages, isPremium]);
  const total = chosen.price + lines.reduce((s, l) => s + l.price, 0);
  const run = runningCosts[pkg];

  const choose = (id: PackageId) => {
    setPkg(id);
    document.getElementById("estimate")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sendQuote = () => {
    const details = [
      `Package: ${chosen.name} (${inr(chosen.price)}, ${chosen.pages} pages)`,
      ...lines.map((l) => `+ ${l.name} (${inr(l.price)})`),
      `Estimated total: ${inr(total)} (one-time)`,
      "",
      "About my project: ",
    ].join("\n");
    window.dispatchEvent(
      new CustomEvent("cl:quote", {
        detail: { type: "Business websites", budget: budgetFor(total), details },
      }),
    );
  };

  return (
    <section
      ref={root}
      id="pricing"
      aria-labelledby="cl-pricing"
      className="relative scroll-mt-16 overflow-hidden bg-[var(--cl-soft)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        {/* ── heading ── */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-reveal className="cl-eyebrow">
              Packages &amp; pricing
            </p>
            <h2
              id="cl-pricing"
              data-split
              className="cl-display mt-4 text-[clamp(2.4rem,6vw,5.4rem)] leading-[0.95]"
            >
              Clear prices. No surprises.
            </h2>
          </div>
          <p
            data-reveal
            className="text-[17px] leading-relaxed text-[var(--cl-muted)] lg:col-span-4 lg:col-start-9"
          >
            One-time development prices in Indian Rupees. Domain, hosting and yearly care are
            separate — and listed below.
          </p>
        </div>

        {/* ── the three packages ── */}
        <div className="mt-14 grid items-stretch gap-5 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {packages.map((p) => {
            const dark = !!p.popular;
            return (
              <article
                key={p.id}
                data-reveal
                data-spotlight
                aria-labelledby={`pkg-${p.id}`}
                className={`relative flex flex-col rounded-[30px] p-7 sm:p-9 ${
                  dark
                    ? "cl-pkg-popular bg-[var(--cl-ink)] text-white lg:-my-6 lg:py-14"
                    : "border border-[var(--cl-rule)] bg-white"
                }`}
              >
                {dark && (
                  <span className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8] px-3.5 py-1 text-[11px] font-bold tracking-[0.12em] whitespace-nowrap text-white uppercase shadow-[0_8px_20px_-6px_rgba(37,99,235,0.7)]">
                    Most popular
                  </span>
                )}
                <div className="flex items-baseline justify-between gap-3">
                  <h3 id={`pkg-${p.id}`} className="cl-display text-[26px] tracking-[-0.02em]">
                    {p.name}
                  </h3>
                  <span
                    className={`font-mono text-[12px] ${dark ? "text-white/50" : "text-[var(--cl-muted)]"}`}
                  >
                    {p.pages} pages
                  </span>
                </div>
                <p
                  className={`mt-2 min-h-[3em] text-[15px] leading-snug ${dark ? "text-white/65" : "text-[var(--cl-muted)]"}`}
                >
                  {p.blurb}
                </p>

                <p className="mt-7 flex items-end gap-2">
                  <span
                    data-price={p.price}
                    className={`cl-display text-[clamp(2.8rem,4.2vw,3.8rem)] leading-none ${dark ? "cl-hero-grad" : ""}`}
                  >
                    {inr(p.price)}
                  </span>
                  <span
                    className={`mb-1.5 text-[13px] ${dark ? "text-white/50" : "text-[var(--cl-muted)]"}`}
                  >
                    one-time
                  </span>
                </p>

                <dl
                  className={`mt-6 grid grid-cols-3 gap-2 rounded-[16px] p-3 text-center ${dark ? "bg-white/[0.06]" : "bg-[var(--cl-soft)]"}`}
                >
                  {[
                    ["working days", p.delivery.replace(" working days", "")],
                    ["support", p.support],
                    ["revisions", String(p.revisions)],
                  ].map(([k, val]) => (
                    <div key={k} className="flex flex-col-reverse">
                      <dt
                        className={`mt-0.5 text-[11px] ${dark ? "text-white/50" : "text-[var(--cl-muted)]"}`}
                      >
                        {k}
                      </dt>
                      <dd className="text-[15px] font-semibold">{val}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-7 space-y-3 text-[15px]">
                  {p.points.map((pt, k) => (
                    <li
                      key={pt}
                      className={`flex gap-2.5 ${k === 0 && p.id !== "basic" ? "font-semibold" : ""}`}
                    >
                      <Tick className={dark ? "text-[#38bdf8]" : "text-[var(--cl-accent)]"} />
                      {pt}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-9">
                  <button
                    type="button"
                    onClick={() => choose(p.id)}
                    className={`cl-btn w-full ${dark ? "cl-btn-primary cl-btn-glow" : "cl-btn-dark"}`}
                  >
                    Choose {p.name}{" "}
                    <span className="cl-btn-arrow" aria-hidden>
                      →
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── build your estimate ── */}
        <div id="estimate" className="mt-20 scroll-mt-24 lg:mt-28">
          <p data-reveal className="cl-eyebrow">
            Build your estimate
          </p>
          <h3
            data-reveal
            className="cl-display mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.02]"
          >
            Pick a package, add what you need.
          </h3>

          <div className="mt-8 grid gap-5 lg:grid-cols-12">
            {/* choices */}
            <div className="rounded-[28px] border border-[var(--cl-rule)] bg-white p-5 sm:p-7 lg:col-span-7">
              <p className="text-sm font-semibold">Package</p>
              <div
                role="radiogroup"
                aria-label="Package"
                className="relative mt-3 grid grid-cols-3 rounded-full bg-[var(--cl-soft)] p-1"
              >
                <span
                  aria-hidden
                  className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-[var(--cl-ink)] shadow-[0_8px_20px_-8px_rgba(11,17,32,0.6)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: `translateX(${packages.findIndex((p) => p.id === pkg) * 100}%)`,
                  }}
                />
                {packages.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={pkg === p.id}
                    onClick={() => setPkg(p.id)}
                    className={`relative z-10 rounded-full py-2.5 text-center text-[14px] font-semibold transition-colors duration-300 ${
                      pkg === p.id
                        ? "text-white"
                        : "text-[var(--cl-ink-2)] hover:text-[var(--cl-ink)]"
                    }`}
                  >
                    {p.name}
                    <span
                      className={`ml-1.5 hidden font-normal sm:inline ${pkg === p.id ? "text-white/60" : "text-[var(--cl-muted)]"}`}
                    >
                      {inr(p.price)}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-8 text-sm font-semibold">
                Add-ons <span className="font-normal text-[var(--cl-muted)]">(one-time)</span>
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {addOns.map((a) => {
                  const included = isPremium && !!a.inPremium;
                  if (a.id === "page") {
                    return (
                      <li
                        key={a.id}
                        className={`flex items-center justify-between gap-3 rounded-[16px] border px-4 py-3 text-[14px] transition-colors ${
                          included
                            ? "border-[var(--cl-rule)] bg-[var(--cl-soft)]"
                            : extraPages > 0
                              ? "border-[var(--cl-accent)] bg-[var(--cl-accent-soft)]"
                              : "border-[var(--cl-rule)]"
                        }`}
                      >
                        <span>
                          <span className="block font-medium">Extra pages</span>
                          <span className="text-[12px] text-[var(--cl-muted)]">
                            {included
                              ? "Create pages yourself in Premium"
                              : `${inr(a.price)} ${a.unit}`}
                          </span>
                        </span>
                        {included ? (
                          <span className="text-[12px] font-semibold text-[#16a34a]">Included</span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="One fewer extra page"
                              onClick={() => setExtraPages((n) => Math.max(0, n - 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cl-rule)] bg-white text-lg leading-none hover:border-[var(--cl-ink)]"
                            >
                              −
                            </button>
                            <span
                              className="w-5 text-center font-semibold tabular-nums"
                              aria-live="polite"
                            >
                              {extraPages}
                            </span>
                            <button
                              type="button"
                              aria-label="One more extra page"
                              onClick={() => setExtraPages((n) => Math.min(20, n + 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cl-rule)] bg-white text-lg leading-none hover:border-[var(--cl-ink)]"
                            >
                              +
                            </button>
                          </span>
                        )}
                      </li>
                    );
                  }
                  const on = !included && !!picked[a.id];
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on || included}
                        disabled={included}
                        onClick={() => setPicked((s) => ({ ...s, [a.id]: !s[a.id] }))}
                        className={`flex h-full w-full items-center justify-between gap-3 rounded-[16px] border px-4 py-3 text-left text-[14px] transition-all duration-300 ${
                          included
                            ? "cursor-default border-[var(--cl-rule)] bg-[var(--cl-soft)]"
                            : on
                              ? "border-[var(--cl-accent)] bg-[var(--cl-accent-soft)]"
                              : "border-[var(--cl-rule)] hover:border-[var(--cl-ink)]/40"
                        }`}
                      >
                        <span>
                          <span className="block font-medium">{a.name}</span>
                          <span className="text-[12px] text-[var(--cl-muted)]">
                            {included ? "Already in Premium" : inr(a.price)}
                          </span>
                        </span>
                        {included ? (
                          <span className="shrink-0 text-[12px] font-semibold text-[#16a34a]">
                            Included
                          </span>
                        ) : (
                          <span
                            aria-hidden
                            className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-[var(--cl-accent)]" : "bg-[#cbd5e1]"}`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${on ? "translate-x-4" : ""}`}
                            />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* phones: the total follows you while you toggle add-ons */}
              <div className="sticky bottom-4 z-10 mt-5 flex items-center justify-between gap-3 rounded-full bg-[var(--cl-ink)] py-2.5 pr-2.5 pl-5 text-white shadow-[0_16px_40px_-12px_rgba(11,17,32,0.6)] lg:hidden">
                <span className="text-[13px] text-white/60">
                  Estimate <b className="ml-1 text-[17px] text-white tabular-nums">{inr(total)}</b>
                </span>
                <a
                  href="#estimate-summary"
                  className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[var(--cl-ink)]"
                >
                  Breakdown ↓
                </a>
              </div>
            </div>

            {/* live summary */}
            <aside
              id="estimate-summary"
              aria-label="Your estimate"
              className="relative flex scroll-mt-24 flex-col overflow-hidden rounded-[28px] bg-[var(--cl-ink)] p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:col-span-5 lg:self-start"
            >
              <div
                className="cl-stage-bg absolute inset-0"
                style={{ "--glow": "#2563eb" } as CSSProperties}
              />
              <div className="relative">
                <p className="text-[12px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                  Your estimate
                </p>
                <p
                  className="cl-display mt-3 text-[clamp(2.8rem,5vw,4rem)] leading-none"
                  aria-live="polite"
                >
                  <Rolling value={inr(total)} />
                </p>
                <p className="mt-2 text-[13px] text-white/55">one-time · {chosen.delivery}</p>

                <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-[14px]">
                  <li className="flex justify-between gap-4">
                    <span>
                      {chosen.name} package{" "}
                      <span className="text-white/45">· {chosen.pages} pages</span>
                    </span>
                    <span className="tabular-nums">{inr(chosen.price)}</span>
                  </li>
                  {lines.map((l) => (
                    <li
                      key={l.name}
                      className="cl-line-in flex justify-between gap-4 text-white/80"
                    >
                      <span>+ {l.name}</span>
                      <span className="tabular-nums">{inr(l.price)}</span>
                    </li>
                  ))}
                </ul>

                {/* 50 / 30 / 20 */}
                <p className="mt-7 text-[12px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                  You pay in three steps
                </p>
                <div className="mt-3 flex h-2.5 gap-1 overflow-hidden rounded-full">
                  {paymentSchedule.map((s, i) => (
                    <span
                      key={s.label}
                      className="h-full rounded-full"
                      style={{
                        width: `${s.pct}%`,
                        background: ["#2563eb", "#38bdf8", "#67e8f9"][i],
                      }}
                    />
                  ))}
                </div>
                <ol className="mt-3 grid grid-cols-3 gap-3 text-[12px]">
                  {paymentSchedule.map((s) => (
                    <li key={s.label}>
                      <span className="block text-[15px] font-semibold tabular-nums">
                        {inr(Math.round((total * s.pct) / 100))}
                      </span>
                      <span className="text-white/55">
                        {s.pct}% · {s.label.toLowerCase()}
                      </span>
                    </li>
                  ))}
                </ol>

                <p className="mt-6 rounded-[14px] bg-white/[0.06] p-3.5 text-[12px] leading-relaxed text-white/65">
                  <span className="font-semibold text-white/85">Yearly, after launch:</span> domain{" "}
                  {run.domain} + hosting &amp; SSL {inr(run.hosting)}. Optional care plan{" "}
                  {inr(run.maintenance)}/yr from year 2 — updates, backups, monitoring and small
                  changes.
                </p>

                <a href="#inquiry" onClick={sendQuote} className="cl-btn cl-btn-light mt-6 w-full">
                  Send me this quote{" "}
                  <span className="cl-btn-arrow" aria-hidden>
                    →
                  </span>
                </a>
                <p className="mt-3 text-center text-[12px] text-white/45">
                  No commitment — I&apos;ll confirm everything in writing first.
                </p>
              </div>
            </aside>
          </div>
        </div>

        {/* ── compare every feature ── */}
        <div className="mt-12">
          <button
            type="button"
            aria-expanded={compareOpen}
            aria-controls="pkg-compare"
            onClick={() => setCompareOpen((o) => !o)}
            className="group flex w-full items-center justify-between gap-4 border-y border-[var(--cl-ink)]/15 py-6 text-left"
          >
            <span className="cl-display text-[clamp(1.4rem,2.4vw,2rem)]">
              Compare every feature
            </span>
            <span
              aria-hidden
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-current text-xl transition-transform duration-500 group-hover:bg-[var(--cl-ink)] group-hover:text-white ${
                compareOpen ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          <div
            id="pkg-compare"
            className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ gridTemplateRows: compareOpen ? "1fr" : "0fr" }}
          >
            <div className="min-h-0 overflow-hidden" inert={!compareOpen}>
              <div className="overflow-x-auto pt-6 pb-2">
                <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-[14px]">
                  <thead>
                    <tr>
                      <th className="w-[34%] pb-4 font-semibold text-[var(--cl-muted)]">Feature</th>
                      {packages.map((p) => (
                        <th
                          key={p.id}
                          className={`pb-4 font-semibold ${p.popular ? "text-[var(--cl-accent-ink)]" : ""}`}
                        >
                          {p.name}{" "}
                          <span className="font-normal text-[var(--cl-muted)]">
                            · {inr(p.price)}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {packageCompare.map((row) => (
                      <tr key={row.feature}>
                        <td className="border-t border-[var(--cl-rule)] py-3.5 pr-4 font-medium">
                          {row.feature}
                        </td>
                        {row.values.map((val, k) => (
                          <td
                            key={k}
                            className={`border-t border-[var(--cl-rule)] py-3.5 pr-4 text-[var(--cl-ink-2)] ${k === 1 ? "bg-[var(--cl-accent)]/[0.04]" : ""}`}
                          >
                            {val === true ? (
                              <Tick className="text-[var(--cl-accent)]" />
                            ) : val === false ? (
                              <span className="text-[#cbd5e1]">—</span>
                            ) : (
                              val
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[13px] text-[var(--cl-muted)]">
                You provide the logo, photos and text (or add logo design / content writing).
                Delivery starts once the advance and content are in. Not included: paid stock photos
                or plugins, social-media management and ads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
