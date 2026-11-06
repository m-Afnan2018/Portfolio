"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { copy } from "@/data/copy";
import { useReducedMotionFlag, useScrollStore } from "@/hooks/useScrollStore";
import { scrollToId } from "@/hooks/useLenis";
import { duration, ease, stagger } from "@/lib/motion";
import { GLYPHS } from "@/lib/utils";
import { Typewriter } from "@/components/ui/Typewriter";
import { CommandButton } from "@/components/ui/CommandButton";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const loaderDone = useScrollStore((s) => s.loaderDone);
  const reduced = useReducedMotionFlag();

  // supporting elements reveal once the loader hands over
  useGSAP(
    () => {
      if (!loaderDone || reduced) return;
      gsap.from("[data-hero-reveal]", {
        yPercent: 60,
        opacity: 0,
        filter: "blur(8px)",
        duration: duration.reveal,
        ease: ease.out,
        stagger: stagger.item,
        delay: 0.5,
      });
    },
    { scope: root, dependencies: [loaderDone, reduced] },
  );

  // the name glitches / scrambles in (and again on hover)
  useGSAP(
    () => {
      if (reduced) return;
      const words = gsap.utils.toArray<HTMLElement>("[data-glitch]", root.current);
      const split = SplitText.create(words, { type: "chars" });
      const glitch = (delay = 0) => {
        words.forEach((w, i) => {
          const text = w.dataset.glitch!;
          gsap.to(w, {
            duration: 0.9,
            delay: delay + i * 0.12,
            scrambleText: { text, chars: GLYPHS.toUpperCase(), speed: 0.8, revealDelay: 0.1 },
          });
        });
      };
      const onGlitch = () => {
        split.revert();
        glitch();
      };
      window.addEventListener("hero:glitch", onGlitch);
      if (!document.documentElement.classList.contains("js-boot")) {
        // no loader this session → reveal chars from the mask instead
        gsap.from(split.chars, { yPercent: 110, duration: duration.reveal, ease: ease.out, stagger: stagger.char, delay: 0.2 });
      }
      const h1 = root.current!.querySelector("h1")!;
      const onEnter = () => glitch();
      h1.addEventListener("mouseenter", onEnter);
      return () => {
        window.removeEventListener("hero:glitch", onGlitch);
        h1.removeEventListener("mouseenter", onEnter);
        split.revert();
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  // scroll-out: the name drifts and fades as the journey begins
  useGSAP(
    () => {
      if (reduced) return;
      gsap.to("[data-hero-parallax]", {
        yPercent: -30,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="home"
      data-scene="1"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-[5vw] pb-16 pt-28 lg:pl-[calc(5vw+60px)] xl:pr-[calc(5vw+56px)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p data-hero-reveal className="t-label !text-primary">
          {copy.hero.eyebrow}
        </p>
        <p data-hero-reveal className="t-label hidden text-right sm:block">
          {profile.location} · {profile.coordinates}
          <br />
          <span className="text-accent">{copy.hero.status}</span>
        </p>
      </div>

      <div data-hero-parallax className="relative z-10 mt-10 max-w-[min(100%,1500px)]">
        <h1 id="hero-title" className="t-display select-none" data-flip-id="hero-name" data-hero-hide data-cursor="glitch()">
          <span className="sr-only">
            {profile.name} — {profile.title}
          </span>
          <span aria-hidden className="block">
            <span data-glitch={profile.firstName.toUpperCase()} className="inline-block">
              {profile.firstName.toUpperCase()}
            </span>
          </span>
          <span aria-hidden className="block whitespace-nowrap">
            <span data-glitch={profile.lastName.toUpperCase()} className="t-outline inline-block">
              {profile.lastName.toUpperCase()}
            </span>
            <span className="caret ml-[0.06em] !h-[0.62em] !w-[0.16em] align-baseline" />
          </span>
        </h1>

        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-6">
            <p data-hero-reveal className="font-mono text-base text-text sm:text-lg">
              <span className="text-accent">❯ </span>
              <Typewriter words={profile.roles} start={loaderDone} />
            </p>
            <p data-hero-reveal className="t-body mt-5 max-w-[46ch] !text-text/80">
              {profile.oneLiner}
            </p>
            <div data-hero-reveal className="mt-9 flex flex-wrap gap-3">
              <CommandButton
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("projects");
                }}
              >
                {copy.hero.ctaProjects}
              </CommandButton>
              <CommandButton href={profile.resume} download variant="ghost">
                <Icon name="download" size={14} />
                {copy.hero.ctaResume}
              </CommandButton>
            </div>
          </div>
        </div>
      </div>

      <div data-hero-reveal className="relative z-10 mt-12 flex items-end justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
        <span className="flex items-center gap-3">
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-primary" />
          </span>
          {copy.hero.scroll}
        </span>
        <span className="hidden max-w-[40ch] text-right normal-case tracking-normal md:block">
          <span className="text-warn">●</span> currently building: {profile.currentlyBuilding}
        </span>
      </div>
    </section>
  );
}
