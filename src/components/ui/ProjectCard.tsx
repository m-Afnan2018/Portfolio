"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { copy } from "@/data/copy";
import { useScrollStore } from "@/hooks/useScrollStore";
import { cn } from "@/lib/utils";
import { TiltCard } from "./TiltCard";
import { Icon } from "./Icon";
import { hidePreview, showPreview } from "./HoverPreview";

export function StackChips({ stack, className }: { stack: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Tech stack">
      {stack.map((s) => (
        <li key={s} className="rounded-[2px] border border-line bg-surface/60 px-2 py-0.5 font-mono text-[11px] text-muted">
          {s}
        </li>
      ))}
    </ul>
  );
}

export function TodoBadge() {
  return (
    <span className="rounded-[2px] bg-warn/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-warn">
      todo
    </span>
  );
}

/** Back face of a card — the "view source" side. */
export function SourceFace({ html, lang, onBack }: { html?: string; lang?: string; onBack: () => void }) {
  return (
    <div className="glass absolute inset-0 flex flex-col overflow-hidden rounded-[8px] [backface-visibility:hidden] [transform:rotateY(180deg)]">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] text-faint">
        <span>snippet.{lang ?? "txt"}</span>
        <button type="button" onClick={onBack} className="tap-pad text-muted hover:text-primary">
          {copy.projects.backToCard}
        </button>
      </div>
      <div
        data-lenis-prevent
        className="code-frame numbered flex-1 overflow-auto py-3 pl-1 text-[12px]"
        dangerouslySetInnerHTML={{ __html: html ?? "" }}
      />
    </div>
  );
}

/**
 * Grid card: editor-style card with 3D tilt, glow, stack chips, flip-to-source
 * and a WebGL hover preview of the screenshot on the title.
 */
export function ProjectCard({ project, snippetHtml }: { project: Project; snippetHtml?: string }) {
  const [flipped, setFlipped] = useState(false);
  const set = useScrollStore((s) => s.set);
  const origin = "grid";
  const open = () => {
    hidePreview();
    set({ modalSlug: project.slug, modalOrigin: origin });
  };

  return (
    <TiltCard className="h-full">
      <motion.article
        layoutId={`${origin}-card-${project.slug}`}
        className="relative h-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass relative flex h-full min-h-[340px] flex-col rounded-[8px] !bg-surface/90 p-6 [backface-visibility:hidden]" aria-hidden={flipped}>
          <div className="flex items-center justify-between font-mono text-[11px] text-faint">
            <span className="truncate">projects/{project.slug}/</span>
            <span>{project.year}</span>
          </div>
          <h3 className="mt-8">
            <button
              type="button"
              onClick={open}
              onMouseEnter={() => showPreview(project.image)}
              onMouseLeave={hidePreview}
              data-cursor="view"
              className="t-h3 text-left text-text transition-colors hover:text-primary"
            >
              {project.title}
            </button>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{project.tagline}</p>
          <div className="mt-auto pt-6">
            <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-[11px] text-secondary">
              {project.category.map((c) => (
                <span key={c}>#{c.toLowerCase().replace(/\s/g, "-")}</span>
              ))}
              {project.placeholder && <TodoBadge />}
            </div>
            <StackChips stack={project.stack} />
            <div className="mt-5 flex items-center gap-4 border-t border-line pt-4 font-mono text-xs">
              <button type="button" onClick={open} className="inline-flex items-center gap-1.5 text-text hover:text-primary">
                {copy.projects.open} <Icon name="arrow" size={12} />
              </button>
              {project.codeSnippet && (
                <button
                  type="button"
                  onClick={() => setFlipped(true)}
                  className="tap-pad text-muted hover:text-primary"
                  aria-label={`View source snippet for ${project.title}`}
                >
                  {"</>"} {copy.projects.viewSource}
                </button>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="ml-auto text-muted hover:text-primary">
                  live ↗
                </a>
              )}
            </div>
          </div>
        </div>
        {project.codeSnippet && (
          <SourceFace html={snippetHtml} lang={project.codeSnippet.lang} onBack={() => setFlipped(false)} />
        )}
      </motion.article>
    </TiltCard>
  );
}
