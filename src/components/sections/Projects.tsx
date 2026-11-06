"use client";

/**
 * Projects — pinned horizontal scroll of featured work (velocity skew +
 * image parallax inside each card), then a git-branch filter over the full
 * archive grid. Everything comes from src/data/projects.ts.
 */
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { featuredProjects, projects, projectCategories, type Project, type ProjectCategory } from "@/data/projects";
import { copy } from "@/data/copy";
import { scrollState, useReducedMotionFlag, useScrollStore } from "@/hooks/useScrollStore";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard, SourceFace, StackChips, TodoBadge } from "@/components/ui/ProjectCard";
import { Icon } from "@/components/ui/Icon";
import { playSound } from "@/lib/sound";

function FeaturedCard({ project, index, snippetHtml }: { project: Project; index: number; snippetHtml?: string }) {
  const [flipped, setFlipped] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const set = useScrollStore((s) => s.set);
  const open = () => set({ modalSlug: project.slug, modalOrigin: "featured" });

  return (
    <motion.article
      layoutId={`featured-card-${project.slug}`}
      data-hcard
      className="relative w-[84vw] shrink-0 [transform-style:preserve-3d] sm:w-[70vw] lg:w-[min(58vw,1000px,calc((100svh-300px)*1.6))]"
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.9, ease: ease.outBezier }}
      onMouseEnter={() => video.current?.play().catch(() => undefined)}
      onMouseLeave={() => video.current?.pause()}
    >
      <div className="glass flex h-full flex-col overflow-hidden rounded-[8px] [backface-visibility:hidden]" aria-hidden={flipped}>
        <button type="button" onClick={open} data-cursor="view" data-cs-img={project.slug} className="group relative block aspect-[16/10] w-full overflow-hidden border-b border-line text-left" aria-label={`Open ${project.title}`}>
          <div data-parallax className="absolute inset-y-0 -left-[8%] w-[116%]">
            <Image src={project.image} alt="" fill sizes="(max-width: 1024px) 84vw, 62vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
            {project.video && (
              <video ref={video} src={project.video} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent" />
          <span className="absolute left-5 top-4 font-mono text-[11px] tracking-[0.12em] text-text/80">
            {String(index + 1).padStart(2, "0")} / {String(featuredProjects.length).padStart(2, "0")}
          </span>
          <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-7">
            <div className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
              {project.category.join(" · ")} {project.placeholder && <TodoBadge />}
            </div>
            <h3 className="font-display text-[clamp(2rem,4.6vw,5rem)] font-bold leading-[0.9] tracking-[-0.04em] text-white">{project.title}</h3>
          </div>
        </button>
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div className="max-w-xl">
            <p className="text-[15px] text-muted">{project.tagline}</p>
            <StackChips stack={project.stack} className="mt-4" />
          </div>
          <div className="flex shrink-0 items-center gap-4 font-mono text-xs">
            {project.codeSnippet && (
              <button type="button" onClick={() => setFlipped(true)} className="tap-pad text-muted hover:text-primary">
                {"</>"} {copy.projects.viewSource}
              </button>
            )}
            <button type="button" onClick={open} className="inline-flex items-center gap-1.5 rounded-[2px] bg-primary px-3 py-2 text-bg hover:bg-text">
              {copy.projects.open} <Icon name="arrow" size={12} />
            </button>
          </div>
        </div>
      </div>
      {project.codeSnippet && <SourceFace html={snippetHtml} lang={project.codeSnippet.lang} onBack={() => setFlipped(false)} />}
    </motion.article>
  );
}

type Filter = "all" | ProjectCategory;
const slugify = (c: string) => c.toLowerCase().replace(/\s/g, "-");

