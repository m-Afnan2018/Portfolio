"use client";

/**
 * Signature — the same sign-off at the foot of every version: the mark, who
 * made it, and the three ways into the site, with the current one lit.
 * Colours come from `currentColor`, so it sits in any theme.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handoffTo } from "@/lib/handoff";
import { personas, setPersona, type Persona } from "@/lib/persona";
import { profile } from "@/data/profile";
import { BrandMark } from "./BrandMark";

export function Signature({ current, className = "" }: { current?: Persona; className?: string }) {
  const router = useRouter();
  // switching from here ends on the same hand-off frame as every other switch
  const go = (e: React.MouseEvent, id: Persona, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setPersona(id);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || id === current) {
      router.push(href);
      return;
    }
    router.prefetch(href);
    handoffTo(id);
    setTimeout(() => router.push(href), 450);
  };
  return (
    <div className={`group flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}>
      <span className="flex items-center gap-3">
        <BrandMark size={30} draw />
        <span className="text-[13px] leading-tight">
          <span className="block font-semibold">{profile.name}</span>
          <span className="block opacity-60">Designed &amp; built by hand</span>
        </span>
      </span>
      <nav aria-label="Versions of this site" className="flex items-center gap-1 text-[12px]">
        <span className="mr-2 opacity-50">View as</span>
        {personas.map((p) => {
          const here = p.id === current;
          return (
            <Link
              key={p.id}
              href={p.href}
              onClick={(e) => go(e, p.id, p.href)}
              aria-current={here ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors [@media(pointer:coarse)]:py-2 ${
                here
                  ? "bg-current/10 font-semibold"
                  : "opacity-60 hover:bg-current/10 hover:opacity-100"
              }`}
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${here ? "bg-[#22d3ee]" : "bg-current opacity-40"}`}
              />
              {p.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
