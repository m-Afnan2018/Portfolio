"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useId } from "react";
import { Mail, Phone, MapPin, Send, ExternalLink, ArrowUpRight } from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const contactItems = [
  { icon: Mail,        label: "Email",    value: "hs3547454@gmail.com",         href: "mailto:hs3547454@gmail.com",          color: "#A78BFA" },
  { icon: Phone,       label: "Phone",    value: "+91 88514 37549",             href: "tel:+918851437549",                   color: "#F59E0B" },
  { icon: MapPin,      label: "Location", value: "Sahibabad, Ghaziabad, India", href: null,                                  color: "#34D399" },
  { icon: ExternalLink,label: "LinkedIn", value: "linkedin.com/in/harshsharma", href: "https://linkedin.com/in/harshsharma", color: "#38BDF8" },
];

export default function Contact() {
  const ref      = useRef<HTMLDivElement>(null);
  const inView   = useInView(ref, { once: true, margin: "-60px" });
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const formId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("sent");
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-250
    focus:outline-none focus:ring-2 focus:ring-violet-500/60
  `;
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border)",
    color: "var(--fg-primary)",
    fontFamily: "var(--font-body)",
    minHeight: "48px",
  };

  return (
    <section id="contact" className="relative py-28 overflow-hidden" ref={ref}>
      <div
        className="blob"
        style={{ width: 600, height: 400, top: "30%", left: "30%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="tag">Contact</span>
          <div className="h-px flex-1 max-w-xs" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.35), transparent)" }} />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.08, ease: EXPO_OUT }}
          className="mb-14"
        >
          <h2
            className="text-4xl md:text-5xl font-black tracking-tight mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Let&apos;s Create Something{" "}
            <span className="gradient-text">Remarkable</span>
          </h2>
          <p className="text-base max-w-lg" style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}>
            Have a project in mind? I&apos;d love to collaborate and bring your brand vision to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ── Left info ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12, ease: EXPO_OUT }}
            className="lg:col-span-2 space-y-6"
          >
            {contactItems.map(({ icon: Icon, label, value, href, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.07, ease: EXPO_OUT }}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18`, border: `1px solid ${color}28` }}
                  aria-hidden
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm font-medium flex items-center gap-1 hover:text-white transition-colors"
                      style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}
                    >
                      {value}
                      {href.startsWith("http") && (
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                      )}
                    </a>
                  ) : (
                    <span className="text-sm font-medium" style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}>
                      {value}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.55, ease: EXPO_OUT }}
              className="glass-card p-5 mt-4"
              style={{ borderColor: "rgba(52,211,153,0.25)" }}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" aria-hidden />
                <span className="text-emerald-400 font-semibold text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  Available for Projects
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>
                Taking on freelance projects and collaborations. Typical response: within 24 hours.
              </p>
            </motion.div>
          </motion.div>

          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease: EXPO_OUT }}
            className="lg:col-span-3"
          >
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EXPO_OUT }}
                className="glass-card p-12 text-center h-full min-h-[320px] flex flex-col items-center justify-center"
                style={{ borderColor: "rgba(52,211,153,0.25)" }}
                role="alert"
              >
                <div className="text-4xl mb-4" aria-hidden>✓</div>
                <h3 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  Message Sent!
                </h3>
                <p style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}>
                  Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card p-7 space-y-5"
                noValidate
                aria-label="Contact form"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor={`${formId}-name`}
                      className="block text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
                    >
                      Name <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <input
                      id={`${formId}-name`}
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Your Name"
                      className={inputClass}
                      style={inputStyle}
                      {...field("name")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`${formId}-email`}
                      className="block text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
                    >
                      Email <span className="text-red-400" aria-label="required">*</span>
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="your@email.com"
                      className={inputClass}
                      style={inputStyle}
                      {...field("email")}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-subject`}
                    className="block text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
                  >
                    Subject <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <input
                    id={`${formId}-subject`}
                    type="text"
                    required
                    placeholder="Project Brief or Enquiry"
                    className={inputClass}
                    style={inputStyle}
                    {...field("subject")}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-message`}
                    className="block text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
                  >
                    Message <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <textarea
                    id={`${formId}-message`}
                    required
                    rows={5}
                    placeholder="Tell me about your project and goals..."
                    className={inputClass}
                    style={{ ...inputStyle, resize: "none" }}
                    {...field("message")}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={status !== "sending" ? { scale: 1.02, y: -2 } : {}}
                  whileTap={status !== "sending" ? { scale: 0.97 } : {}}
                  transition={{ duration: 0.18, ease: EXPO_OUT }}
                  className="btn-primary btn-glow w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-busy={status === "sending"}
                >
                  {status === "sending" ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        aria-hidden
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
