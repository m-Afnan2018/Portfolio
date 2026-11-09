/**
 * handoff — the one page-transition shape shared by every version switch.
 *
 * Each version leaves in its own language (the terminal's colour wipe, the
 * recruiter page turning, the client's circle), but they all end on the same
 * frame: the next version's colour, the MA mark tracing itself, and the
 * version's name. That frame is plain DOM on <body> so it survives the route
 * change; the arriving page lifts it away (releaseHandoff, from
 * usePersonaMark), so every arrival looks the same too.
 */
import { markHtml } from "@/components/brand/BrandMark";
import { profile } from "@/data/profile";
import type { Persona } from "@/lib/persona";

const ID = "brand-handoff";
const MIN_MS = 1000; // let the mark finish drawing before it lifts

export function handoff({ bg, ink, title }: { bg: string; ink: string; title: string }) {
  document.getElementById(ID)?.remove();
  const el = document.createElement("div");
  el.id = ID;
  el.className = "bh";
  el.setAttribute("role", "status");
  el.style.background = bg;
  el.style.color = ink;
  el.dataset.t = String(Date.now());
  el.innerHTML = `<div class="bh-in">${markHtml(76)}<p class="bh-title"></p><p class="bh-sub"></p></div><span class="bh-bar"></span>`;
  (el.querySelector(".bh-title") as HTMLElement).textContent = title;
  (el.querySelector(".bh-sub") as HTMLElement).textContent = profile.name;
  // a 3D page-turn leaves `perspective` on <body>, which would make it the
  // containing block for this fixed layer; the turn is over by now
  document.body.style.removeProperty("perspective");
  document.body.style.removeProperty("perspective-origin");
  document.body.appendChild(el);
  // never strand it, whatever happens to the navigation
  setTimeout(() => releaseHandoff(), 7000);
}

/** every version arrives on the same frame, in its own colour */
const TARGET: Record<Persona, { bg: string; ink: string; title: string }> = {
  dev: { bg: "var(--bg)", ink: "var(--text)", title: "Developer portfolio" },
  hr: { bg: "#ffffff", ink: "#15171c", title: "Recruiter brief" },
  client: { bg: "#2563eb", ink: "#ffffff", title: "Work with me" },
};
export const handoffTo = (p: Persona) => handoff(TARGET[p]);

export function releaseHandoff() {
  const el = document.getElementById(ID);
  if (!el || el.dataset.out) return;
  el.dataset.out = "1";
  const wait = Math.max(0, MIN_MS - (Date.now() - Number(el.dataset.t)));
  // lift it once the arriving page has settled (hydration, shader compile),
  // so the exit animation doesn't fight the main thread
  setTimeout(() => {
    const lift = () =>
      requestAnimationFrame(() => {
        el.classList.add("bh-out");
        setTimeout(() => el.remove(), 900);
      });
    if ("requestIdleCallback" in window) requestIdleCallback(lift, { timeout: 600 });
    else setTimeout(lift, 50);
  }, wait);
}
