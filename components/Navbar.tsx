"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const navLinks = [
  { href: "#about",          label: "About" },
  { href: "#skills",         label: "Skills" },
  { href: "#experience",     label: "Experience" },
  { href: "#projects",       label: "Projects" },
  { href: "#certifications", label: "Certs" },
  { href: "#contact",        label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeSection, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map(({ href }) => href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { threshold: 0.3 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EXPO_OUT }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass border-b" : "bg-transparent border-b border-transparent"
        }`}
        style={{ borderColor: scrolled ? "var(--border)" : "transparent" }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            aria-label="Harsh Sharma — Home"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.18, ease: EXPO_OUT }}
            className="relative flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-amber-500" />
              <span
                className="relative z-10 text-white font-black text-sm tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                HS
              </span>
            </div>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5" role="list">
            {navLinks.map(({ href, label }) => {
              const id = href.slice(1);
              const active = activeSection === id;
              return (
                <div key={href} role="listitem">
                  <motion.a
                    href={href}
                    aria-current={active ? "location" : undefined}
                    className="relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-violet-500"
                    style={{
                      color: active ? "#fff" : "var(--fg-secondary)",
                      minHeight: "44px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
                        transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </motion.a>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.18, ease: EXPO_OUT }}
              className="btn-primary btn-glow py-2.5 px-5 text-sm"
            >
              Hire Me
            </motion.a>
          </div>

          {/* Mobile toggle — 44×44 tap area */}
          <motion.button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl transition-colors"
            style={{ color: "var(--fg-secondary)" }}
            onClick={() => setMenuOpen((v) => !v)}
            whileTap={{ scale: 0.9 }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: EXPO_OUT }}
            className="fixed top-[72px] left-4 right-4 z-40 glass rounded-2xl border p-3 md:hidden"
            style={{ borderColor: "var(--border)" }}
          >
            {navLinks.map(({ href, label }, i) => (
              <motion.a
                key={href}
                href={href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25, ease: EXPO_OUT }}
                className="flex items-center px-4 rounded-xl font-medium transition-colors"
                style={{
                  minHeight: "48px",
                  color: activeSection === href.slice(1) ? "#fff" : "var(--fg-secondary)",
                  background: activeSection === href.slice(1) ? "rgba(124,58,237,0.12)" : "transparent",
                  fontFamily: "var(--font-body)",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </motion.a>
            ))}
            <div className="px-2 pt-2">
              <motion.a
                href="#contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navLinks.length * 0.04 + 0.05 }}
                className="btn-primary w-full justify-center"
                onClick={() => setMenuOpen(false)}
              >
                Hire Me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
