"use client";

/**
 * "Start a project" — a one-screen brief builder.
 *
 *  · right: four short steps that slide between each other —
 *      1 what you need · 2 budget & timeline · 3 the project · 4 your details
 *    chips instead of dropdowns, Enter / Back to move, a progress bar on top
 *  · left: the "project brief" card fills itself in live as you answer —
 *    values type in, the ring fills, a draft dot pulses; on send it's
 *    stamped SENT ✓
 *  · "Send me this quote" in Pricing (cl:quote) pre-fills it and jumps to step 3
 * Sends through the same server action as every other contact form.
 */
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sendContact } from "@/app/actions/contact";
import { contactSchema } from "@/lib/contactSchema";
import { inquiryOptions } from "@/data/clients";
import { profile } from "@/data/profile";

type Brief = {
  type: string;
  budget: string;
  timeline: string;
  details: string;
  website: string;
  name: string;
  email: string;
  phone: string;
  /** used only when waSame is off */
  whatsapp: string;
  waSame: boolean;
};
const EMPTY: Brief = {
  type: "",
  budget: "",
  timeline: "",
  details: "",
  website: "",
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  waSame: true,
};

const STEPS = ["What you need", "Budget & timeline", "Your project", "Your details"] as const;
const ease = [0.16, 1, 0.3, 1] as const;

const human = (msg: string) => {
  const m = msg
    .replace(/^\d{3}\s+/, "")
    .replace(/^(\w+):\s*/, (_, f: string) => `${f.charAt(0).toUpperCase()}${f.slice(1)}: `);
  return m.charAt(0).toUpperCase() + m.slice(1);
};
const emailOk = (e: string) => /\S+@\S+\.\S+/.test(e);
/** 7–15 digits, with optional +, spaces, dashes or brackets */
const phoneOk = (p: string) => {
  const digits = p.match(/\d/g)?.length ?? 0;
  return /^\+?[\d\s()-]+$/.test(p.trim()) && digits >= 7 && digits <= 15;
};

