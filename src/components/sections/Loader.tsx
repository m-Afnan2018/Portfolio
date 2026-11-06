"use client";

/**
 * Loader — a full-screen terminal boot sequence driven by real loading
 * progress (fonts, page, 3D scene, textures; see lib/loadProgress.ts).
 * The final line, `Mohammad Afnan`, physically becomes the hero heading via
 * GSAP Flip — no hard cut. Skippable with any key / click; once per session.
 */
import { useEffect, useRef, useState } from "react";
import { gsap, Flip } from "@/lib/gsap";
import { bootLines } from "@/data/boot";
import { profile } from "@/data/profile";
import { scrollState, isReducedNow, useScrollStore } from "@/hooks/useScrollStore";
import { onProgress, reportProgress } from "@/lib/loadProgress";
import { playSound } from "@/lib/sound";
import { getLenis } from "@/hooks/useLenis";

const MIN_MS = 2600;
const MAX_MS = 9000;
const BAR = 24;

export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const set = useScrollStore((s) => s.set);
  const [shown, setShown] = useState(0); // displayed progress 0..1
  const [phase, setPhase] = useState<"boot" | "welcome" | "name" | "done">("boot");
  const [typed, setTyped] = useState("");
  const finishing = useRef(false);
  // On a first visit the "who are you?" gate (PersonaGate) sits on top; the
  // boot sequence waits until the visitor picks the developer version.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!document.documentElement.classList.contains("js-ask")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      return;
    }
    const go = () => setReady(true);
    window.addEventListener("persona:chosen", go, { once: true });
    return () => window.removeEventListener("persona:chosen", go);
  }, []);

  /** The FLIP: loader line → hero heading. */
  function handoff() {
    if (finishing.current) return;
    finishing.current = true;
    sessionStorage.setItem("booted", "1");
    const hero = document.querySelector<HTMLElement>("[data-flip-id='hero-name']:not([data-loader])");
    const src = nameRef.current;
    const html = document.documentElement;
    const reduced = isReducedNow();

    const finish = () => {
      html.classList.remove("js-boot");
      set({ loaderDone: true });
      setPhase("done");
      getLenis()?.start();
    };

    gsap.to(scrollState, { intro: 1, duration: reduced ? 0 : 2.6, ease: "expo.out" });
    playSound("whoosh");

    if (!hero || !src || reduced) {
      gsap.to(root.current, { autoAlpha: 0, duration: 0.4, onComplete: finish });
      return;
    }

    const state = Flip.getState(src);
    // reveal everything that is not the name; the name itself flips in
    html.classList.remove("js-boot");
    root.current!.style.display = "flex";
    gsap.set(src, { opacity: 0 });
    Flip.from(state, {
      targets: hero,
      duration: 1.5,
      ease: "expo.inOut",
      scale: true,
      absolute: false,
      onComplete: () => window.dispatchEvent(new Event("hero:glitch")),
    });
    gsap.to(root.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.3,
      ease: "expo.inOut",
      delay: 0.15,
      onComplete: finish,
    });
  }

  // fonts + page progress reporters
  useEffect(() => {
    document.fonts?.ready.then(() => reportProgress("fonts", 1));
    if (document.readyState === "complete") reportProgress("page", 1);
    else window.addEventListener("load", () => reportProgress("page", 1), { once: true });
  }, []);

  // first visit this session? otherwise hand straight to the hero
  useEffect(() => {
    if (!ready) return;
    const booting = document.documentElement.classList.contains("js-boot");
    if (!booting) {
      set({ loaderDone: true });
      gsap.to(scrollState, { intro: 1, duration: isReducedNow() ? 0 : 2.4, ease: "expo.out", delay: 0.2 });
      // the boot decision was made pre-hydration by the <head> script
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      return;
    }
    getLenis()?.stop();
    window.scrollTo(0, 0);
    let real = 0;
    const off = onProgress((p) => (real = p));
    const start = performance.now();
    let raf = 0;
    const loop = () => {
      const elapsed = performance.now() - start;
      const timeCap = Math.min(1, elapsed / MIN_MS);
      const target = elapsed > MAX_MS ? 1 : Math.min(real, timeCap);
      setShown((s) => {
        const next = s + (target - s) * 0.18;
        return target - next < 0.004 ? target : next;
      });
      if (target >= 1 && elapsed > MIN_MS) {
        setShown(1);
        setPhase((p) => (p === "boot" ? "welcome" : p));
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      off();
    };
  }, [set, ready]);

  // welcome → type the name
  useEffect(() => {
    if (phase === "welcome") {
      const t = setTimeout(() => setPhase("name"), 520);
      return () => clearTimeout(t);
    }
    if (phase === "name") {
      let i = 0;
      const id = setInterval(() => {
        i++;
        setTyped(profile.name.slice(0, i));
        playSound("key");
        if (i >= profile.name.length) {
          clearInterval(id);
          setTimeout(handoff, 380);
        }
      }, 38);
      return () => clearInterval(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // skip with any key / click
  useEffect(() => {
    if (phase === "done" || !ready) return;
    const skip = (e: Event) => {
      if (e instanceof KeyboardEvent && (e.metaKey || e.ctrlKey)) return;
      setShown(1);
      setTyped(profile.name);
      setPhase("name");
      setTimeout(handoff, 60);
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase === "done", ready]);

  if (phase === "done") return null;

  const visible = bootLines.filter((l) => shown >= l.at);
  const blocks = Math.round(shown * BAR);
  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className="boot-loader fixed inset-0 z-[90] flex-col justify-end bg-bg px-[5vw] pb-[10vh] font-mono text-[13px] text-muted sm:text-sm"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="max-w-3xl space-y-1.5">
        {visible.map((l) => (
          <div key={l.text} className="flex gap-3">
            {l.status === "ok" ? <span className="text-accent">[  OK  ]</span> : <span className="text-primary">[ INFO ]</span>}
            <span className="text-text/85">{l.text}</span>
          </div>
        ))}
        <div className="pt-3 text-faint">
          [<span className="text-primary">{"█".repeat(blocks)}</span>
          {"░".repeat(BAR - blocks)}] {Math.round(shown * 100).toString().padStart(3, " ")}%
        </div>
        {(phase === "welcome" || phase === "name") && (
          <div className="pt-4 text-text">
            &gt; welcome, visitor<span className="caret ml-0.5" />
          </div>
        )}
        {phase === "name" && (
          <div className="pt-1 text-text">
            <span className="text-accent">$</span> whoami{" "}
            <span ref={nameRef} data-flip-id="hero-name" data-loader className="inline-block text-primary">
              {typed}
            </span>
          </div>
        )}
      </div>
      <p className="absolute right-[5vw] top-[6vh] text-[11px] uppercase tracking-[0.12em] text-faint">
        press any key to skip
      </p>
    </div>
  );
}
