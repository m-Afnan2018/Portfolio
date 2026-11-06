"use client";

/** Small interactive bits of the /hr brief (everything else is server-rendered). */
import { useState, useSyncExternalStore } from "react";
import { profile } from "@/data/profile";

// ── IST clock (minute precision) ────────────────────────────────────────────
const fmt = () =>
  new Intl.DateTimeFormat("en-US", { timeZone: profile.timezone, hour: "numeric", minute: "2-digit" }).format(new Date());
const hourIst = () =>
  Number(new Intl.DateTimeFormat("en-GB", { timeZone: profile.timezone, hour: "2-digit", hourCycle: "h23" }).format(new Date()));
const subscribeMinute = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};

/** "3:42 PM in India · working hours" — helps recruiters pick a time to call. */
export function LocalTime() {
  const time = useSyncExternalStore(subscribeMinute, fmt, () => "");
  const h = useSyncExternalStore(subscribeMinute, hourIst, () => -1);
  if (!time) return <span className="opacity-0">—</span>;
  const working = h >= 9 && h < 20;
  return (
    <span>
      {time} in India
      <span className="text-[var(--hr-muted)]"> · {working ? "working hours" : "outside working hours"}</span>
    </span>
  );
}

// ── copy email ──────────────────────────────────────────────────────────────
export function CopyEmailButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${profile.email}`;
        }
      }}
      aria-live="polite"
    >
      {copied ? "Copied ✓" : "Copy email"}
    </button>
  );
}

// ── print / save as PDF ─────────────────────────────────────────────────────
export function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      Print / Save PDF
    </button>
  );
}
