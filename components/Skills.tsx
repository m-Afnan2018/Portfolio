"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const tools = [
  { name: "Adobe Photoshop", level: 92, color: "#31A8FF", icon: "Ps" },
  { name: "Adobe Illustrator", level: 88, color: "#FF9A00", icon: "Ai" },
];

const softSkills = [
  { name: "Creative Direction",          pct: 90, color: "#A78BFA" },
  { name: "Client Communication",        pct: 88, color: "#38BDF8" },
  { name: "Project Management",          pct: 85, color: "#34D399" },
  { name: "Team Mentoring",              pct: 82, color: "#F59E0B" },
  { name: "Time Management",             pct: 87, color: "#F472B6" },
];

const disciplines = [
  { name: "Brand Identity",         icon: "◈", desc: "Cohesive visual systems that resonate with audiences." },
  { name: "Logo Design",            icon: "◎", desc: "Distinctive marks that communicate brand essence instantly." },
  { name: "Typography",             icon: "Aa", desc: "Selecting and pairing type to elevate communication." },
  { name: "Color Theory",           icon: "◉", desc: "Applying color psychology to create emotional connections." },
  { name: "Layout Design",          icon: "▦", desc: "Structuring elements for clarity, hierarchy, and impact." },
  { name: "Print Design",           icon: "◻", desc: "Designing for physical media — cards to billboards." },
  { name: "Digital Design",         icon: "⬡", desc: "Assets optimized for screens and digital platforms." },
  { name: "Visual Communication",   icon: "◈", desc: "Translating complex ideas into clear, compelling visuals." },
];

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="skills" className="relative py-28 overflow-hidden" ref={ref}>
      <div
        className="blob"
        style={{ width: 480, height: 380, top: "20%", right: "-10%", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="flex items-center gap-4 mb-14"
        >
          <span className="tag">Skills & Expertise</span>
          <div className="h-px flex-1 max-w-xs" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.35), transparent)" }} />
        </motion.div>

        {/* Top row: Tools + Professional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Design Software */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EXPO_OUT }}
            className="glass-card p-8"
          >
            <h3
              className="text-lg font-bold mb-7"
              style={{ fontFamily: "var(--font-heading)", color: "var(--fg-primary)" }}
            >
              Design Software
            </h3>
            <div className="space-y-7">
              {tools.map((tool, i) => (
                <div key={tool.name}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{ background: `${tool.color}20`, color: tool.color, border: `1px solid ${tool.color}30`, fontFamily: "var(--font-heading)" }}
                      aria-hidden
                    >
                      {tool.icon}
                    </div>
                    <span className="flex-1 text-sm font-medium" style={{ color: "var(--fg-primary)", fontFamily: "var(--font-body)" }}>
                      {tool.name}
                    </span>
                    <span
                      className="text-xs font-semibold tabular-nums"
                      style={{ color: tool.color, fontFamily: "var(--font-heading)" }}
                    >
                      {tool.level}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    role="progressbar"
                    aria-valuenow={tool.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${tool.name} proficiency`}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${tool.color}88, ${tool.color})` }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${tool.level}%` } : {}}
                      transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: EXPO_OUT }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>
                Languages
              </p>
              <div className="flex gap-3">
                {[{ lang: "English", level: "Professional" }, { lang: "Hindi", level: "Native" }].map((l) => (
                  <div
                    key={l.lang}
                    className="flex-1 rounded-xl px-4 py-3 text-center transition-colors duration-200"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}
                  >
                    <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--fg-primary)", fontFamily: "var(--font-heading)" }}>{l.lang}</div>
                    <div className="text-xs" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>{l.level}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Professional Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EXPO_OUT }}
            className="glass-card p-8"
          >
            <h3
              className="text-lg font-bold mb-7"
              style={{ fontFamily: "var(--font-heading)", color: "var(--fg-primary)" }}
            >
              Professional Skills
            </h3>
            <div className="space-y-5">
              {softSkills.map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: "var(--fg-primary)", fontFamily: "var(--font-body)" }}>
                      {skill.name}
                    </span>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: skill.color, fontFamily: "var(--font-heading)" }}>
                      {skill.pct}%
                    </span>
                  </div>
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    role="progressbar"
                    aria-valuenow={skill.pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${skill.name} proficiency`}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})` }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.pct}%` } : {}}
                      transition={{ duration: 1.1, delay: 0.3 + i * 0.1, ease: EXPO_OUT }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Disciplines grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: EXPO_OUT }}
        >
          <h3
            className="text-lg font-bold mb-7"
            style={{ fontFamily: "var(--font-heading)", color: "var(--fg-primary)" }}
          >
            Design Disciplines
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {disciplines.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.05, ease: EXPO_OUT }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-5 cursor-default group"
              >
                <div
                  className="text-xl mb-3 transition-colors duration-300"
                  style={{ color: "var(--accent-light)" }}
                  aria-hidden
                >
                  {d.icon}
                </div>
                <h4
                  className="text-sm font-semibold mb-1.5"
                  style={{ color: "var(--fg-primary)", fontFamily: "var(--font-heading)" }}
                >
                  {d.name}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>
                  {d.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
