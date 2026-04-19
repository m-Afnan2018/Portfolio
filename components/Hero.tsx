"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const words = ["Brand Identity.", "Visual Narratives.", "Creative Assets.", "Design Systems."];

const blobs = [
  { w: 600, h: 500, top: "0%",  left: "50%", color: "rgba(124,58,237,0.13)", dur: 14, delay: 0 },
  { w: 400, h: 400, top: "50%", left: "72%", color: "rgba(245,158,11,0.09)", dur: 18, delay: 2 },
  { w: 320, h: 320, top: "60%", left: "3%",  color: "rgba(139,92,246,0.10)", dur: 16, delay: 1 },
  { w: 240, h: 240, top: "10%", left: "0%",  color: "rgba(245,158,11,0.07)", dur: 20, delay: 3 },
];

const stats = [
  { value: "1+",   label: "Years Exp.",          color: "var(--accent-light)" },
  { value: "20+",  label: "Projects Done",        color: "var(--gold)" },
  { value: "100%", label: "Client Satisfaction",  color: "var(--accent-light)" },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y       = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg"
      aria-label="Hero"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      {/* Ambient blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: b.w, height: b.h,
            top: b.top, left: b.left,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            filter: "blur(70px)",
          }}
          animate={{ x: [0, 28, -20, 0], y: [0, -20, 14, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        />
      ))}

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-10 text-center pt-20 pb-32"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass mb-10 text-sm font-medium"
          style={{ color: "var(--accent-light)", fontFamily: "var(--font-body)", border: "1px solid rgba(124,58,237,0.25)" }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" aria-hidden />
          Available for Creative Projects
          <Sparkles size={13} aria-hidden />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: EXPO_OUT }}
          className="font-black leading-[0.9] tracking-tighter mb-6"
          style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(3.5rem,12vw,8rem)" }}
        >
          <span className="text-white">Harsh</span>
          <br />
          <span className="gradient-text">Sharma</span>
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EXPO_OUT }}
          className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold mb-5"
          style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}
        >
          Graphic Designer &bull; Visual Brand Specialist
        </motion.p>

        {/* Animated word */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26, ease: EXPO_OUT }}
          className="h-9 mb-7 relative flex justify-center items-center overflow-hidden"
        >
          <AnimatedWord words={words} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34, ease: EXPO_OUT }}
          className="prose-muted max-w-[480px] mx-auto text-base leading-relaxed mb-10"
        >
          Translating brand objectives into compelling visual narratives
          across digital and print platforms.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: EXPO_OUT }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
        >
          <a href="#projects" className="btn-primary btn-glow">
            View My Work
            <ArrowRight size={16} aria-hidden />
          </a>
          <a href="#contact" className="btn-secondary">
            Get in Touch
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.52, ease: EXPO_OUT }}
          className="flex items-stretch justify-center mx-auto rounded-2xl overflow-hidden"
          style={{
            maxWidth: "400px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            backdropFilter: "blur(16px)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex-1 text-center py-5 px-4"
              style={{
                borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                className="text-2xl font-black mb-1"
                style={{ fontFamily: "var(--font-heading)", color: s.color }}
              >
                {s.value}
              </div>
              <div
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--fg-muted)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: "var(--fg-muted)" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: "var(--fg-muted)" }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function AnimatedWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((p) => (p + 1) % words.length), 2800);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[index]}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
        className="absolute text-xl font-bold gradient-text-warm"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
}
