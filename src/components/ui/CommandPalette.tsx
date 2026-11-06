"use client";

import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { sections } from "@/data/sections";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { toast, useScrollStore } from "@/hooks/useScrollStore";
import { scrollToId } from "@/hooks/useLenis";
import { toggleTheme } from "@/lib/theme";
import { ease } from "@/lib/motion";
import { Icon } from "./Icon";

/** ⌘K / Ctrl+K command palette. */
export function CommandPalette() {
  const open = useScrollStore((s) => s.paletteOpen);
  const set = useScrollStore((s) => s.set);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        set({ paletteOpen: !useScrollStore.getState().paletteOpen });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [set]);

  const run = (fn: () => void) => () => {
    set({ paletteOpen: false });
    setTimeout(fn, 120);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast(`${profile.email} copied`);
    } catch {
      toast(profile.email);
    }
  };

  const item =
    "flex cursor-pointer items-center gap-3 rounded-[2px] px-3 py-2.5 font-mono text-sm text-muted data-[selected=true]:bg-primary/10 data-[selected=true]:text-text";
  const group = "cmdk-group";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close command palette" className="absolute inset-0 bg-bg/60 backdrop-blur-sm" onClick={() => set({ paletteOpen: false })} />
          <motion.div
            className="relative w-full max-w-xl"
            initial={{ y: 16, scale: 0.98, filter: "blur(8px)" }}
            animate={{ y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.5, ease: ease.outBezier }}
          >
            <Command
              label="Command palette"
              loop
              className="glass overflow-hidden rounded-[8px] !bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] shadow-2xl"
              onKeyDown={(e) => e.key === "Escape" && set({ paletteOpen: false })}
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <span className="font-mono text-primary">&gt;</span>
                <Command.Input data-plain-focus autoFocus placeholder="Type a command or search…" className="h-12 w-full bg-transparent font-mono text-sm text-text outline-none placeholder:text-faint" />
                <kbd className="font-mono text-[10px] text-faint">ESC</kbd>
              </div>
              <Command.List data-lenis-prevent className="max-h-[52vh] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-6 text-center font-mono text-sm text-faint">
                  command not found — try “projects” or “theme”
                </Command.Empty>
                <Command.Group heading="go to" className={group}>
                  {sections.map((s) => (
                    <Command.Item key={s.id} value={`go ${s.label} ${s.file}`} onSelect={run(() => scrollToId(s.id))} className={item}>
                      <Icon name={s.icon} size={14} /> {s.file}
                      <span className="ml-auto text-[11px] text-faint">section</span>
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="projects" className={group}>
                  {projects.map((p) => (
                    <Command.Item key={p.slug} value={`open project ${p.title} ${p.stack.join(" ")}`} onSelect={run(() => set({ modalSlug: p.slug }))} className={item}>
                      <Icon name="folder" size={14} /> {p.title}
                      <span className="ml-auto text-[11px] text-faint">{p.year}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="actions" className={group}>
                  <Command.Item value="toggle theme light dark blueprint" onSelect={run(() => toggleTheme())} className={item}>
                    <Icon name="sun" size={14} /> toggle theme
                  </Command.Item>
                  <Command.Item value="download resume pdf cv" onSelect={run(() => window.open(profile.resume, "_blank"))} className={item}>
                    <Icon name="download" size={14} /> download resume.pdf
                  </Command.Item>
                  <Command.Item value="recruiter brief hr hiring quick view" onSelect={run(() => set({ checkout: "hr" }))} className={item}>
                    <Icon name="branch" size={14} /> git checkout recruiter — recruiter brief
                  </Command.Item>
                  <Command.Item value="work with me hire freelance client project quote services" onSelect={run(() => set({ checkout: "client" }))} className={item}>
                    <Icon name="branch" size={14} /> git checkout client — work with me
                  </Command.Item>
                  <Command.Item value="copy email contact" onSelect={run(copyEmail)} className={item}>
                    <Icon name="copy" size={14} /> copy email
                  </Command.Item>
                  <Command.Item value="open terminal shell console" onSelect={run(() => set({ terminalOpen: true }))} className={item}>
                    <Icon name="terminal" size={14} /> open terminal
                    <kbd className="ml-auto text-[11px] text-faint">`</kbd>
                  </Command.Item>
                  <Command.Item value="github source" onSelect={run(() => window.open(profile.links.github, "_blank"))} className={item}>
                    <Icon name="github" size={14} /> open github
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
