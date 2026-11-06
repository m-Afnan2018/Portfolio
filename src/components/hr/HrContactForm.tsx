"use client";

/** Plain, friendly contact form for /hr — same server action as the main site. */
import { useState, useTransition } from "react";
import { sendContact } from "@/app/actions/contact";
import { contactSchema } from "@/lib/contactSchema";
import { profile } from "@/data/profile";

type Status = { kind: "idle" } | { kind: "ok" } | { kind: "error"; message: string };

const field =
  "mt-1.5 w-full rounded-[10px] border border-[var(--hr-rule-strong)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--hr-ink)] placeholder:text-[#a3a6ad] outline-none transition-colors focus:border-[var(--hr-accent)]";

// errors from the shared schema read like "email: not a valid address" — tidy them for humans
const human = (msg: string) => {
  const m = msg
    .replace(/^\d{3}\s+/, "")
    .replace(/^(\w+):\s*/, (_, f: string) => `${f.charAt(0).toUpperCase()}${f.slice(1)}: `);
  return m.charAt(0).toUpperCase() + m.slice(1);
};

export function HrContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, start] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      setStatus({
        kind: "error",
        message: human(parsed.error.issues[0]?.message ?? "Please check the form"),
      });
      return;
    }
    start(async () => {
      const res = await sendContact(parsed.data);
      if (res.ok) {
        form.reset();
        setStatus({ kind: "ok" });
      } else setStatus({ kind: "error", message: human(res.error) });
    });
  };

  if (status.kind === "ok")
    return (
      <div
        className="flex flex-col items-start gap-3 border-t border-[var(--hr-rule)] pt-6"
        role="status"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--hr-ok-soft)] text-[var(--hr-ok)]">
          ✓
        </span>
        <p className="hr-display text-xl">Thanks — your message is on its way.</p>
        <p className="text-sm text-[var(--hr-muted)]">
          I&apos;ll reply to the email you provided, usually within a day.
        </p>
        <button
          type="button"
          className="hr-link text-sm text-[var(--hr-accent)]"
          onClick={() => setStatus({ kind: "idle" })}
        >
          Send another message
        </button>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium text-[var(--hr-ink-2)]">
        Your name
        <input name="name" autoComplete="name" required placeholder="Jane Doe" className={field} />
      </label>
      <label className="text-sm font-medium text-[var(--hr-ink-2)]">
        Work email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="jane@company.com"
          className={field}
        />
      </label>
      <label className="text-sm font-medium text-[var(--hr-ink-2)] sm:col-span-2">
        Message
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Role, team and a good time to talk…"
          className={`${field} resize-y`}
        />
      </label>
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="hr-btn hr-btn-primary disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
        <p
          aria-live="polite"
          className={`text-sm ${status.kind === "error" ? "text-[#b42318]" : "text-[var(--hr-muted)]"}`}
        >
          {status.kind === "error" ? (
            <>
              {status.message}{" "}
              <a className="underline" href={`mailto:${profile.email}`}>
                Email me directly
              </a>
            </>
          ) : (
            "Goes straight to my inbox."
          )}
        </p>
      </div>
    </form>
  );
}
