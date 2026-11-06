"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Magnetic } from "./Magnetic";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";

/** A CTA styled as a shell command, with magnetic pull. */
export function CommandButton({
  children,
  variant = "primary",
  className,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; variant?: "primary" | "ghost" }) {
  return (
    <Magnetic>
      <a
        {...rest}
        onMouseEnter={(e) => {
          playSound("tick");
          rest.onMouseEnter?.(e);
        }}
        className={cn(
          "group relative inline-flex items-center gap-3 overflow-hidden rounded-[8px] px-5 py-3.5 font-mono text-sm transition-colors duration-500",
          variant === "primary"
            ? "bg-primary text-bg hover:bg-text"
            : "hairline bg-glass text-text backdrop-blur-md hover:border-primary hover:text-primary",
          className,
        )}
      >
        <span data-magnetic-inner className="relative z-10 inline-flex items-center gap-3">
          {children}
        </span>
      </a>
    </Magnetic>
  );
}
