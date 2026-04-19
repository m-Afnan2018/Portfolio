"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink, Heart } from "lucide-react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const socials = [
  { icon: Mail,         href: "mailto:hs3547454@gmail.com",          label: "Send email to Harsh Sharma" },
  { icon: ExternalLink, href: "https://linkedin.com/in/harshsharma", label: "Visit LinkedIn profile" },
];

export default function Footer() {
  return (
    <footer
      className="relative py-12"
      style={{ borderTop: "1px solid var(--border)" }}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo + name */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-amber-500" />
              <span
                className="relative z-10 text-white font-black text-sm"
                style={{ fontFamily: "var(--font-heading)" }}
                aria-hidden
              >
                HS
              </span>
            </div>
            <div>
              <div
                className="text-sm font-bold"
                style={{ color: "var(--fg-primary)", fontFamily: "var(--font-heading)" }}
              >
                Harsh Sharma
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
              >
                Graphic Designer · Visual Brand Specialist
              </div>
            </div>
          </div>

          {/* Social icons */}
          <nav aria-label="Social links">
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.18, ease: EXPO_OUT }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--fg-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.4)";
                    (e.currentTarget as HTMLElement).style.color = "var(--accent-light)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--fg-secondary)";
                    (e.currentTarget as HTMLElement).style.background = "var(--surface)";
                  }}
                >
                  <Icon size={15} aria-hidden />
                </motion.a>
              ))}
            </div>
          </nav>

          {/* Copyright */}
          <p
            className="text-xs flex items-center gap-1.5"
            style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
          >
            <span>© 2025 Harsh Sharma · Made with</span>
            <Heart size={11} className="text-red-500 fill-red-500" aria-label="love" />
          </p>
        </div>
      </div>
    </footer>
  );
}
