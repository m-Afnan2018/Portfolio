"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Layers, PenTool, Type, Palette,
  LayoutGrid, Printer, Monitor, Eye,
} from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const tools = [
  { name: "Adobe Photoshop",   level: 92, color: "#31A8FF", icon: "Ps" },
  { name: "Adobe Illustrator", level: 88, color: "#FF9A00", icon: "Ai" },
];

const softSkills = [
  { name: "Creative Direction",   pct: 90, color: "#A78BFA" },
  { name: "Client Communication", pct: 88, color: "#38BDF8" },
  { name: "Project Management",   pct: 85, color: "#34D399" },
  { name: "Team Mentoring",       pct: 82, color: "#F59E0B" },
  { name: "Time Management",      pct: 87, color: "#F472B6" },
];

const disciplines = [
  { name: "Brand Identity",       Icon: Layers,     desc: "Cohesive visual systems that resonate with audiences.",               color: "#A78BFA" },
  { name: "Logo Design",          Icon: PenTool,    desc: "Distinctive marks that communicate brand essence instantly.",          color: "#F59E0B" },
  { name: "Typography",           Icon: Type,       desc: "Selecting and pairing type to elevate communication.",                 color: "#38BDF8" },
  { name: "Color Theory",         Icon: Palette,    desc: "Applying color psychology to create emotional connections.",           color: "#34D399" },
  { name: "Layout Design",        Icon: LayoutGrid, desc: "Structuring elements for clarity, hierarchy, and impact.",            color: "#F472B6" },
  { name: "Print Design",         Icon: Printer,    desc: "Designing for physical media — from cards to billboards.",            color: "#FB923C" },
  { name: "Digital Design",       Icon: Monitor,    desc: "Assets optimized for screens and digital platforms.",                 color: "#60A5FA" },
  { name: "Visual Communication", Icon: Eye,        desc: "Translating complex ideas into clear, compelling visuals.",           color: "#A78BFA" },
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

      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="tag">Skills & Expertise</span>
          <div className="h-px flex-1 max-w-[200px]" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.35), transparent)" }} />
        </motion.div>

        {/* Top row: Design Software + Professional Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Design Software */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EXPO_OUT }}
            className="glass-card p-8"
          >
            <h3
              className="text-base font-bold mb-8 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-heading)", color: "var(--fg-muted)", fontSize: "0.72rem", letterSpacing: "0.1em" }}
            >
              Design Software
            </h3>
            <div className="space-y-8">
              {tools.map((tool, i) => (
                <div key={tool.name}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: `${tool.color}20`, color: tool.color, border: `1px solid ${tool.color}30`, fontFamily: "var(--font-heading)" }}
                      aria-hidden
                    >
                      {tool.icon}
                    </div>
                    <span className="flex-1 text-sm font-semibold" style={{ color: "var(--fg-primary)", fontFamily: "var(--font-body)" }}>
                      {tool.name}
                    </span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: tool.color, fontFamily: "var(--font-heading)" }}>
                      {tool.level}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    role="progressbar"
                    aria-valuenow={tool.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${tool.name} proficiency`}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${tool.color}70, ${tool.color})` }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${tool.level}%` } : {}}
                      transition={{ duration: 1.3, delay: 0.2 + i * 0.15, ease: EXPO_OUT }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="mt-8 pt-7" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>
                Languages
              </p>
              <div className="flex gap-3">
                {[{ lang: "English", level: "Professional" }, { lang: "Hindi", level: "Native" }].map((l) => (
                  <div
                    key={l.lang}
                    className="flex-1 rounded-xl px-4 py-3 text-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}
                  >
                    <div className="text-sm font-bold mb-0.5" style={{ color: "var(--fg-primary)", fontFamily: "var(--font-heading)" }}>{l.lang}</div>
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
              className="text-base font-bold mb-8"
              style={{ fontFamily: "var(--font-heading)", color: "var(--fg-muted)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              Professional Skills
            </h3>
            <div className="space-y-6">
              {softSkills.map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-sm font-semibold" style={{ color: "var(--fg-primary)", fontFamily: "var(--font-body)" }}>
                      {skill.name}
                    </span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: skill.color, fontFamily: "var(--font-heading)" }}>
                      {skill.pct}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    role="progressbar"
                    aria-valuenow={skill.pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${skill.name} proficiency`}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${skill.color}70, ${skill.color})` }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.pct}%` } : {}}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: EXPO_OUT }}
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
            className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] mb-5"
            style={{ fontFamily: "var(--font-body)", color: "var(--fg-muted)" }}
          >
            Design Disciplines
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {disciplines.map(({ name, Icon, desc, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.35 + i * 0.05, ease: EXPO_OUT }}
                className="glass-card p-5 cursor-default group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: `${color}16`, border: `1px solid ${color}28` }}
                  aria-hidden
                >
                  <Icon size={17} style={{ color }} />
                </div>
                <h4
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--fg-primary)", fontFamily: "var(--font-heading)" }}
                >
                  {name}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
