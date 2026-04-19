"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Eye, FolderOpen } from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const categories = ["All", "Brand Identity", "Logo Design", "Print", "Digital", "Social Media"];

const projects = [
  {
    id: 1,
    title: "PharmaCure Brand Identity",
    category: "Brand Identity",
    description: "Complete visual identity system for a pharmaceutical company — logo, brand guide, stationery, and digital assets communicating trust and medical professionalism.",
    tags: ["Logo Design", "Brand Identity", "Print"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&h=500&fit=crop",
    accent: "#A78BFA",
  },
  {
    id: 2,
    title: "NutriLife FMCG Packaging",
    category: "Print",
    description: "Eye-catching packaging design for a health food brand. Vibrant, clean design that drives shelf appeal and strong brand recognition.",
    tags: ["Packaging", "Print", "FMCG"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&h=500&fit=crop",
    accent: "#F59E0B",
  },
  {
    id: 3,
    title: "TechNova Social Campaign",
    category: "Social Media",
    description: "Cohesive social media visual campaign — 30+ templates across Instagram, LinkedIn, and Twitter maintaining perfect brand consistency.",
    tags: ["Social Media", "Digital", "Campaign"],
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&h=500&fit=crop",
    accent: "#34D399",
  },
  {
    id: 4,
    title: "Lumis Logo Collection",
    category: "Logo Design",
    description: "A curated collection of logo marks for diverse clients — from minimalist wordmarks to intricate emblems, each telling a unique brand story.",
    tags: ["Logo Design", "Brand Identity"],
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=700&h=500&fit=crop",
    accent: "#F472B6",
  },
  {
    id: 5,
    title: "Bloom Events Print Suite",
    category: "Print",
    description: "Full print collateral for a luxury events company — invitation cards, brochures, menus, and signage with an elegant, premium aesthetic.",
    tags: ["Print Design", "Brochure", "Luxury"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&h=500&fit=crop",
    accent: "#38BDF8",
  },
  {
    id: 6,
    title: "Ganesyx Brand Evolution",
    category: "Brand Identity",
    description: "Led a brand refresh at Ganesyx Pvt. Ltd. — updated visual identity system, social media templates, and digital presence guidelines.",
    tags: ["Brand Strategy", "Digital", "Identity"],
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&h=500&fit=crop",
    accent: "#7C3AED",
  },
];

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeFilter, setActiveFilter] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.category === activeFilter || p.tags.includes(activeFilter));

  return (
    <section id="projects" className="relative py-28 overflow-hidden" ref={ref}>
      <div
        className="blob"
        style={{ width: 500, height: 400, top: "0%", right: "5%", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="flex items-center gap-4 mb-4"
        >
          <span className="tag">Projects</span>
          <div className="h-px flex-1 max-w-[200px]" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.35), transparent)" }} />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.08, ease: EXPO_OUT }}
          className="mb-10"
        >
          <h2
            className="text-4xl md:text-5xl font-black tracking-tight mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Selected <span className="gradient-text">Work</span>
          </h2>
          <p className="text-base max-w-lg" style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}>
            A curated selection spanning brand identity, print, and digital design.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.15, ease: EXPO_OUT }}
          className="flex flex-wrap gap-2 mb-10"
          role="group"
          aria-label="Filter projects by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-250 cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500"
              style={{
                minHeight: "40px",
                background: activeFilter === cat ? "rgba(124,58,237,0.9)" : "var(--surface)",
                color: activeFilter === cat ? "#fff" : "var(--fg-secondary)",
                border: activeFilter === cat ? "1px solid rgba(124,58,237,0.5)" : "1px solid var(--border)",
                boxShadow: activeFilter === cat ? "0 0 20px rgba(124,58,237,0.3)" : "none",
                fontFamily: "var(--font-body)",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EXPO_OUT }}
                className="col-span-full flex flex-col items-center justify-center py-28 gap-5"
                role="status"
                aria-live="polite"
              >
                <FolderOpen size={48} style={{ color: "var(--fg-muted)" }} aria-hidden />
                <div className="text-center">
                  <p className="text-base font-semibold mb-1" style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}>
                    No projects in this category yet.
                  </p>
                  <p className="text-sm" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>
                    Real projects will be added soon.
                  </p>
                </div>
                <button
                  onClick={() => setActiveFilter("All")}
                  className="text-sm font-semibold transition-colors hover:text-white"
                  style={{ color: "var(--accent-light)", fontFamily: "var(--font-body)" }}
                >
                  View all projects →
                </button>
              </motion.div>
            )}
            {filtered.map((project, i) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: EXPO_OUT }}
                className="group rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  border: `1px solid ${hovered === project.id ? "rgba(124,58,237,0.3)" : "var(--border)"}`,
                  transition: "border-color 280ms",
                }}
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ y: -6 }}
                aria-label={project.title}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} — project preview`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-400"
                    style={{
                      background: `linear-gradient(135deg, ${project.accent}CC, ${project.accent}55)`,
                      opacity: hovered === project.id ? 1 : 0,
                    }}
                  />

                  {/* Action buttons */}
                  <motion.div
                    initial={false}
                    animate={hovered === project.id ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.22, ease: EXPO_OUT }}
                    className="absolute inset-0 flex items-center justify-center gap-3"
                  >
                    <button
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-110"
                      style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}
                      aria-label={`Preview ${project.title}`}
                    >
                      <Eye size={17} />
                    </button>
                    <button
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-110"
                      style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}
                      aria-label={`Open ${project.title}`}
                    >
                      <ArrowUpRight size={17} />
                    </button>
                  </motion.div>

                  {/* Category chip */}
                  <div className="absolute top-3.5 left-3.5">
                    <span
                      className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{
                        background: `${project.accent}28`,
                        color: project.accent,
                        border: `1px solid ${project.accent}40`,
                        backdropFilter: "blur(10px)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="p-6 transition-colors duration-280"
                  style={{
                    background: "var(--surface)",
                    borderTop: `1px solid ${hovered === project.id ? `${project.accent}30` : "var(--border)"}`,
                  }}
                >
                  <h3
                    className="font-bold text-base mb-2.5 transition-colors duration-200 group-hover:text-white"
                    style={{ color: "var(--fg-primary)", fontFamily: "var(--font-heading)" }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2" role="list" aria-label="Project tags">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        role="listitem"
                        className="text-xs px-2.5 py-1 rounded-md font-medium"
                        style={{ background: "rgba(255,255,255,0.06)", color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
