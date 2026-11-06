"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState, useScrollStore } from "./useScrollStore";
import { clamp } from "@/lib/utils";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Smoothly scroll to a section id (works with and without Lenis). */
export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { duration: immediate ? 0 : 1.8, immediate, force: true });
  } else {
    el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }
}

interface Range {
  id: string;
  scene: number;
  top: number;
  height: number;
  a: number; // start of the "fully active" range
  b: number; // end of the "fully active" range
}

/**
 * Maps the scroll position to a continuous scene index for the Core.
 * While a section fills the viewport the index sits exactly on its scene
 * (shape holds still for reading); in the gap between two sections it
 * interpolates — that is where the particles swarm into the next shape.
 */
function computeScene(y: number, ranges: Range[]) {
  if (!ranges.length) return 1;
  if (y <= ranges[0].a) return ranges[0].scene;
  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    if (y >= r.a && y <= r.b) return r.scene;
    const next = ranges[i + 1];
    if (next && y > r.b && y < next.a) {
      const t = (y - r.b) / Math.max(1, next.a - r.b);
      return r.scene + (next.scene - r.scene) * t;
    }
  }
  return ranges[ranges.length - 1].scene;
}

/**
 * Boots Lenis, keeps GSAP ScrollTrigger in sync with it, and publishes
 * progress / velocity / scene index / active section every frame.
 */
export function useSmoothScroll(reduced: boolean) {
  useEffect(() => {
    let ranges: Range[] = [];
    let lastY = window.scrollY;
    let lastHeight = 0;
    // cached: reading scrollHeight every frame forces a layout every frame
    let maxScroll = 1;
    let roTimer: ReturnType<typeof setTimeout> | undefined;

    const measure = () => {
      const vh = window.innerHeight;
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      ranges = els.map((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const height = rect.height;
        const a = top - vh * 0.25;
        const b = Math.max(top + vh * 0.25, top + height - vh * 0.75);
        return { id: el.id, scene: Number(el.dataset.scene), top, height, a, b };
      });
      lastHeight = document.body.scrollHeight;
      maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    };

    if (!reduced) {
      lenisInstance = new Lenis({
        autoRaf: false,
        lerp: 0.09,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        prevent: (node) => !!node.closest("[data-lenis-prevent]"),
      });
      lenisInstance.on("scroll", ScrollTrigger.update);
    }

    const tick = (time: number, deltaMs: number) => {
      lenisInstance?.raf(time * 1000);
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = maxScroll;
      const rawV = lenisInstance ? (lenisInstance.isScrolling ? lenisInstance.velocity : 0) : y - lastY;
      lastY = y;
      scrollState.y = y;
      scrollState.progress = clamp(y / max);
      scrollState.velocity += (rawV - scrollState.velocity) * (1 - Math.exp(-Math.min(deltaMs, 250) / 100));
      if (Math.abs(scrollState.velocity) < 0.01) scrollState.velocity = 0;
      if (Math.abs(rawV) > 0.1) scrollState.direction = rawV > 0 ? 1 : -1;
      scrollState.scene = computeScene(y, ranges);

      const mid = y + vh * 0.5;
      let active = ranges[0]?.id ?? "home";
      for (const r of ranges) {
        scrollState.local[r.id] = clamp((mid - r.top) / Math.max(1, r.height));
        if (mid >= r.top) active = r.id;
      }
      if (useScrollStore.getState().activeSection !== active) {
        useScrollStore.getState().set({ activeSection: active });
      }
      // impulses decay
      const decay = Math.min(deltaMs, 250) / 16.7;
      scrollState.burst *= Math.pow(0.96, decay);
      scrollState.pulse *= Math.pow(0.97, decay);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.addEventListener("refresh", measure);
    // Content height changes (filters, fonts, images) → re-measure pins.
    // Debounced and height-gated so pin-spacer changes can't loop.
    const ro = new ResizeObserver(() => {
      clearTimeout(roTimer);
      clearInterval(remeasure);
      roTimer = setTimeout(() => {
        if (Math.abs(document.body.scrollHeight - lastHeight) > 4) ScrollTrigger.refresh();
      }, 250);
    });
    ro.observe(document.body);
    measure();
    ScrollTrigger.refresh();
    // Pins can be created/re-created after mount (e.g. when the mobile/GPU
    // flags resolve) without a global refresh event — re-measure cheaply.
    const remeasure = setInterval(measure, 800);

    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener("refresh", measure);
      ro.disconnect();
      clearTimeout(roTimer);
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, [reduced]);
}
