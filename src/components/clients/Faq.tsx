"use client";

/**
 * FAQ as a conversation.
 *
 * Left: the questions, as prompts. Right: a chat window — tap a prompt and the
 * visitor's bubble slides in, "Mohammad is typing…" bounces, then the answer
 * arrives and the visitor's ticks turn blue. The first question asks itself
 * when the section first comes into view. "Ask your own" accepts any question
 * and replies by pointing to the inquiry form (nothing is sent anywhere).
 * Every answer is also in the page as a plain list for search engines and
 * screen readers.
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "@/data/clients";
import { profile } from "@/data/profile";
import { BrandMark } from "@/components/brand/BrandMark";

type Msg =
  | { id: number; from: "client"; text: string; read: boolean }
  | { id: number; from: "me"; text: string; cta?: boolean }
  | { id: number; from: "typing" };

const ease = [0.16, 1, 0.3, 1] as const;
const reducedNow = () =>
  typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function Avatar({ who }: { who: "client" | "me" }) {
  return who === "me" ? (
    <BrandMark size={32} className="!rounded-full" />
  ) : (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#cbd5e1] to-[#94a3b8] text-[10px] font-semibold text-white">
      You
    </span>
  );
}

export function Faq() {
  const root = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [asked, setAsked] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const nextId = useRef(1);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /** visitor bubble → typing → answer */
  const converse = useCallback((question: string, answer: string, cta = false) => {
    const later = (fn: () => void, ms: number) =>
      timers.current.push(window.setTimeout(fn, reducedNow() ? 0 : ms));
    setBusy(true);
    const qid = nextId.current++;
    const tid = nextId.current++;
    const aid = nextId.current++;
    setMsgs((m) => [...m, { id: qid, from: "client", text: question, read: false }]);
    later(() => setMsgs((m) => [...m, { id: tid, from: "typing" }]), 500);
    later(
      () => {
        setMsgs((m) => [
          ...m
            .filter((x) => x.id !== tid)
            .map((x) => (x.id === qid && x.from === "client" ? { ...x, read: true } : x)),
          { id: aid, from: "me", text: answer, cta },
        ]);
        setBusy(false);
      },
      500 + Math.min(2200, 900 + answer.length * 7),
    );
  }, []);

  const ask = (i: number) => {
    if (busy) return;
    setAsked((s) => new Set(s).add(i));
    converse(faqs[i].q, faqs[i].a);
  };

  const askOwn = (e: FormEvent) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q || busy) return;
    setDraft("");
    converse(
      q,
      "Good question — I'd like to answer that one properly. Send it through the form below and I'll reply within a working day.",
      true,
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setMsgs([]);
    setAsked(new Set());
    setBusy(false);
  };

  // the first question asks itself when the chat first comes into view
  useEffect(() => {
    const el = root.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timers.current.push(
          window.setTimeout(() => {
            setAsked((s) => new Set(s).add(0));
            converse(faqs[0].q, faqs[0].a);
          }, 700),
        );
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [converse]);

  // keep the newest message in view — inside the chat only, never the page
  useEffect(() => {
    const b = body.current;
    if (b) b.scrollTo({ top: b.scrollHeight, behavior: reducedNow() ? "auto" : "smooth" });
  }, [msgs]);

  return (
    <section
      ref={root}
      id="faq"
      aria-labelledby="cl-faq"
      className="relative scroll-mt-16 overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:[--faq-h:min(660px,calc(100svh-160px))]">
        {/* ── the prompts (desktop: same height as the chat; the list scrolls) ── */}
        <div className="lg:col-span-5 lg:flex lg:h-[var(--faq-h)] lg:flex-col">
          <p data-reveal className="cl-eyebrow">
            FAQ
          </p>
          <h2
            id="cl-faq"
            data-split
            className="cl-display mt-4 text-[clamp(2.4rem,6vw,5.4rem)] leading-[0.95] lg:mt-3 lg:text-[clamp(2.6rem,4.2vw,4rem)]"
          >
            Good questions.
          </h2>
          <p
            data-reveal
            className="mt-5 max-w-md text-[17px] leading-relaxed text-[var(--cl-muted)] lg:mt-3 lg:text-[16px]"
          >
            Tap a question and I&apos;ll answer — just like we were chatting.
          </p>
          <p data-reveal className="mt-2 text-[14px] text-[var(--cl-muted)]">
            Prefer email?{" "}
            <a
              href={`mailto:${profile.email}`}
              className="font-semibold text-[var(--cl-accent-ink)] hover:underline"
            >
              {profile.email}
            </a>
          </p>

          <ul
            data-lenis-prevent
            className="no-scrollbar cl-faq-list -mx-5 mt-8 flex snap-x gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:mt-7 lg:block lg:min-h-0 lg:flex-1 lg:snap-none lg:space-y-2 lg:overflow-x-visible lg:overflow-y-auto lg:px-0 lg:py-1 lg:pr-1"
          >
            {faqs.map((f, i) => {
              const done = asked.has(i);
              return (
                <li key={f.q} className="shrink-0 snap-start">
                  <button
                    type="button"
                    onClick={() => ask(i)}
                    disabled={busy}
                    data-cursor="Ask"
                    className={`group flex w-[260px] items-center gap-3 rounded-[18px] border px-4 py-3 text-left text-[15px] font-medium transition-all duration-300 disabled:cursor-wait lg:w-full lg:rounded-[16px] lg:py-3 ${
                      done
                        ? "border-transparent bg-[var(--cl-soft)] text-[var(--cl-muted)]"
                        : "border-[var(--cl-rule)] bg-white hover:-translate-y-0.5 hover:border-[var(--cl-accent)] hover:shadow-[0_12px_30px_-16px_rgba(37,99,235,0.5)]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] transition-colors ${
                        done
                          ? "bg-[#22c55e] text-white"
                          : "bg-[var(--cl-accent-soft)] text-[var(--cl-accent)] group-hover:bg-[var(--cl-accent)] group-hover:text-white"
                      }`}
                    >
                      {done ? "✓" : "?"}
                    </span>
                    <span className="flex-1 leading-snug">{f.q}</span>
                    <span
                      aria-hidden
                      className="hidden text-[var(--cl-accent)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 lg:inline"
                    >
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── the chat ── */}
        <div className="lg:col-span-7">
          <div className="flex h-[min(640px,80svh)] flex-col overflow-hidden rounded-[32px] border border-[var(--cl-rule)] bg-white shadow-[0_40px_90px_-50px_rgba(11,17,32,0.45)] lg:h-[var(--faq-h)]">
            {/* header */}
            <div className="flex items-center gap-3 border-b border-[var(--cl-rule)] px-5 py-4">
              <span className="relative">
                <Avatar who="me" />
                <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#22c55e]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">{profile.name}</p>
                <p className="text-[12px] text-[var(--cl-muted)]">
                  <span className="text-[#16a34a]">online</span> · replies within a working day
                </p>
              </div>
              {msgs.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-[var(--cl-muted)] transition-colors hover:bg-[var(--cl-soft)] hover:text-[var(--cl-ink)]"
                >
                  ↺ Clear
                </button>
              )}
            </div>

            {/* messages */}
            <div
              ref={body}
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              data-lenis-prevent
              className="cl-chat-bg flex-1 overflow-y-auto px-4 py-6 sm:px-6"
            >
              <p className="mx-auto mb-5 w-fit rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-[var(--cl-muted)] shadow-sm">
                Today
              </p>
              {msgs.length === 0 && (
                <p className="mx-auto mt-16 max-w-[16rem] text-center text-[14px] text-[var(--cl-muted)]">
                  Pick a question to start the conversation 👋
                </p>
              )}
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {msgs.map((m) => {
                    const mine = m.from !== "client";
                    return (
                      <motion.li
                        key={m.id}
                        layout
                        initial={{ opacity: 0, y: 18, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.5, ease }}
                        style={{ originX: mine ? 1 : 0, originY: 1 }}
                        className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar who={mine ? "me" : "client"} />
                        {m.from === "typing" ? (
                          <span
                            className="flex items-center gap-1 rounded-[20px] rounded-br-[6px] bg-[var(--cl-accent)] px-4 py-3.5"
                            aria-label={`${profile.name} is typing`}
                          >
                            <i className="cl-typing" />
                            <i className="cl-typing [animation-delay:0.15s]" />
                            <i className="cl-typing [animation-delay:0.3s]" />
                          </span>
                        ) : m.from === "client" ? (
                          <div className="max-w-[80%]">
                            <p className="rounded-[20px] rounded-bl-[6px] border border-[var(--cl-rule)] bg-white px-4 py-2.5 text-[15px] leading-snug text-[var(--cl-ink)] shadow-[0_4px_14px_-10px_rgba(11,17,32,0.3)]">
                              {m.text}
                            </p>
                            <p className="mt-1 pl-1 text-[11px] text-[var(--cl-muted)]">
                              now{" "}
                              <span
                                className={`font-semibold transition-colors duration-500 ${m.read ? "text-[var(--cl-accent)]" : ""}`}
                                aria-label={m.read ? "read" : "delivered"}
                              >
                                ✓✓
                              </span>
                            </p>
                          </div>
                        ) : (
                          <div className="max-w-[80%]">
                            <p className="rounded-[20px] rounded-br-[6px] bg-[var(--cl-accent)] px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-[0_8px_20px_-12px_rgba(37,99,235,0.7)]">
                              {m.text}
                            </p>
                            {m.cta && (
                              <a
                                href="#inquiry"
                                className="mt-2 ml-auto flex w-fit items-center gap-1.5 rounded-full border border-[var(--cl-accent)] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[var(--cl-accent-ink)]"
                              >
                                Go to the form ↓
                              </a>
                            )}
                            <p className="mt-1 pr-1 text-right text-[11px] text-[var(--cl-muted)]">
                              Mohammad · now
                            </p>
                          </div>
                        )}
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>

            {/* ask your own */}
            <form
              onSubmit={askOwn}
              className="flex items-center gap-2 border-t border-[var(--cl-rule)] p-3"
            >
              <label htmlFor="faq-own" className="sr-only">
                Ask your own question
              </label>
              <input
                id="faq-own"
                value={draft}
                onChange={(e) => setDraft(e.target.value.slice(0, 200))}
                placeholder="Ask your own…"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full bg-[var(--cl-soft)] px-4 py-3 text-[15px] outline-none placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[var(--cl-accent)]/30"
              />
              <button
                type="submit"
                disabled={!draft.trim() || busy}
                aria-label="Send question"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--cl-accent)] text-white transition-all hover:scale-105 disabled:scale-100 disabled:opacity-40"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M3.4 2.6a.75.75 0 0 1 .82-.1l13 6.5a.75.75 0 0 1 0 1.34l-13 6.5a.75.75 0 0 1-1.05-.9L5.1 10 3.17 4a.75.75 0 0 1 .23-1.4ZM6.4 10.75l-1.5 4.66L14.76 10 4.9 5.6l1.5 4.65H11a.75.75 0 0 1 0 1.5H6.4Z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* every answer, as plain text, for search engines and screen readers */}
      <dl className="sr-only">
        {faqs.map((f) => (
          <div key={f.q}>
            <dt>{f.q}</dt>
            <dd>{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
