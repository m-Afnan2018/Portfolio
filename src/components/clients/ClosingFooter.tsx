"use client";

/**
 * Footer for /work-with-me.
 *
 *  · big email with a sweeping underline, plus a magnetic "back to top"
 *  · link columns: this page, the other versions of the site, elsewhere
 *  · the name in giant gradient letters that rise in one by one
 *  · live local time in the bottom bar
 */
import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { setPersona } from "@/lib/persona";
import { LiveClock } from "./CtaSection";
import { Signature } from "@/components/brand/Signature";

const PAGE = [
  ["#services", "Services"],
  ["#process", "How it works"],
  ["#work", "Results"],
  ["#pricing", "Pricing"],
  ["#faq", "FAQ"],
];

export function ClosingFooter() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);

  // the name always fills the content width exactly — measured, not guessed
  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    const fit = () => {
      const chars = [...el.children] as HTMLElement[];
      el.style.fontSize = "100px";
      const natural = chars.reduce((w, c) => w + c.getBoundingClientRect().width, 0);
      if (natural > 0) el.style.fontSize = `${(100 * el.clientWidth) / natural}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-char]"), {
        yPercent: 110,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: { trigger: q("[data-name]")[0], start: "top 95%", once: true },
      });
      gsap.from(q("[data-col]"), {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  const elsewhere = [
    { href: profile.links.github, label: "GitHub" },
    { href: profile.links.linkedin, label: "LinkedIn" },
    { href: `mailto:${profile.email}`, label: "Email" },
    { href: `https://wa.me/${profile.phone.replace(/\D/g, "")}`, label: "WhatsApp" },
  ].filter((l) => !l.href.includes("TODO"));

  return (
    <footer ref={root} className="relative overflow-hidden bg-[var(--cl-ink)] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="cl-stage-bg absolute inset-0"
          style={{ "--glow": "#2563eb" } as CSSProperties}
        />
        <div className="cl-grain" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-5 pt-20 sm:px-8 sm:pt-28">
        {/* email + back to top */}
        <div className="flex flex-wrap items-end justify-between gap-10 border-b border-white/10 pb-14">
          <div data-col>
            <p className="text-[14px] text-white/50">Have a project in mind?</p>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="Email"
              className="cl-sweep cl-display mt-3 inline-block text-[clamp(1.7rem,4.4vw,3.6rem)] leading-tight tracking-[-0.03em]"
            >
              {profile.email}
            </a>
          </div>
          <span data-magnetic="0.35" className="inline-block" data-col>
            <a
              href="#cl-main"
              data-cursor="Top"
              aria-label="Back to top"
              className="group flex h-24 w-24 flex-col items-center justify-center rounded-full border border-white/20 text-[13px] transition-colors duration-500 hover:border-white hover:bg-white hover:text-[var(--cl-ink)]"
            >
              <span
                aria-hidden
                className="text-[20px] transition-transform duration-500 group-hover:-translate-y-1"
              >
                ↑
              </span>
              Top
            </a>
          </span>
        </div>

        {/* columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div data-col>
            <p className="cl-display text-[22px]">{profile.name}</p>
            <p className="mt-3 max-w-[16rem] text-[14px] leading-relaxed text-white/55">
              Websites, online stores and web apps — built, hosted and looked after by one
              developer.
            </p>
          </div>
          <nav data-col aria-label="On this page">
            <p className="text-[12px] font-semibold tracking-[0.14em] text-white/40 uppercase">
              On this page
            </p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {PAGE.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="cl-foot-link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav data-col aria-label="Other versions">
            <p className="text-[12px] font-semibold tracking-[0.14em] text-white/40 uppercase">
              Other versions
            </p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li>
                <Link href="/" onClick={() => setPersona("dev")} className="cl-foot-link">
                  Developer portfolio
                </Link>
              </li>
              <li>
                <Link href="/hr" onClick={() => setPersona("hr")} className="cl-foot-link">
                  Recruiter brief
                </Link>
              </li>
            </ul>
          </nav>
          <nav data-col aria-label="Elsewhere">
            <p className="text-[12px] font-semibold tracking-[0.14em] text-white/40 uppercase">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {elsewhere.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="cl-foot-link"
                  >
                    {l.label}{" "}
                    <span aria-hidden className="text-white/35">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* the name, giant */}
        <p
          ref={nameRef}
          data-name
          aria-hidden
          className="cl-display flex overflow-hidden pb-[0.06em] text-[11vw] leading-[0.85] tracking-[-0.05em] whitespace-nowrap select-none"
        >
          {profile.name.split("").map((ch, i) => (
            <span key={i} data-char className="cl-foot-name inline-block whitespace-pre">
              {ch}
            </span>
          ))}
        </p>

        {/* bottom bar */}
        <Signature current="client" className="border-t border-white/10 py-6 text-white" />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-6 text-[13px] text-white/45">
          <span>
            © 2026 {profile.name} · Freelance web development · {profile.location}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
            <LiveClock className="tabular-nums" /> · replies within a working day
          </span>
        </div>
      </div>
    </footer>
  );
}
