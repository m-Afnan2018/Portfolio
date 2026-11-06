"use client";

/**
 * ClientMotion — the page-wide motion layer for /work-with-me.
 *
 * The page markup is server-rendered; this component wires behaviour onto it
 * through data attributes, so every section stays readable without JS:
 *   [data-split]        headings rise line-by-line from a mask
 *   [data-reveal]       fade-up, batched as they enter
 *   [data-count]        numbers count up once
 *   [data-speed="0.2"]  parallax drift
 *   [data-spotlight]    radial glow follows the pointer
 *   [data-magnetic]     elements pull toward the pointer
 *   [data-cursor="…"]   cursor follower grows and shows a label
 * Plus Lenis smooth scroll, anchor scrolling, the header state and a progress bar.
 */
import { useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { usePauseOffscreen } from "@/hooks/usePauseOffscreen";

export function ClientMotion() {
  const cursor = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  usePauseOffscreen(".cl-root section, .cl-root footer");

  useGSAP(() => {
    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const header = document.querySelector<HTMLElement>(".cl-header");
    const cleanups: (() => void)[] = [];

    // header: solid once the dark hero has scrolled away
    // (a plain scroll check, not a ScrollTrigger: it needs no re-measuring,
    // so it also works in the reduced-motion path, which never refreshes)
    const hero = document.getElementById("cl-hero");
    if (header && hero) {
      const sync = () =>
        header.classList.toggle("is-solid", hero.getBoundingClientRect().bottom <= 72);
      sync();
      window.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync);
      cleanups.push(() => {
        window.removeEventListener("scroll", sync);
        window.removeEventListener("resize", sync);
      });
    }

    if (reduced) {
      html.classList.add("cl-done");
      return () => cleanups.forEach((fn) => fn());
    }

    // ── smooth scroll ─────────────────────────────────────────────────────
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    });

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      const target = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -64, duration: 1.4 });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onAnchor);
    cleanups.push(() => document.removeEventListener("click", onAnchor));

    // header hides while scrolling down, returns on scroll up
    if (header) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) =>
          header.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 500),
      });
    }

    // progress bar
    if (progress.current) {
      gsap.to(progress.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
    }

    // ── headings: masked line reveal ─────────────────────────────────────
    gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "cl-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.25,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
      });
    });

    // ── generic reveals (batched so neighbours stagger together) ─────────
    gsap.set("[data-reveal]", { autoAlpha: 0, y: 48 });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 90%",
      once: true,
      onEnter: (els) =>
        gsap.to(els, {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
          overwrite: true,
        }),
    });

    // ── count-up numbers ─────────────────────────────────────────────────
    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const raw = el.textContent ?? "";
      const m = raw.match(/^(\D*)([\d,.]+)(.*)$/);
      if (!m) return;
      const [, pre, num, post] = m;
      const target = parseFloat(num.replace(/,/g, ""));
      const obj = { v: 0 };
      el.textContent = `${pre}0${post}`;
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () =>
          (el.textContent = `${pre}${Math.round(obj.v).toLocaleString("en-US")}${post}`),
      });
    });

    // ── parallax ─────────────────────────────────────────────────────────
    gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
      const speed = parseFloat(el.dataset.speed ?? "0.15");
      gsap.to(el, {
        yPercent: -100 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // ── spotlight + magnetic + cursor (fine pointers only) ───────────────
    if (finePointer) {
      const onSpot = (e: PointerEvent) => {
        const el = (e.target as Element).closest<HTMLElement>("[data-spotlight]");
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      document.addEventListener("pointermove", onSpot);
      cleanups.push(() => document.removeEventListener("pointermove", onSpot));

      gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const strength = parseFloat(el.dataset.magnetic || "0.35");
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });

      const c = cursor.current!;
      const cx = gsap.quickTo(c, "x", { duration: 0.45, ease: "power3.out" });
      const cy = gsap.quickTo(c, "y", { duration: 0.45, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        c.style.opacity = "1";
        cx(e.clientX);
        cy(e.clientY);
        const t = (e.target as Element).closest<HTMLElement>("[data-cursor]");
        c.classList.toggle("is-big", !!t);
        if (t && label.current) label.current.textContent = t.dataset.cursor ?? "";
      };
      const onOut = () => (c.style.opacity = "0");
      window.addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onOut);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onOut);
      });
    }

    html.classList.add("cl-done");
    // fonts can shift layout — re-measure once they settle
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <>
      <div
        ref={progress}
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-[var(--cl-accent)]"
      />
      <div ref={cursor} aria-hidden className="cl-cursor">
        <span ref={label} className="cl-cursor-label" />
      </div>
    </>
  );
}
