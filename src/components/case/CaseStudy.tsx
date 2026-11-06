"use client";

/**
 * CaseStudy — /work/<slug>. A project told as a short film:
 *
 *  1. hero      — the screenshot, full-bleed (it just grew out of the card);
 *                 the title rises letter by letter, a soft light follows the
 *                 cursor, and scrolling pulls the page away from the image
 *  2. overview  — the description lights up word by word as you read
 *  3. showcase  — the screenshot in a browser window that tilts upright
 *  4. story     — the brief, what I built (rows that draw themselves), result
 *  5. code      — an editor whose lines type in when it comes into view
 *  6. stack     — a marquee of the tools, speed tied to scroll
 *  7. next      — the next project's image opens up; click and it becomes
 *                 the next hero
 */
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Project } from "@/data/projects";
import { useReducedMotionSync } from "@/hooks/useReducedMotion";
import { useSmoothScroll } from "@/hooks/useLenis";
import { useAwayTitle } from "@/hooks/usePersonaMark";
import { openCase, revealCase, trackPointer } from "@/lib/caseTransition";
import { Cursor } from "@/components/ui/Cursor";
import { Marquee } from "@/components/ui/Marquee";
import { TodoBadge } from "@/components/ui/ProjectCard";
import { Signature } from "@/components/brand/Signature";

const ease = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  project: Project;
  next: Project;
  index: number;
  total: number;
  codeHtml?: string;
};

export function CaseStudy({ project, next, index, total, codeHtml }: Props) {
  const router = useRouter();
  const reduced = useReducedMotionSync();
  useSmoothScroll(reduced);
  useAwayTitle(`👀 ${project.title} — still here`);
  const [leaving, setLeaving] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    trackPointer();
    router.prefetch(`/work/${next.slug}`);
  }, [router, next.slug]);

  // leaving: the page sinks away, then we go back where the visitor came from
  const back = (to?: string) => {
    if (leaving) return;
    setLeaving(true);
    let from: string | null = null;
    try {
      from = sessionStorage.getItem("cs-from");
    } catch {}
    setTimeout(
      () => {
        if (to) router.push(to);
        else if (from) router.back();
        else router.push("/#projects");
      },
      reduced ? 0 : 520,
    );
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  return (
    <div className="cs-root bg-bg text-text relative min-h-screen">
      <div aria-hidden className="grain" />
      <TopBar
        slug={project.slug}
        index={index}
        total={total}
        progress={progress}
        onBack={() => back()}
      />

      <motion.main
        id="main"
        animate={leaving ? { opacity: 0, y: -60, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: "50% 0%" }}
      >
        <Hero project={project} index={index} total={total} />
        <Overview project={project} />
        <Showcase project={project} />
        <Story project={project} />
        {codeHtml && project.codeSnippet && (
          <CodeReel html={codeHtml} lang={project.codeSnippet.lang} slug={project.slug} />
        )}
        <Marquee
          items={[...project.stack, ...project.category]}
          className="border-line font-display my-[12vh] border-y py-6 text-[clamp(2.6rem,8vw,7.5rem)] leading-none font-bold tracking-[-0.04em]"
        />
        <NextCase
          next={next}
          index={(index + 1) % total}
          total={total}
          onOpen={() => openCase(next.slug, router)}
          onAll={() => back("/#projects")}
        />
      </motion.main>
      <Cursor />
    </div>
  );
}

/* ───────────────────────────── top bar ───────────────────────────── */

function TopBar({
  slug,
  index,
  total,
  progress,
  onBack,
}: {
  slug: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onBack: () => void;
}) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 200 && y > prev);
  });
  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-white"
        style={{ scaleX: progress }}
      />
      <div
        className={`flex items-center justify-between px-[5vw] py-5 font-mono text-[12px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${hidden ? "pointer-events-none -translate-y-full opacity-0" : ""}`}
      >
        <button
          type="button"
          onClick={onBack}
          data-cursor="back"
          className="group flex items-center gap-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition-all duration-500 group-hover:-translate-x-1 group-hover:bg-white group-hover:text-black">
            ←
          </span>
          <span className="hidden sm:inline">
            Back <span className="opacity-50">· esc</span>
          </span>
        </button>
        <span className="hidden opacity-70 md:inline">~/work/{slug}</span>
        <span className="tabular-nums">
          {pad(index + 1)} <span className="opacity-40">/ {pad(total)}</span>
        </span>
      </div>
    </header>
  );
}

/* ───────────────────────────── 1 · hero ───────────────────────────── */

