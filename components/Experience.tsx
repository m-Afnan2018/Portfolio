"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, ArrowUpRight } from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const experiences = [
  {
    title: "Senior Graphic Designer",
    company: "Ganesyx Pvt. Ltd.",
    period: "May 2025 – Present",
    type: "Full-time",
    accentColor: "#A78BFA",
    highlights: [
      "Lead end-to-end design and execution of creative assets across digital and print platforms, maintaining brand consistency and high visual standards.",
      "Collaborate directly with marketing and content teams to conceptualize impactful campaigns aligned with business objectives.",
      "Manage multiple concurrent design projects, prioritizing tasks to meet tight deadlines without compromising quality.",
      "Mentor and guide junior designers on design principles, workflow best practices, and brand guidelines.",
      "Develop visual identity systems, social media graphics, and promotional materials that elevated brand digital presence.",
    ],
  },
  {
    title: "Graphic Designer",
    company: "Freelance",
    period: "January 2024 – May 2025",
    type: "Freelance",
    accentColor: "#F59E0B",
    highlights: [
      "Designed a distinctive brand logo for a pharmaceutical company capturing their commitment to quality and medical professionalism — client reported strong positive brand recognition.",
      "Delivered client-ready design projects within agreed timelines, maintaining clear communication and incorporating feedback efficiently.",
      "Built a portfolio of brand identity, print, and digital design work for clients in healthcare and FMCG sectors.",
    ],
  },
];

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="experience" className="relative py-28 overflow-hidden" ref={ref}>
      <div
        className="blob"
        style={{ width: 400, height: 350, top: "20%", left: "-8%", background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="tag">Experience</span>
          <div className="h-px flex-1 max-w-[200px]" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.35), transparent)" }} />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-5 top-8 bottom-8 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, rgba(124,58,237,0.5), rgba(245,158,11,0.3), transparent)" }}
            aria-hidden
          />

          <ol className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.li
                key={exp.company}
                initial={{ opacity: 0, x: -32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.18, ease: EXPO_OUT }}
                className="relative md:pl-20"
              >
                {/* Timeline icon */}
                <div
                  className="absolute left-0 top-6 w-10 h-10 rounded-xl hidden md:flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${exp.accentColor}18`,
                    border: `1px solid ${exp.accentColor}35`,
                  }}
                  aria-hidden
                >
                  <Briefcase size={17} style={{ color: exp.accentColor }} />
                </div>

                <article className="glass-card p-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-7">
                    <div>
                      <h3
                        className="text-xl font-bold mb-1.5"
                        style={{ fontFamily: "var(--font-heading)", color: "var(--fg-primary)" }}
                      >
                        {exp.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ color: exp.accentColor }}>
                          {exp.company}
                        </span>
                        {exp.company !== "Freelance" && (
                          <ArrowUpRight size={13} style={{ color: exp.accentColor }} aria-hidden />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2.5 flex-shrink-0">
                      <div
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
                      >
                        <Calendar size={12} aria-hidden />
                        <time>{exp.period}</time>
                      </div>
                      <span
                        className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{
                          background: `${exp.accentColor}18`,
                          color: exp.accentColor,
                          border: `1px solid ${exp.accentColor}30`,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-3" role="list">
                    {exp.highlights.map((h, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -8 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: i * 0.18 + j * 0.07 + 0.25, ease: EXPO_OUT }}
                        className="flex gap-3.5 text-sm leading-relaxed"
                        style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}
                      >
                        <span
                          className="mt-[8px] flex-shrink-0 w-1.5 h-1.5 rounded-full"
                          style={{ background: exp.accentColor }}
                          aria-hidden
                        />
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </article>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
