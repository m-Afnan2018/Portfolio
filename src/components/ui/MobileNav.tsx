"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { sections } from "@/data/sections";
import { profile } from "@/data/profile";
import { useScrollStore } from "@/hooks/useScrollStore";
import { scrollToId } from "@/hooks/useLenis";
import { ease } from "@/lib/motion";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

/** Mobile navigation: a bottom sheet styled as an explorer file tree. */
export function MobileNav() {
  const open = useScrollStore((s) => s.mobileNavOpen);
  const active = useScrollStore((s) => s.activeSection);
  const set = useScrollStore((s) => s.set);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && set({ mobileNavOpen: false });
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, set]);

  const go = (id: string) => {
    set({ mobileNavOpen: false });
    setTimeout(() => scrollToId(id), 250);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={() => set({ mobileNavOpen: false })} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="File tree navigation"
            className="glass absolute inset-x-0 bottom-0 rounded-t-[24px] px-5 pb-10 pt-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: ease.outBezier }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-strong" />
            <p className="t-label mb-3">explorer</p>
            <p className="mb-2 font-mono text-sm text-muted">▾ ~/{profile.handle}</p>
            <ul className="space-y-0.5 font-mono text-[15px]">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[2px] py-2.5 pl-5 text-left",
                      active === s.id ? "bg-primary/10 text-primary" : "text-text",
                    )}
                  >
                    <span className="text-faint">{i === sections.length - 1 ? "└─" : "├─"}</span>
                    <Icon name={s.icon} size={15} />
                    {s.file}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-sm">
              <a href={profile.resume} download className="hairline rounded-[8px] px-4 py-3 text-center">
                resume.pdf
              </a>
              <button type="button" onClick={() => go("contact")} className="rounded-[8px] bg-primary px-4 py-3 text-bg">
                hire me
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
