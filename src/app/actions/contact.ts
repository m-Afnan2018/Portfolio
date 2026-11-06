"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { contactSchema, type ContactResult } from "@/lib/contactSchema";

// naive in-memory rate limit: 5 messages / 10 min / IP (per server instance)
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

/** Server Action behind the terminal contact form. Sends mail via Resend. */
export async function sendContact(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "invalid input" };
  const { name, email, message, company } = parsed.data;
  if (company) return { ok: true }; // bot — pretend success

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  if (limited(ip)) return { ok: false, error: "429 Too Many Requests — try again in a few minutes" };

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.error("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL not configured");
    return { ok: false, error: "503 mail transport not configured — email me directly instead" };
  }

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `[portfolio] ${name} sent you a message`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) {
      console.error("[contact] resend error", error);
      return { ok: false, error: "502 upstream mailer error — please retry" };
    }
    return { ok: true };
  } catch (e) {
    console.error("[contact] send failed", e);
    return { ok: false, error: "500 failed to send — please retry" };
  }
}
