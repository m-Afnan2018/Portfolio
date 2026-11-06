"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/useScrollStore";

interface Props {
  /** pre-highlighted HTML from lib/highlight.ts (server) */
  html: string;
  /** raw source, for copy-to-clipboard */
  code: string;
  filename: string;
  numbered?: boolean;
  className?: string;
  tabs?: { name: string; active?: boolean; onClick?: () => void }[];
  maxHeight?: string;
}

/** An editor window frame around syntax-highlighted code. */
export function CodeBlock({ html, code, filename, numbered = true, className, tabs, maxHeight }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast(`copied ${filename} to clipboard`);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast("clipboard unavailable");
    }
  };
  return (
    <figure className={cn("glass overflow-hidden rounded-[8px] !bg-[color-mix(in_srgb,var(--surface)_96%,transparent)]", className)}>
      <figcaption className="flex items-center justify-between border-b border-line bg-surface/60 pr-2">
        <div className="flex min-w-0 items-center">
          <div className="flex gap-1.5 px-4" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/80" />
          </div>
          <div className="no-scrollbar flex overflow-x-auto" role={tabs ? "tablist" : undefined}>
            {(tabs ?? [{ name: filename, active: true }]).map((t) => (
              <button
                key={t.name}
                type="button"
                role={tabs ? "tab" : undefined}
                aria-selected={tabs ? !!t.active : undefined}
                onClick={t.onClick}
                disabled={!t.onClick}
                className={cn(
                  "whitespace-nowrap border-r border-line px-4 py-2.5 font-mono text-xs transition-colors",
                  t.active ? "bg-bg/60 text-text shadow-[inset_0_-1px_0_var(--primary)]" : "text-faint hover:text-muted",
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={copy}
          data-cursor="copy"
          className="rounded-[2px] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-faint transition-colors hover:text-primary"
          aria-label={`Copy ${filename}`}
        >
          {copied ? "copied ✓" : "copy"}
        </button>
      </figcaption>
      <div
        data-lenis-prevent
        className={cn("code-frame overflow-auto py-4 pl-2", numbered && "numbered")}
        style={{ maxHeight }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
