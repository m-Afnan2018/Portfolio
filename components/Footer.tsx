"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-amber-500 opacity-90" />
              <span className="relative z-10 text-white font-bold text-lg">HS</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm">Harsh Sharma</div>
              <div className="text-slate-600 text-xs">Graphic Designer · Visual Brand Specialist</div>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Mail, href: "mailto:hs3547454@gmail.com", label: "Email" },
              { icon: ExternalLink, href: "https://linkedin.com/in/harshsharma", label: "LinkedIn" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl glass border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-colors"
                aria-label={label}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-slate-600 text-xs flex items-center gap-1.5">
            <span>© 2025 Harsh Sharma · Made with</span>
            <Heart size={12} className="text-red-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