/** the first real sentence of the details (skips a pasted quote summary) */
const gist = (d: string) => {
  const lines = d
    .trim()
    .split("\n")
    .map((l) => l.trim());
  const own = lines.find(
    (l) => l && !/^(\+|Package:|Estimated total:|About my project:\s*$)/.test(l),
  );
  return own?.replace(/^About my project:\s*/, "") || lines[0] || "";
};

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-[15px] font-medium transition-all duration-300 ${
        on
          ? "border-[var(--cl-accent)] bg-[var(--cl-accent)] text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.8)]"
          : "border-[var(--cl-rule)] bg-white text-[var(--cl-ink-2)] hover:-translate-y-0.5 hover:border-[var(--cl-accent)]"
      }`}
    >
      {on && <span className="mr-1.5">✓</span>}
      {children}
    </button>
  );
}

/** one row of the live brief card */
function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[92px_1fr] items-baseline gap-3 border-t border-white/10 py-2">
      <dt className="text-[12px] tracking-[0.08em] text-white/45 uppercase">{label}</dt>
      <dd className="min-w-0 text-[14px]">
        {value ? (
          <span key={value} className="cl-type-in line-clamp-2 font-medium text-white">
            {value}
          </span>
        ) : (
          <span className="block h-[0.9em] w-24 rounded-full border border-dashed border-white/20" />
        )}
      </dd>
    </div>
  );
}

export function InquirySection() {
  const [b, setB] = useState<Brief>(EMPTY);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();
  const honey = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  const set = (k: keyof Brief, v: string) => {
    touched.current = true;
    setB((s) => ({ ...s, [k]: v }));
    setError("");
  };
  const go = (n: number) => {
    touched.current = true;
    setDir(n > step ? 1 : -1);
    setStep(n);
    setError("");
  };

  // focus the first field of each step (never on first load, never scrolling the page)
  useEffect(() => {
    if (!touched.current) return;
    const t = setTimeout(
      () =>
        panel.current
          ?.querySelector<HTMLElement>("textarea, input:not([tabindex='-1'])")
          ?.focus({ preventScroll: true }),
      450,
    );
    return () => clearTimeout(t);
  }, [step]);

  // "Send me this quote" from the pricing section
  useEffect(() => {
    const onQuote = (e: Event) => {
      const d = (e as CustomEvent<{ type: string; budget: string; details: string }>).detail;
      touched.current = true;
      setSent(false);
      setB((s) => ({ ...s, type: d.type, budget: d.budget, details: d.details }));
      setDir(1);
      setStep(2);
    };
    window.addEventListener("cl:quote", onQuote);
    return () => window.removeEventListener("cl:quote", onQuote);
  }, []);

  const okDetails = b.details.trim().length >= 10;
  const okName = b.name.trim().length >= 2;
  const okPhone = phoneOk(b.phone);
  const okWa = b.waSame || phoneOk(b.whatsapp);
  const valid = [!!b.type, !!b.budget && !!b.timeline, okDetails, okName && emailOk(b.email) && okPhone && okWa];
  const hint = [
    "Pick what you need help with",
    !b.budget ? "Pick a budget range" : "Pick a timeline",
    "Tell me a little more — 10+ characters",
    !okName ? "Add your name" : !emailOk(b.email) ? "Add a valid email" : !okPhone ? "Add a valid phone number" : "Add your WhatsApp number",
  ];
  const filled = [!!b.type, !!b.budget, !!b.timeline, okDetails, okName, emailOk(b.email), okPhone && okWa].filter(Boolean).length;
  const pct = Math.round((filled / 7) * 100);
  const waNumber = b.waSame ? b.phone.trim() : b.whatsapp.trim();

  const submit = () => {
    const header = [`Project: ${b.type}`, `Budget: ${b.budget}`, `Timeline: ${b.timeline}`];
    header.push(`Phone: ${b.phone.trim()}`, `WhatsApp: ${waNumber}${b.waSame ? " (same as phone)" : ""}`);
    if (b.website.trim()) header.push(`Current website: ${b.website.trim()}`);
    const parsed = contactSchema.safeParse({
      name: b.name,
      email: b.email,
      message: `${header.join("\n")}\n\n${b.details.trim()}`,
      company: honey.current?.value ?? "",
    });
    if (!parsed.success) {
      setError(human(parsed.error.issues[0]?.message ?? "Please check the form"));
      return;
    }
    start(async () => {
      const res = await sendContact(parsed.data);
      if (res.ok) setSent(true);
      else setError(human(res.error));
    });
  };

  const next = () => {
    if (!valid[step]) setError(hint[step]);
    else if (step < 3) go(step + 1);
    else submit();
  };

  const restart = () => {
    setB(EMPTY);
    setSent(false);
    setDir(-1);
    setStep(0);
  };

  const circ = 2 * Math.PI * 22;
  const input =
    "w-full rounded-[14px] border border-[var(--cl-rule)] bg-white px-4 py-3 text-[15px] text-[var(--cl-ink)] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[var(--cl-accent)] focus:ring-4 focus:ring-[var(--cl-accent)]/10";

  return (
    <section
      id="inquiry"
      aria-labelledby="cl-inquiry"
      className="relative overflow-hidden bg-[var(--cl-soft)] py-24 sm:py-28 lg:flex lg:min-h-[100svh] lg:items-center lg:py-0 lg:pt-[72px]"
    >
      {/* soft moving light */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="cl-blob absolute -top-[20%] -right-[10%] h-[60vh] w-[60vh] rounded-full bg-[#93c5fd] opacity-40 blur-[120px]" />
        <span className="cl-blob cl-blob-3 absolute -bottom-[30%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-[#bae6fd] opacity-50 blur-[110px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1320px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-14 lg:py-8">
        {/* ── left: heading + the live brief ── */}
        <div className="lg:col-span-5">
          <p data-reveal className="cl-eyebrow">
            Start a project
          </p>
          <h2
            id="cl-inquiry"
            data-split
            className="cl-display mt-3 text-[clamp(2.4rem,4.4vw,4rem)] leading-[0.95]"
          >
            Tell me what you&apos;re building.
          </h2>
          <p
            data-reveal
            className="mt-4 max-w-md text-[16px] leading-relaxed text-[var(--cl-muted)]"
          >
            Four quick steps. I&apos;ll reply within one working day with questions, a rough
            estimate and a time to talk.
          </p>

          {/* the brief, filling in live */}
          <div
            data-reveal
            className={`relative mt-6 overflow-hidden rounded-[26px] bg-[var(--cl-ink)] p-5 text-white shadow-[0_40px_80px_-40px_rgba(11,17,32,0.7)] transition-transform duration-700 sm:p-6 ${
              sent ? "rotate-[-1.5deg]" : ""
            }`}
          >
            <div
              className="cl-stage-bg absolute inset-0"
              style={{ "--glow": "#2563eb" } as CSSProperties}
            />
            <div className="relative">
              <div className="flex items-center gap-4">
                <svg viewBox="0 0 52 52" className="h-12 w-12 shrink-0 -rotate-90" aria-hidden>
                  <circle
                    cx="26"
                    cy="26"
                    r="22"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="26"
                    cy="26"
                    r="22"
                    fill="none"
                    stroke={pct === 100 ? "#4ade80" : "#38bdf8"}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - pct / 100)}
                    style={{
                      transition: "stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1), stroke 0.4s",
                    }}
                  />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="cl-display text-[18px]">Project brief</p>
                  <p className="flex items-center gap-2 text-[12px] text-white/55">
                    {sent ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" /> Sent to{" "}
                        {profile.firstName}
                      </>
                    ) : (
                      <>
                        <span className="cl-blink-dot h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />{" "}
                        Draft · {pct}% complete
                      </>
                    )}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-white/35">{STEPS[step]}</span>
              </div>
              <dl className="mt-4">
                <BriefRow label="Project" value={b.type} />
                <BriefRow label="Budget" value={b.budget} />
                <BriefRow label="Timeline" value={b.timeline} />
                <BriefRow label="Details" value={okDetails ? gist(b.details) : ""} />
                <BriefRow
                  label="From"
                  value={
                    okName
                      ? `${b.name.trim()}${emailOk(b.email) ? ` · ${b.email.trim()}` : ""}`
                      : ""
                  }
                />
                <BriefRow
                  label="Phone"
                  value={okPhone ? `${b.phone.trim()}${okWa ? ` · WhatsApp ${b.waSame ? "✓ same" : waNumber}` : ""}` : ""}
                />
              </dl>
            </div>
            {sent && (
              <span className="cl-stamp absolute right-5 bottom-5 rotate-[-12deg] rounded-[10px] border-[3px] border-[#4ade80] bg-[var(--cl-ink)]/80 px-3 py-1 text-[18px] font-extrabold tracking-[0.12em] text-[#4ade80] uppercase">
                Sent ✓
              </span>
            )}
          </div>

          <p data-reveal className="mt-4 text-[13px] text-[var(--cl-muted)]">
            Or directly:{" "}
            <a
              href={`mailto:${profile.email}`}
              className="cl-sweep-dark font-semibold text-[var(--cl-ink)]"
            >
              {profile.email}
            </a>{" "}
            ·{" "}
            <a
              href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="cl-sweep-dark font-semibold text-[var(--cl-ink)]"
            >
              WhatsApp
            </a>
          </p>
        </div>

        {/* ── right: the steps ── */}
        <div className="lg:col-span-7">
          <div className="flex h-[540px] flex-col overflow-hidden rounded-[30px] border border-[var(--cl-rule)] bg-white shadow-[0_40px_90px_-50px_rgba(11,17,32,0.45)] lg:h-[min(600px,calc(100svh-150px))]">
            {sent ? (
              <div
                className="flex flex-1 flex-col items-center justify-center p-8 text-center"
                role="status"
              >
                <span className="cl-done-ring flex h-20 w-20 items-center justify-center rounded-full bg-[var(--cl-accent)] text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    aria-hidden
                  >
                    <path
                      className="cl-draw"
                      d="M5 12.5l4.2 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="cl-display mt-6 text-[clamp(1.8rem,3vw,2.4rem)] leading-tight">
                  Thanks, {b.name.trim().split(" ")[0]} — it&apos;s on my desk.
                </p>
                <p className="mt-3 max-w-sm text-[15px] text-[var(--cl-muted)]">
                  I&apos;ll reply to {b.email.trim()} within one working day with next steps and a
                  time for a quick call.
                </p>
                <button
                  type="button"
                  onClick={restart}
                  className="mt-7 text-sm font-semibold text-[var(--cl-accent-ink)] underline-offset-4 hover:underline"
                >
                  Start another brief
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  next();
                }}
                noValidate
                className="flex min-h-0 flex-1 flex-col"
              >
                {/* progress */}
                <div className="border-b border-[var(--cl-rule)] px-6 pt-5 pb-4 sm:px-8">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold">
                      Step {step + 1}{" "}
                      <span className="font-normal text-[var(--cl-muted)]">
                        of 4 · {STEPS[step]}
                      </span>
                    </span>
                    <span className="font-mono text-[var(--cl-muted)]">
                      {String(step + 1).padStart(2, "0")}/04
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden>
                    {STEPS.map((s, i) => (
                      <span
                        key={s}
                        className="h-1.5 overflow-hidden rounded-full bg-[var(--cl-rule)]"
                      >
                        <span
                          className="block h-full origin-left rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{
                            transform: `scaleX(${i < step ? 1 : i === step ? (valid[i] ? 1 : 0.4) : 0})`,
                          }}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                {/* the step */}
                <div ref={panel} className="relative min-h-0 flex-1 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: dir * 60, filter: "blur(4px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: dir * -60, filter: "blur(4px)" }}
                      transition={{ duration: 0.5, ease }}
                      className="absolute inset-0 overflow-y-auto px-6 py-7 sm:px-8"
                      data-lenis-prevent
                    >
                      {step === 0 && (
                        <fieldset>
                          <legend className="cl-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">
                            What can I help you with?
                          </legend>
                          <p className="mt-2 text-[15px] text-[var(--cl-muted)]">
                            Pick the closest — we&apos;ll refine it together.
                          </p>
                          <div className="mt-6 flex flex-wrap gap-2.5">
                            {inquiryOptions.projectTypes.map((t) => (
                              <Chip
                                key={t}
                                on={b.type === t}
                                onClick={() => {
                                  set("type", t);
                                  setTimeout(() => {
                                    setDir(1);
                                    setStep(1);
                                  }, 380);
                                }}
                              >
                                {t}
                              </Chip>
                            ))}
                          </div>
                        </fieldset>
                      )}

                      {step === 1 && (
                        <div className="space-y-7">
                          <fieldset>
                            <legend className="cl-display text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight">
                              What&apos;s your budget?
                            </legend>
                            <div className="mt-4 flex flex-wrap gap-2.5">
                              {inquiryOptions.budgets.map((x) => (
                                <Chip key={x} on={b.budget === x} onClick={() => set("budget", x)}>
                                  {x}
                                </Chip>
                              ))}
                            </div>
                          </fieldset>
                          <fieldset>
                            <legend className="cl-display text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight">
                              And the timeline?
                            </legend>
                            <div className="mt-4 flex flex-wrap gap-2.5">
                              {inquiryOptions.timelines.map((x) => (
                                <Chip
                                  key={x}
                                  on={b.timeline === x}
                                  onClick={() => set("timeline", x)}
                                >
                                  {x}
                                </Chip>
                              ))}
                            </div>
                          </fieldset>
                        </div>
                      )}

                      {step === 2 && (
                        <div>
                          <label
                            htmlFor="inq-details"
                            className="cl-display block text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight"
                          >
                            Tell me about the project.
                          </label>
                          <p className="mt-2 text-[15px] text-[var(--cl-muted)]">
                            Goals, sites you like, must-have features, deadlines — anything helps.
                          </p>
                          <textarea
                            id="inq-details"
                            rows={5}
                            value={b.details}
                            onChange={(e) => set("details", e.target.value.slice(0, 3000))}
                            placeholder="e.g. A website for my clinic with online booking, in English and Hindi…"
                            className={`${input} mt-5 resize-none`}
                          />
                          <div className="mt-1.5 flex justify-end text-[12px] text-[var(--cl-muted)] tabular-nums">
                            {b.details.length} / 3000
                          </div>
                          <label htmlFor="inq-site" className="block text-[14px] font-semibold">
                            Current website{" "}
                            <span className="font-normal text-[var(--cl-muted)]">(optional)</span>
                          </label>
                          <input
                            id="inq-site"
                            type="url"
                            inputMode="url"
                            value={b.website}
                            onChange={(e) => set("website", e.target.value)}
                            placeholder="https://"
                            className={`${input} mt-2`}
                          />
                        </div>
                      )}

                      {step === 3 && (
                        <div>
                          <p className="cl-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">
                            Last one — where do I reply?
                          </p>
                          <p className="mt-2 text-[15px] text-[var(--cl-muted)]">
                            No newsletters, no spam. Just my reply.
                          </p>
                          <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <label className="text-[14px] font-semibold">
                              Your name
                              <input
                                value={b.name}
                                onChange={(e) => set("name", e.target.value)}
                                autoComplete="name"
                                placeholder="Jane Doe"
                                className={`${input} mt-2`}
                              />
                            </label>
                            <label className="text-[14px] font-semibold">
                              Email
                              <input
                                type="email"
                                value={b.email}
                                onChange={(e) => set("email", e.target.value)}
                                autoComplete="email"
                                placeholder="jane@yourbusiness.com"
                                className={`${input} mt-2`}
                              />
                            </label>
                            <label className="text-[14px] font-semibold">
                              Phone number
                              <input
                                type="tel"
                                inputMode="tel"
                                value={b.phone}
                                onChange={(e) => set("phone", e.target.value.slice(0, 20))}
                                autoComplete="tel"
                                placeholder="+91 98765 43210"
                                className={`${input} mt-2`}
                              />
                            </label>
                            <div className="text-[14px] font-semibold">
                              <span className="flex items-center justify-between gap-3">
                                WhatsApp
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={b.waSame}
                                  onClick={() => setB((s) => ({ ...s, waSame: !s.waSame }))}
                                  className="flex items-center gap-2 text-[12px] font-medium text-[var(--cl-muted)]"
                                >
                                  Same number
                                  <span aria-hidden className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${b.waSame ? "bg-[#22c55e]" : "bg-[#cbd5e1]"}`}>
                                    <span
                                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${b.waSame ? "translate-x-4" : ""}`}
                                    />
                                  </span>
                                </button>
                              </span>
                              {b.waSame ? (
                                <span className="mt-2 flex h-[50px] items-center gap-2.5 rounded-[14px] border border-dashed border-[#22c55e]/50 bg-[#22c55e]/[0.06] px-4 text-[15px] font-normal text-[var(--cl-ink-2)]">
                                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#16a34a]" fill="currentColor" aria-hidden>
                                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.4-.9-2.9-1.2-4.7-4.1-4.8-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
                                  </svg>
                                  <span className="truncate">{okPhone ? b.phone.trim() : "Uses your phone number"}</span>
                                </span>
                              ) : (
                                <input
                                  type="tel"
                                  inputMode="tel"
                                  aria-label="WhatsApp number"
                                  value={b.whatsapp}
                                  onChange={(e) => set("whatsapp", e.target.value.slice(0, 20))}
                                  placeholder="+91 98765 43210"
                                  className={`${input} mt-2 font-normal`}
                                />
                              )}
                            </div>
                          </div>
                          {/* honeypot */}
                          <input
                            ref={honey}
                            type="text"
                            name="company"
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden
                            className="hidden"
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* nav */}
                <div className="flex items-center gap-3 border-t border-[var(--cl-rule)] px-6 py-4 sm:px-8">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => go(step - 1)}
                      className="rounded-full px-4 py-2.5 text-[14px] font-semibold text-[var(--cl-muted)] transition-colors hover:bg-[var(--cl-soft)] hover:text-[var(--cl-ink)]"
                    >
                      ← Back
                    </button>
                  )}
                  <p
                    aria-live="polite"
                    className={`flex-1 text-[13px] ${error ? "text-[#b42318]" : "text-[var(--cl-muted)]"}`}
                  >
                    {error ||
                      (step === 3
                        ? "Free, no obligation."
                        : step === 0
                          ? "Takes about a minute."
                          : "Press Enter to continue.")}
                  </p>
                  <button
                    type="submit"
                    disabled={pending}
                    className={`cl-btn !h-12 shrink-0 !px-6 transition-opacity ${valid[step] ? "cl-btn-primary cl-btn-glow" : "cl-btn-dark opacity-50"} disabled:opacity-60`}
                  >
                    {pending ? "Sending…" : step === 3 ? "Send brief" : "Continue"}
                    {!pending && (
                      <span className="cl-btn-arrow" aria-hidden>
                        →
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
