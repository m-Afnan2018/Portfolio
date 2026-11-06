/**
 * caseTransition — the move from a project card to its case study.
 *
 * The card's screenshot lifts out of the page and grows until it fills the
 * screen; underneath, the route changes to /work/<slug>, whose hero is that
 * same screenshot, full-bleed. The case page then dissolves the veil
 * (revealCase), so the image never seems to leave.
 *
 * The veil is plain DOM on <body>, not React: it has to survive the old
 * page unmounting and the new one mounting.
 */
import { projects } from "@/data/projects";

const VEIL = "cs-veil";
const ease = "cubic-bezier(0.76, 0, 0.24, 1)";
let pointer = { x: 0, y: 0 };
let tracking = false;

/** remember where the visitor last pressed — the fallback origin of the reveal */
export function trackPointer() {
  if (tracking) return;
  tracking = true;
  pointer = { x: innerWidth / 2, y: innerHeight / 2 };
  window.addEventListener(
    "pointerdown",
    (e) => {
      pointer = { x: e.clientX, y: e.clientY };
    },
    { capture: true, passive: true },
  );
}

const reducedMotion = () =>
  document.documentElement.dataset.motion === "reduce" ||
  matchMedia("(prefers-reduced-motion: reduce)").matches;

type Nav = { push: (href: string) => void; prefetch: (href: string) => void };

export function openCase(slug: string, router: Nav) {
  const project = projects.find((p) => p.slug === slug);
  const href = `/work/${slug}`;
  if (!project) return;
  try {
    sessionStorage.setItem("cs-from", location.pathname + location.hash);
  } catch {}
  router.prefetch(href);
  if (reducedMotion()) {
    router.push(href);
    return;
  }

  document.getElementById(VEIL)?.remove();
  const veil = document.createElement("div");
  veil.id = VEIL;
  veil.className = "cs-veil";
  veil.setAttribute("aria-hidden", "true");
  veil.innerHTML = `<div class="cs-veil-bg"></div><div class="cs-veil-img"><img src="${project.image}" alt="" /><span class="cs-hero-shade"></span></div>`;
  document.body.appendChild(veil);
  const bg = veil.firstElementChild as HTMLElement;
  const frame = veil.lastElementChild as HTMLElement;
  const shade = frame.querySelector("span") as HTMLElement;

  // the card's screenshot, if it's on screen
  const source = [...document.querySelectorAll<HTMLElement>(`[data-cs-img="${slug}"]`)]
    .map((el) => el.getBoundingClientRect())
    .find((r) => r.width > 40 && r.bottom > 0 && r.top < innerHeight);

  const W = innerWidth;
  const H = innerHeight;
  const opts: KeyframeAnimationOptions = { duration: 1000, easing: ease, fill: "forwards" };
  bg.animate([{ opacity: 0 }, { opacity: 1 }], { ...opts, duration: 700 });
  shade.animate([{ opacity: 0 }, { opacity: 1 }], { ...opts, delay: 250, duration: 750 });

  if (source) {
    // grow from the card
    frame.animate(
      [
        {
          top: `${source.top}px`,
          left: `${source.left}px`,
          width: `${source.width}px`,
          height: `${source.height}px`,
          borderRadius: "8px",
        },
        { top: "0px", left: "0px", width: `${W}px`, height: `${H}px`, borderRadius: "0px" },
      ],
      opts,
    );
  } else {
    // no card on screen (terminal, palette, 3D): a circle from the last press
    const r = Math.hypot(Math.max(pointer.x, W - pointer.x), Math.max(pointer.y, H - pointer.y));
    frame.animate(
      [
        { clipPath: `circle(0px at ${pointer.x}px ${pointer.y}px)` },
        { clipPath: `circle(${r}px at ${pointer.x}px ${pointer.y}px)` },
      ],
      opts,
    );
  }

  setTimeout(() => router.push(href), 820);
  // safety: never leave the veil up if the page fails to arrive
  setTimeout(() => document.getElementById(VEIL)?.remove(), 6000);
}

/** called by the case page once its hero image is ready */
export function revealCase() {
  const veil = document.getElementById(VEIL);
  if (!veil) return;
  veil.id = "";
  const done = veil.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 500,
    delay: 120,
    easing: "ease-out",
    fill: "forwards",
  });
  done.onfinish = () => veil.remove();
}