function Hero({ project, index, total }: { project: Project; index: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const iy = useTransform(p, [0, 1], [0, 9]);
  const ix = useTransform(p, [0, 1], [0, 5]);
  const r = useTransform(p, [0, 1], [0, 32]);
  const clip = useMotionTemplate`inset(${iy}vh ${ix}vw ${iy}vh ${ix}vw round ${r}px)`;
  const scale = useTransform(p, [0, 1], [1, 1.18]);
  const titleY = useTransform(p, [0, 1], [0, -180]);
  const fade = useTransform(p, [0, 0.55], [1, 0]);

  // a soft light that follows the cursor across the screenshot
  const mx = useMotionValue(50);
  const my = useMotionValue(40);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const light = useMotionTemplate`radial-gradient(520px circle at ${sx}% ${sy}%, rgba(34,211,238,0.16), transparent 65%)`;

  useEffect(() => {
    if (img.current?.complete) revealCase();
  }, []);

  const words = project.title.split(" ");
  let n = 0;

  return (
    <section
      ref={ref}
      className="relative h-[100svh] overflow-hidden"
      onPointerMove={(e) => {
        mx.set((e.clientX / innerWidth) * 100);
        my.set((e.clientY / innerHeight) * 100);
      }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden bg-[#05070d]"
        style={{ clipPath: clip }}
      >
        <motion.div className="absolute inset-0" style={{ scale }}>
          {/* plain <img>: the exact file the transition veil shows, so the swap is invisible */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={img}
            src={project.image}
            alt={`${project.title} — screenshot`}
            onLoad={revealCase}
            fetchPriority="high"
            className="cs-hero-img h-full w-full object-cover"
          />
        </motion.div>
        <span className="cs-hero-shade" />
        <motion.span
          aria-hidden
          className="absolute inset-0 mix-blend-screen"
          style={{ background: light }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-x-[5vw] bottom-[8vh] text-white"
        style={{ y: titleY, opacity: fade }}
      >
        <p className="cs-fade flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] tracking-[0.14em] text-white/70 uppercase">
          <span className="text-[#22d3ee]">Case study {pad(index + 1)}</span>
          <span className="h-px w-10 bg-white/40" />
          <span>{project.category.join(" · ")}</span>
          <span className="h-px w-10 bg-white/40" />
          <span>{project.year}</span>
          {project.placeholder && <TodoBadge />}
        </p>
        <h1 className="font-display mt-5 text-[clamp(3.2rem,11vw,12rem)] leading-[0.86] font-bold tracking-[-0.05em]">
          {words.map((w, wi) => (
            <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              {[...w].map((c) => (
                <span key={n} className="cs-char" style={{ "--i": n++ } as CSSProperties}>
                  {c}
                </span>
              ))}
              {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          ))}
        </h1>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <p className="cs-fade max-w-xl text-[clamp(1rem,1.4vw,1.25rem)] leading-snug text-white/80 [animation-delay:0.9s]">
            {project.tagline}
          </p>
          <span className="cs-fade flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase [animation-delay:1.1s]">
            Scroll
            <span className="cs-scroll-line relative block h-10 w-px overflow-hidden bg-white/20" />
          </span>
        </div>
      </motion.div>
      <span className="sr-only">
        Project {index + 1} of {total}
      </span>
    </section>
  );
}

/* ───────────────────────────── 2 · overview ───────────────────────────── */

/** text that lights up word by word as it scrolls through the screen */
function LitText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}
function Word({
  p,
  range,
  children,
}: {
  p: MotionValue<number>;
  range: [number, number];
  children: ReactNode;
}) {
  const opacity = useTransform(p, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
}

function Label({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="text-muted flex items-center gap-3 self-start font-mono text-[12px] tracking-[0.14em] uppercase">
      <span className="text-primary">{n}</span>
      <span className="bg-line-strong h-px w-8" />
      {children}
    </p>
  );
}

function Overview({ project }: { project: Project }) {
  const facts: [string, ReactNode][] = [
    ["Year", project.year],
    ["Role", project.role ?? "Design & development"],
    ["Type", project.category.join(", ")],
    ["Built with", project.stack.join(" · ")],
  ];
  const links = [
    project.liveUrl && { href: project.liveUrl, label: "Visit live site" },
    project.repoUrl && {
      href: project.repoUrl,
      label: project.repoUrl.includes("/pull/") ? "The pull request on GitHub" : "Source on GitHub",
    },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <section className="grid gap-14 px-[5vw] pt-[16vh] pb-[10vh] lg:grid-cols-[1fr_2.2fr] lg:gap-[6vw]">
      <div>
        <Label n="01">Overview</Label>
        <dl className="mt-10 space-y-0">
          {facts.map(([k, v], i) => (
            <motion.div
              key={k}
              className="relative grid grid-cols-[7.5rem_1fr] gap-4 py-4 text-[15px]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease }}
            >
              <motion.span
                aria-hidden
                className="bg-line-strong absolute inset-x-0 top-0 h-px origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 1.1, ease }}
              />
              <dt className="text-faint font-mono text-[12px] tracking-[0.08em] uppercase">{k}</dt>
              <dd className="text-text">{v}</dd>
            </motion.div>
          ))}
        </dl>
        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="cs-pill group border-line-strong inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px]"
              >
                <span className="relative z-10">{l.label}</span>
                <span className="relative z-10 transition-transform duration-500 group-hover:rotate-45">
                  ↗
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
      <LitText
        text={project.description}
        className="font-display text-[clamp(1.7rem,3.3vw,3.4rem)] leading-[1.12] font-medium tracking-[-0.025em]"
      />
    </section>
  );
}

/* ───────────────────────────── 3 · showcase ───────────────────────────── */

function Showcase({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(p, [0, 1], [30, 0]);
  const scale = useTransform(p, [0, 1], [0.84, 1]);
  const y = useTransform(p, [0, 1], [80, 0]);
  const glow = useTransform(p, [0.3, 1], [0, 1]);
  const host = project.liveUrl
    ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : `${project.slug}.app`;

  return (
    <section ref={ref} className="relative px-[5vw] py-[8vh] [perspective:1800px]">
      <motion.div
        aria-hidden
        className="bg-primary/25 pointer-events-none absolute inset-x-[15%] top-[30%] bottom-0 rounded-full blur-[120px]"
        style={{ opacity: glow }}
      />
      <motion.figure
        className="border-line-strong bg-surface relative mx-auto max-w-[1400px] overflow-hidden rounded-[14px] border shadow-[0_60px_120px_-40px_rgba(0,0,0,0.7)]"
        style={{ rotateX, scale, y, transformOrigin: "50% 100%" }}
      >
        <div className="border-line bg-surface-2 flex items-center gap-4 border-b px-4 py-3">
          <span className="flex gap-1.5" aria-hidden>
            <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <i className="h-3 w-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="bg-bg/60 text-muted mx-auto flex max-w-md flex-1 items-center justify-center gap-2 rounded-md px-3 py-1 font-mono text-[12px]">
            <span className="text-accent">●</span> {host}
          </span>
          <span className="w-[54px]" aria-hidden />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </motion.figure>
      {project.gallery && project.gallery.length > 0 && (
        <div className="mx-auto mt-[8vh] grid max-w-[1400px] gap-6 sm:grid-cols-2">
          {project.gallery.map((src, i) => (
            <motion.div
              key={src}
              className="border-line overflow-hidden rounded-[12px] border"
              initial={{ clipPath: "inset(18% 0 0 0 round 12px)", opacity: 0 }}
              whileInView={{ clipPath: "inset(0% 0 0 0 round 12px)", opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.1, duration: 1.1, ease }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${project.title} — detail ${i + 1}`}
                loading="lazy"
                className="w-full"
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ───────────────────────────── 4 · story ───────────────────────────── */

function Story({ project }: { project: Project }) {
  const steps = project.approach ?? project.highlights.map((h) => ({ title: h, body: "" }));
  return (
    <section className="px-[5vw] pt-[14vh]">
      {project.challenge && (
        <div className="grid gap-10 pb-[14vh] lg:grid-cols-[1fr_2.2fr] lg:gap-[6vw]">
          <Label n="02">The brief</Label>
          <LitText
            text={project.challenge}
            className="font-display text-[clamp(1.7rem,3.3vw,3.4rem)] leading-[1.12] font-medium tracking-[-0.025em]"
          />
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_2.2fr] lg:gap-[6vw]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Label n={project.challenge ? "03" : "02"}>What I built</Label>
          <p className="text-muted mt-6 max-w-xs text-[15px] leading-relaxed">
            {steps.length} moving parts, in the order they came together.
          </p>
        </div>
        <ol>
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              className="cs-row group relative grid grid-cols-[3.5rem_1fr] gap-4 py-9 sm:grid-cols-[5rem_1fr] sm:py-11"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.9, ease }}
            >
              <motion.span
                aria-hidden
                className="bg-line-strong absolute inset-x-0 top-0 h-px origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease }}
              />
              <span className="text-faint group-hover:text-primary font-mono text-[13px] transition-colors duration-500">
                {pad(i + 1)}
              </span>
              <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.9rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
                  {s.title}
                </h3>
                {s.body && (
                  <p className="text-muted mt-4 max-w-2xl text-[16px] leading-relaxed">{s.body}</p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {project.outcome && (
        <motion.blockquote
          className="mx-auto mt-[16vh] max-w-5xl text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.1, ease }}
        >
          <span className="text-primary font-mono text-[12px] tracking-[0.2em] uppercase">
            The result
          </span>
          <p className="font-display mt-6 text-[clamp(1.9rem,4.4vw,4.4rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
            <span className="cs-grad">{project.outcome}</span>
          </p>
        </motion.blockquote>
      )}
    </section>
  );
}

/* ───────────────────────────── 5 · code ───────────────────────────── */

function CodeReel({ html, lang, slug }: { html: string; lang: string; slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-20% 0px" });

  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>(".line").forEach((l, i) => {
      l.style.transitionDelay = `${i * 70}ms`;
    });
  }, [html]);

  return (
    <section className="grid gap-10 px-[5vw] pt-[16vh] lg:grid-cols-[1fr_2.2fr] lg:gap-[6vw]">
      <div>
        <Label n="—">Under the hood</Label>
        <p className="text-muted mt-6 max-w-xs text-[15px] leading-relaxed">
          A piece of the code that holds it together.
        </p>
      </div>
      <div className="border-line-strong bg-surface overflow-hidden rounded-[12px] border shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
        <div className="border-line bg-surface-2 flex items-center justify-between border-b px-4 font-mono text-[12px]">
          <span className="border-primary text-text border-b-2 py-2.5">
            {slug}.{lang}
          </span>
          <span className="text-faint flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-accent" : "bg-faint"}`} />
            {on ? "compiled" : "waiting"}
          </span>
        </div>
        <div
          ref={ref}
          data-lenis-prevent
          className={`cs-code code-frame numbered overflow-x-auto py-5 pl-2 text-[13px] ${on ? "on" : ""}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}

/* ───────────────────────────── 6 · next ───────────────────────────── */

function NextCase({
  next,
  index,
  total,
  onOpen,
  onAll,
}: {
  next: Project;
  index: number;
  total: number;
  onOpen: () => void;
  onAll: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const inset = useTransform(p, [0.1, 0.85], [22, 0]);
  const round = useTransform(p, [0.1, 0.85], [28, 12]);
  const clip = useMotionTemplate`inset(${inset}% ${inset}% 0% ${inset}% round ${round}px)`;
  const imgScale = useTransform(p, [0.1, 1], [1.25, 1]);

  return (
    <section ref={ref} className="relative px-[5vw] pt-[6vh]">
      <div className="text-muted flex items-center justify-between font-mono text-[12px] tracking-[0.14em] uppercase">
        <span>
          <span className="text-primary">Next case</span> · {pad(index + 1)} / {pad(total)}
        </span>
        <span className="hidden sm:inline">Keep going ↓</span>
      </div>

      <button
        type="button"
        onClick={onOpen}
        data-cursor="open"
        className="group mt-8 block w-full text-left"
        aria-label={`Next case study: ${next.title}`}
      >
        <span className="font-display group-hover:text-primary block text-[clamp(2.8rem,9vw,10rem)] leading-[0.88] font-bold tracking-[-0.05em] transition-colors duration-500">
          {next.title}
          <span className="ml-4 inline-block align-middle text-[0.5em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:-rotate-45">
            →
          </span>
        </span>
        <span className="text-muted mt-4 block max-w-xl text-[16px]">{next.tagline}</span>
        <motion.span
          data-cs-img={next.slug}
          className="bg-surface relative mt-10 block h-[52vh] w-full overflow-hidden"
          style={{ clipPath: clip }}
        >
          <motion.span className="absolute inset-0 block" style={{ scale: imgScale }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={next.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
            />
          </motion.span>
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.span>
      </button>

      <footer className="text-muted flex flex-wrap items-center justify-between gap-4 py-10 font-mono text-[12px]">
        <button type="button" onClick={onAll} className="cs-link">
          ← All work
        </button>
        <Signature current="dev" className="text-text" />
        <Link href="/#contact" className="cs-link">
          Say hello →
        </Link>
      </footer>
    </section>
  );
}
