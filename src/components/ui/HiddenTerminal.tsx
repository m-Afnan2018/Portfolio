"use client";

/**
 * The hidden drop-down terminal. Press ` (backtick) anywhere, or the
 * floating >_ button on mobile. Supports history (↑/↓) and Tab completion.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { sections } from "@/data/sections";
import { useScrollStore } from "@/hooks/useScrollStore";
import { scrollToId } from "@/hooks/useLenis";
import { toggleTheme } from "@/lib/theme";
import { ease } from "@/lib/motion";
import { playSound } from "@/lib/sound";
import { Icon } from "./Icon";
import { BRANCHES } from "./BranchSwitcher";

type Line = { id: number; node: ReactNode };
const COMMANDS = ["help", "git", "whoami", "ls", "cat", "open", "cd", "contact", "theme", "date", "echo", "clear", "sudo", "matrix", "history", "exit"];

let lineId = 0;
const L = (node: ReactNode): Line => ({ id: lineId++, node });

const banner = () => [
  L(<span className="text-primary">afnan-sh 2.0 — type <b>help</b> to list commands</span>),
];

export function HiddenTerminal() {
  const open = useScrollStore((s) => s.terminalOpen);
  const set = useScrollStore((s) => s.set);
  const [lines, setLines] = useState<Line[]>(banner);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => set({ terminalOpen: false }), [set]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest("input,textarea,[contenteditable='true']") && t !== inputRef.current;
      if (e.key === "`" && !typing) {
        e.preventDefault();
        set({ terminalOpen: !useScrollStore.getState().terminalOpen });
      }
      if (e.key === "Escape" && useScrollStore.getState().terminalOpen) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [set, close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const execute = (raw: string): Line[] | "clear" => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ");
    switch (cmd) {
      case "":
        return [];
      case "help":
        return [
          L(<span className="text-muted">available commands:</span>),
          ...[
            ["git branch", "list versions of this site"],
            ["git checkout <branch>", "switch version: recruiter · client"],
            ["whoami", "who is this guy"],
            ["ls projects", "list projects"],
            ["cat skills", "print package.json"],
            ["open <project>", "open a project (tab-completes)"],
            ["cd <section>", "jump to a section"],
            ["contact", "how to reach me"],
            ["theme", "toggle night / blueprint"],
            ["sudo hire-me", "escalate privileges"],
            ["matrix", "follow the white rabbit"],
            ["clear · history · exit", ""],
          ].map(([c, d]) =>
            L(
              <span>
                <span className="inline-block w-40 text-primary">{c}</span>
                <span className="text-faint">{d}</span>
              </span>,
            ),
          ),
        ];
      case "git": {
        const [sub, name] = args;
        if (sub === "branch" || !sub)
          return BRANCHES.map((b) =>
            L(
              <span>
                <span className={b.id === "dev" ? "text-accent" : "text-faint"}>{b.id === "dev" ? "* " : "  "}</span>
                <span className={b.id === "dev" ? "text-accent" : "text-primary"}>{b.branch.padEnd(11)}</span>
                <span className="text-faint">{b.title}</span>
              </span>,
            ),
          );
        if (sub === "checkout" || sub === "switch") {
          const b = BRANCHES.find((x) => x.branch === name || x.id === name);
          if (!b) return [L(<span className="text-danger">error: pathspec &apos;{name ?? ""}&apos; did not match — try `git branch`</span>)];
          if (b.id === "dev") return [L(<span className="text-muted">Already on &apos;main&apos;</span>)];
          setTimeout(() => {
            close();
            set({ checkout: b.id as "hr" | "client" });
          }, 200);
          return [L(<span className="text-accent">Switching to &apos;{b.branch}&apos;…</span>)];
        }
        return [L(<span className="text-danger">git: &apos;{sub}&apos; is not supported here — try `git branch`</span>)];
      }
      case "whoami":
        return [
          L(<span className="text-text">{profile.name}</span>),
          L(<span className="text-muted">{profile.title} · {profile.location}</span>),
          L(<span className="text-faint">{profile.oneLiner}</span>),
        ];
      case "ls":
        if (!arg || arg.startsWith("project"))
          return projects.map((p) =>
            L(
              <span>
                <span className="text-faint">drwxr-xr-x  {String(p.year).padEnd(8)}</span>
                <span className="text-primary">{p.slug}/</span>
              </span>,
            ),
          );
        return sections.map((s) => L(<span className="text-primary">{s.file}</span>));
      case "cat":
        if (arg.startsWith("skill") || arg === "package.json")
          return [
            L("{"),
            ...skillGroups.map((g) =>
              L(
                <span>
                  {"  "}
                  <span className="text-secondary">&quot;{g.label}&quot;</span>: [{g.skills.map((s) => <span key={s.name} className="text-accent">&quot;{s.name}&quot; </span>)}]
                </span>,
              ),
            ),
            L("}"),
          ];
        if (arg.startsWith("about")) return [L(profile.summary)];
        return [L(<span className="text-danger">cat: {arg || "?"}: No such file or directory</span>)];
      case "open": {
        const p = projects.find((x) => x.slug === arg || x.slug.startsWith(arg) || x.title.toLowerCase().includes(arg.toLowerCase()));
        if (!arg || !p) return [L(<span className="text-danger">open: project not found — try `ls projects`</span>)];
        setTimeout(() => {
          close();
          set({ modalSlug: p.slug });
        }, 300);
        return [L(<span className="text-accent">opening {p.slug} …</span>)];
      }
      case "cd": {
        const s = sections.find((x) => x.id === arg.replace(/[/~.]/g, "") || x.file === arg);
        if (!s) return [L(<span className="text-danger">cd: no such section: {arg}</span>)];
        setTimeout(() => {
          close();
          scrollToId(s.id);
        }, 250);
        return [L(<span className="text-accent">→ {s.file}</span>)];
      }
      case "contact":
        return [
          L(<span>email   <a className="text-primary underline" href={`mailto:${profile.email}`}>{profile.email}</a></span>),
          L(<span>github  <a className="text-primary underline" href={profile.links.github} target="_blank" rel="noreferrer">{profile.links.github}</a></span>),
          L(<span className="text-faint">or run `cd contact` for the form</span>),
        ];
      case "theme":
        toggleTheme();
        return [L(<span className="text-accent">theme toggled</span>)];
      case "date":
        return [L(new Date().toLocaleString("en-IN", { timeZone: profile.timezone }) + " IST")];
      case "echo":
        return [L(arg)];
      case "history":
        return history.map((h, i) => L(`${String(i + 1).padStart(4)}  ${h}`));
      case "sudo":
        if (arg.replace(/\s/g, "") === "hire-me" || arg === "hire me") {
          setTimeout(() => {
            close();
            scrollToId("contact");
          }, 1600);
          return [
            L(<span className="text-warn">[sudo] password for recruiter: ********</span>),
            L(<span className="text-accent">✓ access granted. Excellent decision.</span>),
            L(<span className="text-muted">redirecting you to ./contact.sh …</span>),
          ];
        }
        return [L(<span className="text-danger">visitor is not in the sudoers file. This incident will be reported. 🙂</span>)];
      case "matrix":
        setTimeout(() => {
          close();
          set({ matrix: true });
        }, 200);
        return [L(<span className="text-accent">wake up, visitor…</span>)];
      case "clear":
        return "clear";
      case "exit":
        setTimeout(close, 150);
        return [L(<span className="text-faint">logout</span>)];
      case "rm":
        return [L(<span className="text-danger">nice try. this filesystem is read-only.</span>)];
      default:
        return [L(<span className="text-danger">command not found: {cmd} — type `help`</span>)];
    }
  };

  const submit = () => {
    const raw = input;
    playSound("tick");
    const out = execute(raw);
    if (raw.trim()) setHistory((h) => [...h, raw]);
    setHIndex(-1);
    setInput("");
    if (out === "clear") return setLines([]);
    setLines((ls) => [...ls, L(<span><span className="text-accent">visitor@afnan</span>:<span className="text-primary">~</span>$ {raw}</span>), ...out]);
  };

  const complete = () => {
    const [cmd, ...rest] = input.split(" ");
    if (!rest.length) {
      const m = COMMANDS.filter((c) => c.startsWith(cmd));
      if (m.length === 1) setInput(m[0] + " ");
      else if (m.length > 1) setLines((ls) => [...ls, L(<span className="text-faint">{m.join("  ")}</span>)]);
      return;
    }
    const partial = rest.join(" ");
    if (cmd === "git") {
      const m = ["checkout recruiter", "checkout client", "branch"].filter((x) => x.startsWith(partial));
      if (m.length === 1) setInput(`git ${m[0]}`);
      else if (m.length > 1) setLines((ls) => [...ls, L(<span className="text-faint">{m.join("  ")}</span>)]);
      return;
    }
    const pool = cmd === "open" ? projects.map((p) => p.slug) : cmd === "cd" ? sections.map((s) => s.id) : cmd === "cat" ? ["skills", "about"] : cmd === "ls" ? ["projects"] : [];
    const m = pool.filter((x) => x.startsWith(partial));
    if (m.length === 1) setInput(`${cmd} ${m[0]}`);
    else if (m.length > 1) setLines((ls) => [...ls, L(<span className="text-faint">{m.join("  ")}</span>)]);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => set({ terminalOpen: true })}
        className="glass fixed bottom-10 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full font-mono text-accent lg:hidden"
        aria-label="Open terminal"
      >
        <Icon name="terminal" size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="term-backdrop"
            aria-hidden
            className="fixed inset-0 z-[84] bg-bg/70 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          />
        )}
        {open && (
          <motion.div
            key="term-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Interactive terminal"
            className="fixed inset-x-0 top-11 z-[85] mx-auto max-w-4xl px-3"
            initial={{ y: "-110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-110%", opacity: 0 }}
            transition={{ duration: 0.55, ease: ease.outBezier }}
          >
            <div className="glass overflow-hidden rounded-b-[8px] border-t-0 !bg-[color-mix(in_srgb,var(--surface)_97%,transparent)] shadow-2xl" onClick={() => inputRef.current?.focus()}>
              <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] text-faint">
                <span>visitor@afnan: ~ — zsh — 96×24</span>
                <button type="button" onClick={close} className="hover:text-text" aria-label="Close terminal">
                  esc ✕
                </button>
              </div>
              <div ref={bodyRef} data-lenis-prevent className="h-[min(52vh,420px)] overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-text" aria-live="polite">
                {lines.map((l) => (
                  <div key={l.id} className="whitespace-pre-wrap break-words">
                    {l.node}
                  </div>
                ))}
                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                >
                  <label htmlFor="term-input" className="shrink-0">
                    <span className="text-accent">visitor@afnan</span>:<span className="text-primary">~</span>$
                  </label>
                  <input
                    id="term-input"
                    data-plain-focus
                    ref={inputRef}
                    value={input}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    onChange={(e) => {
                      setInput(e.target.value);
                      playSound("key");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                        e.preventDefault();
                        complete();
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        const i = hIndex < 0 ? history.length - 1 : Math.max(0, hIndex - 1);
                        if (history[i] !== undefined) {
                          setHIndex(i);
                          setInput(history[i]);
                        }
                      } else if (e.key === "ArrowDown") {
                        e.preventDefault();
                        const i = hIndex + 1;
                        if (hIndex >= 0 && i < history.length) {
                          setHIndex(i);
                          setInput(history[i]);
                        } else {
                          setHIndex(-1);
                          setInput("");
                        }
                      } else if (e.key === "l" && e.ctrlKey) {
                        e.preventDefault();
                        setLines([]);
                      } else if (e.key === "`") {
                        e.preventDefault();
                        close();
                      }
                    }}
                    className="w-full bg-transparent text-text caret-primary outline-none"
                    aria-label="Terminal command"
                  />
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

