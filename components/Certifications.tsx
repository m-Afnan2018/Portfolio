"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, GraduationCap, CheckCircle2 } from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const certifications = [
  {
    title: "100 Hours Mobile Film Making",
    issuer: "MAAC — Maya Academy of Advanced Cinematics",
    iconLabel: "MFM",
    color: "#F59E0B",
    skills: ["Mobile Cinematography", "Storytelling", "Post-production"],
  },
  {
    title: "DFM 24FPS — Diploma in Film Making",
    issuer: "MAAC — Maya Academy of Advanced Cinematics",
    iconLabel: "DFM",
    color: "#A78BFA",
    skills: ["Film Direction", "Visual Storytelling", "Motion Design"],
  },
  {
    title: "Vector Design",
    issuer: "MAAC — Maya Academy of Advanced Cinematics",
    iconLabel: "VD",
    color: "#34D399",
    skills: ["Adobe Illustrator", "Vector Illustration", "Icon Design"],
  },
];

export default function Certifications() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="certifications" className="relative py-28 overflow-hidden" ref={ref}>
      <div
        className="blob"
        style={{ width: 380, height: 320, bottom: "10%", left: "30%", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="tag">Education & Certifications</span>
          <div className="h-px flex-1 max-w-[200px]" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.35), transparent)" }} />
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.08, ease: EXPO_OUT }}
          className="mb-12"
        >
          <h3
            className="text-sm font-semibold mb-6 flex items-center gap-2 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-body)", color: "var(--fg-muted)" }}
          >
            <GraduationCap size={16} style={{ color: "var(--accent-light)" }} aria-hidden />
            Education
          </h3>

          <div className="glass-card p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
              <div>
                <h4
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--fg-primary)" }}
                >
                  Diploma in Film Making (DFM 24FPS) &amp; Vector Design
                </h4>
                <p className="font-semibold text-sm mb-4" style={{ color: "var(--accent-light)" }}>
                  MAAC — Maya Academy of Advanced Cinematics
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}>
                  Specialized training in visual design, motion picture fundamentals, and digital illustration.
                </p>
              </div>
              <time
                className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold self-start"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--fg-secondary)",
                  fontFamily: "var(--font-body)",
                  whiteSpace: "nowrap",
                }}
                dateTime="2023/2024"
              >
                2023 – 2024
              </time>
            </div>
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.16, ease: EXPO_OUT }}
        >
          <h3
            className="text-sm font-semibold mb-6 flex items-center gap-2 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-body)", color: "var(--fg-muted)" }}
          >
            <Award size={16} style={{ color: "var(--gold)" }} aria-hidden />
            Certifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {certifications.map((cert, i) => (
              <motion.article
                key={cert.title}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.22 + i * 0.1, ease: EXPO_OUT }}
                className="glass-card p-6 cursor-default"
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black"
                    style={{
                      background: `${cert.color}18`,
                      border: `1px solid ${cert.color}30`,
                      color: cert.color,
                      fontFamily: "var(--font-heading)",
                    }}
                    aria-hidden
                  >
                    {cert.iconLabel}
                  </div>
                  <CheckCircle2 size={18} style={{ color: cert.color }} aria-label="Certified" />
                </div>

                <h4
                  className="font-bold text-sm leading-snug mb-2"
                  style={{ color: "var(--fg-primary)", fontFamily: "var(--font-heading)" }}
                >
                  {cert.title}
                </h4>
                <p className="text-xs mb-5" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                  {cert.issuer}
                </p>

                <div className="flex flex-wrap gap-2" role="list" aria-label="Skills covered">
                  {cert.skills.map((s) => (
                    <span
                      key={s}
                      role="listitem"
                      className="text-xs px-2.5 py-1 rounded-md font-medium"
                      style={{ background: `${cert.color}15`, color: cert.color, fontFamily: "var(--font-body)" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