export function Projects({ snippets }: { snippets: Record<string, string> }) {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionFlag();
  const isMobile = useScrollStore((s) => s.isMobile);
  const [filter, setFilter] = useState<Filter>("all");

  const branches = useMemo<Filter[]>(
    () => ["all", ...projectCategories.filter((c) => projects.some((p) => p.category.includes(c)))],
    [],
  );
  const list = filter === "all" ? projects : projects.filter((p) => p.category.includes(filter));

  // horizontal pinned scroll
  useGSAP(
    () => {
      if (reduced || isMobile) return;
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth + window.innerWidth * 0.05;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });
      // parallax inside each card, driven by the horizontal tween
      gsap.utils.toArray<HTMLElement>("[data-hcard]", el).forEach((card) => {
        const img = card.querySelector("[data-parallax]");
        if (!img) return;
        gsap.fromTo(img, { xPercent: -6 }, {
          xPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
      // velocity skew
      const skewTo = gsap.quickTo("[data-hcard]", "skewX", { duration: 0.5, ease: "power3.out" });
      const tick = () => {
        skewTo(gsap.utils.clamp(-6, 6, -scrollState.velocity * 0.18));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root, dependencies: [reduced, isMobile], revertOnUpdate: true },
  );

  // refresh pin positions after the grid reflows
  const onFilter = (f: Filter) => {
    setFilter(f);
    playSound("tick");
    setTimeout(() => ScrollTrigger.refresh(), 700);
  };

  return (
    <section ref={root} id="projects" data-scene="5" aria-labelledby={isMobile ? "projects-title-m" : "projects-title"} className="relative">
      <div ref={pin} className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-10 pt-20 lg:h-screen">
        {/* on mobile the heading sits above the swipeable track */}
        <div className="px-[5vw] pb-8 lg:hidden">
          <SectionHeading id="projects-title-m" eyebrow={copy.projects.eyebrow} parts={copy.projects.title} />
        </div>
        <div
          ref={track}
          className={cn(
            "flex items-center gap-6 px-[5vw] will-change-transform lg:gap-10 lg:pl-[calc(5vw+60px)]",
            (reduced || isMobile) && "no-scrollbar snap-x snap-mandatory overflow-x-auto [&>*]:snap-center",
          )}
        >
          {/* desktop: the heading is the first "slide" of the horizontal track */}
          <div className="hidden w-[34vw] shrink-0 flex-col justify-between self-stretch lg:flex">
            <SectionHeading id="projects-title" eyebrow={copy.projects.eyebrow} parts={copy.projects.title} />
            <p className="t-label flex items-center gap-2">
              {copy.projects.hint} <Icon name="arrow" size={12} />
            </p>
          </div>
          {featuredProjects.map((p, i) => (
            <FeaturedCard key={p.slug} project={p} index={i} snippetHtml={snippets[p.slug]} />
          ))}
          <a
            href="#archive"
            className="glass flex w-[60vw] shrink-0 flex-col justify-between rounded-[8px] p-8 sm:w-[34vw] lg:w-[24vw]"
          >
            <span className="font-mono text-xs text-faint">{"// end of featured"}</span>
            <span>
              <span className="t-h3 block text-text">
                {projects.length - featuredProjects.length}+ more in the archive
              </span>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-primary">
                {copy.projects.archiveTitle} <Icon name="arrow" size={14} className="rotate-90" />
              </span>
            </span>
          </a>
        </div>
      </div>

      {/* ── archive ── */}
      <div id="archive" className="px-[5vw] pb-24 pt-20 lg:pl-[calc(5vw+60px)] xl:pr-[calc(5vw+56px)]">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3 font-mono text-sm">
          <span className="text-accent">❯</span>
          <span className="text-muted">git checkout</span>
          <div role="tablist" aria-label="Filter projects by category" className="flex flex-wrap gap-1">
            {branches.map((b) => {
              const active = filter === b;
              return (
                <button
                  key={b}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onFilter(b)}
                  className={cn("relative rounded-[2px] px-3 py-1.5 transition-colors duration-300", active ? "text-bg" : "text-muted hover:text-text")}
                >
                  {active && (
                    <motion.span layoutId="branch-pill" className="absolute inset-0 rounded-[2px] bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  )}
                  <span className="relative">{b === "all" ? "all" : slugify(b)}</span>
                </button>
              );
            })}
          </div>
          <span className="ml-auto text-xs text-faint">
            Switched to branch &apos;{filter === "all" ? "all" : slugify(filter)}&apos; · {list.length} project{list.length === 1 ? "" : "s"}
          </span>
        </div>
        <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease: ease.outBezier }}
              >
                <ProjectCard project={p} snippetHtml={snippets[p.slug]} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
