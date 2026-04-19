"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const words = ["Brand Identity.", "Visual Narratives.", "Creative Assets.", "Design Systems."];

const blobs = [
  { w: 500, h: 400, top: "5%", left: "55%", color: "rgba(124,58,237,0.12)", dur: 14, delay: 0 },
  { w: 350, h: 350, top: "55%", left: "75%", color: "rgba(245,158,11,0.08)", dur: 18, delay: 2 },
  { w: 280, h: 280, top: "65%", left: "5%",  color: "rgba(139,92,246,0.10)", dur: 16, delay: 1 },
  { w: 220, h: 220, top: "15%", left: "2%",  color: "rgba(245,158,11,0.06)", dur: 20, delay: 3 },
];

const stats = [
  { value: "1+", label: "Years Exp." },
  { value: "20+", label: "Projects Done" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg"
      aria-label="Hero"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-100 pointer-events-none" />

      {/* Ambient blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: b.w, height: b.h,
            top: b.top, left: b.left,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{ x: [0, 25, -18, 0], y: [0, -18, 12, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        />
      ))}

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-10 text-sm font-medium text-violet-300"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
          Available for Creative Projects
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: EXPO_OUT }}
          className="text-[clamp(3.5rem,12vw,8rem)] font-black leading-[0.95] tracking-tighter mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="text-white">Harsh</span>
          <br />
          <span className="gradient-text">Sharma</span>
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EXPO_OUT }}
          className="text-sm md:text-base tracking-[0.18em] uppercase font-semibold mb-5"
          style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}
        >
          Graphic Designer &bull; Visual Brand Specialist
        </motion.p>

        {/* Animated word */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26, ease: EXPO_OUT }}
          className="h-9 mb-10 relative flex justify-center items-center overflow-hidden"
        >
          <AnimatedWord words={words} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34, ease: EXPO_OUT }}
          className="prose-muted max-w-lg mx-auto text-base md:text-lg mb-12"
        >
          Translating brand objectives into compelling visual narratives
          across digital and print platforms.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: EXPO_OUT }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
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
          className="grid grid-cols-3 gap-6 max-w-xs mx-auto"
        >
          {stats.map((s, i) => (
            <div key={s.label} className="text-center">
              <div
                className="text-2xl md:text-3xl font-black mb-0.5"
                style={{ fontFamily: "var(--font-heading)", color: i === 1 ? "var(--gold)" : "var(--accent-light)" }}
              >
                {s.value}
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>
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
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden
      >
        <span className="text-[10px] tracking-widest uppercase font-medium" style={{ color: "var(--fg-muted)" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
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
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="absolute text-lg md:text-xl font-bold gradient-text-warm"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
}
