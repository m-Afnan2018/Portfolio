import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "name: at least 2 characters").max(80, "name: too long"),
  email: z.string().trim().email("email: not a valid address").max(120),
  message: z.string().trim().min(10, "message: tell me a little more (10+ chars)").max(4000, "message: max 4000 chars"),
  /** honeypot — real users never fill this */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactResult = { ok: true } | { ok: false; error: string };
