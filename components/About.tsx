"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 32 },
    variants: {
      hidden: { opacity: 0, y: 32 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: EXPO_OUT } },
    },
  };
}

const contactLinks = [
  { icon: MapPin,       label: "Location", text: "Sahibabad, Ghaziabad, India", href: null,                                    color: "#10B981" },
  { icon: Mail,        label: "Email",    text: "hs3547454@gmail.com",          href: "mailto:hs3547454@gmail.com",             color: "#A78BFA" },
  { icon: Phone,       label: "Phone",    text: "+91 88514 37549",              href: "tel:+918851437549",                      color: "#F59E0B" },
  { icon: ExternalLink,label: "LinkedIn", text: "linkedin.com/in/harshsharma",  href: "https://linkedin.com/in/harshsharma",    color: "#38BDF8" },
];

const softTags = [
  "Creative Direction", "Project Management", "Mentoring",
  "Cross-Functional Collab", "Attention to Detail",
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="relative py-28 overflow-hidden" ref={ref}>
      {/* BG blob */}
      <div
        className="blob"
        style={{ width: 500, height: 400, top: "10%", left: "60%", background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="flex items-center gap-4 mb-14"
        >
          <span className="tag">About Me</span>
          <div className="h-px flex-1 max-w-xs" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.35), transparent)" }} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: EXPO_OUT }}
            className="relative"
          >
            <div className="relative aspect-[4/5] max-w-sm mx-auto lg:mx-0 rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=face"
                alt="Harsh Sharma — Senior Graphic Designer"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent" />

              {/* Available chip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.5, ease: EXPO_OUT }}
                className="absolute bottom-5 left-5 right-5 glass rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ border: "1px solid rgba(16,185,129,0.25)" }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" aria-hidden />
                <span className="text-sm font-medium" style={{ color: "var(--fg-primary)", fontFamily: "var(--font-body)" }}>
                  Open to creative projects
                </span>
              </motion.div>
            </div>

            {/* Experience badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.5 }}
              className="absolute -right-3 top-1/3 glass-card px-5 py-4 text-center cursor-default"
              style={{ border: "1px solid rgba(245,158,11,0.25)" }}
            >
              <div className="text-3xl font-black gradient-text-warm mb-0.5" style={{ fontFamily: "var(--font-heading)" }}>1+</div>
              <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--fg-secondary)" }}>
                Years Exp.
              </div>
            </motion.div>
          </motion.div>

          {/* ── Text ── */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.08, ease: EXPO_OUT }}
          >
            <h2
              className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Crafting Brands That{" "}
              <span className="gradient-text">Tell Stories</span>
            </h2>

            <p className="prose-muted text-base leading-relaxed mb-4">
              I&apos;m a creative and detail-oriented Graphic Designer passionate about transforming brand objectives into compelling visual narratives. With expertise spanning digital design, print media, and visual brand identity, I bring ideas to life through purposeful design.
            </p>
            <p className="prose-muted text-base leading-relaxed mb-8">
              Currently leading creative assets at Ganesyx Pvt. Ltd., I collaborate with cross-functional teams and mentor junior designers to build memorable brand experiences that resonate.
            </p>

            {/* Contact links */}
            <div className="space-y-3 mb-8" role="list" aria-label="Contact information">
              {contactLinks.map(({ icon: Icon, label, text, href, color }) => (
                <motion.div
                  key={label}
                  role="listitem"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.18, ease: EXPO_OUT }}
                  className="flex items-center gap-3 group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                    aria-hidden
                  >
                    <Icon size={15} style={{ color }} />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={`${label}: ${text}`}
                      className="text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}
                      aria-label={`${label}: ${text}`}
                    >
                      {text}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2" role="list" aria-label="Professional skills">
              {softTags.map((skill, i) => (
                <motion.span
                  key={skill}
                  role="listitem"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.06, ease: EXPO_OUT }}
                  className="tag cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
