"use client";

/**
 * Small touches: console greeting for devs, tab-blur title, blinking-caret
 * favicon, and the Konami code.
 */
import { useEffect } from "react";
import { profile } from "@/data/profile";
import { scrollState, toast, useScrollStore } from "@/hooks/useScrollStore";

const caretIcon = (on: boolean) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#05070D"/><text x="5" y="22" font-family="monospace" font-size="15" font-weight="700" fill="#22D3EE">&gt;</text>${
      on ? '<rect x="17" y="10" width="8" height="13" fill="#22D3EE"/>' : ""
    }</svg>`,
  )}`;

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function DevExtras() {
  useEffect(() => {
    // 1. console message for the curious
    const art = ["   ___  ____               ", "  / _ |/ _/__  ___ ____    ", " / __ / _/ _ \\/ _ `/ _ \\   ", "/_/ |_/_//_//_/\\_,_/_//_/   "].join("\n");
    console.log(`%c${art}`, "color:#22D3EE;font-family:monospace;font-size:12px");
    console.log(
      `%cHey, fellow dev 👋  You opened DevTools — we'll get along.\n%cHiring? ${profile.email}  ·  press \` for a terminal, or ⌘K.`,
      "color:#E5E7EB;font:14px monospace",
      "color:#22C55E;font:12px monospace",
    );

    // 2. tab-blur title
    const original = document.title;
    const onVis = () => {
      document.title = document.visibilityState === "hidden" ? "// come back, the build isn't done" : original;
    };
    document.addEventListener("visibilitychange", onVis);

    // 3. blinking-caret favicon (only while the tab is visible)
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon'][data-anim]");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.dataset.anim = "true";
      document.head.appendChild(link);
    }
    const iconLink = link;
    const on = caretIcon(true);
    const off = caretIcon(false);
    let blink = true;
    const fav = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      blink = !blink;
      iconLink.href = blink ? on : off;
    }, 530);

    // 4. Konami code
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = k === KONAMI[pos] ? pos + 1 : k === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        useScrollStore.getState().set({ matrix: true });
        scrollState.burst = 1;
        toast("god mode enabled — +30 lives");
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(fav);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  return null;
}
