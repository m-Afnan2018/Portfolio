"use client";

/**
 * CaseLauncher — every "open project" on the developer site (cards, the 3D
 * monitors, command palette, terminal) sets `modalSlug`; this turns that into
 * the card → case-study transition. Old /#project-<slug> links are forwarded
 * to /work/<slug>.
 */
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { projects } from "@/data/projects";
import { useScrollStore } from "@/hooks/useScrollStore";
import { openCase, trackPointer } from "@/lib/caseTransition";

export function CaseLauncher() {
  const router = useRouter();
  const slug = useScrollStore((s) => s.modalSlug);
  const set = useScrollStore((s) => s.set);

  useEffect(() => {
    trackPointer();
    const m = location.hash.match(/^#project-(.+)$/);
    if (m && projects.some((p) => p.slug === m[1])) {
      document.documentElement.classList.remove("js-ask", "js-boot");
      router.replace(`/work/${m[1]}`);
    }
  }, [router]);

  useEffect(() => {
    if (!slug) return;
    set({ modalSlug: null });
    openCase(slug, router);
  }, [slug, set, router]);

  return null;
}
