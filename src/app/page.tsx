/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONCEPT — "a developer's machine at night"
 *
 *  The visitor boots the machine (terminal loader), lands in the editor
 *  (hero), and travels down through the code (about, skills, git log), the
 *  work (projects), the servers (infra) and the numbers, out to the network
 *  (contact). One particle "Core" rides along the whole way, re-forming into
 *  each stop: neural core → laptop → package sphere → git helix → monitors →
 *  server racks → trophy → antenna. Everything — tabs, status bar, minimap,
 *  type, motion — belongs to that one machine.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { Suspense } from "react";
import { AppShell } from "@/components/providers/AppShell";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Infra } from "@/components/sections/Infra";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { GitHubHeatmap, HeatmapSkeleton } from "@/components/sections/GitHubHeatmap";
import { SectionTransition } from "@/components/ui/SectionTransition";
import { Marquee } from "@/components/ui/Marquee";
import { projects } from "@/data/projects";
import { infraFiles } from "@/data/infra";
import { techMarquee } from "@/data/profile";
import { copy } from "@/data/copy";
import { highlight } from "@/lib/highlight";
import { buildAboutCode } from "@/lib/aboutCode";

export default async function Page() {
  // All syntax highlighting happens here, on the server.
  const aboutCode = buildAboutCode();
  const [aboutHtml, filesHtml, snippetEntries] = await Promise.all([
    highlight(aboutCode, "ts"),
    Promise.all(infraFiles.map((f) => highlight(f.code, f.lang))),
    Promise.all(
      projects
        .filter((p) => p.codeSnippet)
        .map(async (p) => [p.slug, await highlight(p.codeSnippet!.code, p.codeSnippet!.lang)] as const),
    ),
  ]);
  const snippets = Object.fromEntries(snippetEntries);

  return (
    <AppShell>
      <Hero />
      <SectionTransition command={copy.transitions.about} seed={1} />
      <About codeHtml={aboutHtml} code={aboutCode} />
      <Marquee
        items={techMarquee}
        className="my-10 border-y border-line font-display text-[clamp(2.5rem,8vw,8rem)] font-bold leading-none tracking-[-0.04em]"
      />
      <Skills />
      <SectionTransition command={copy.transitions.experience} seed={4} />
      <Experience />
      <SectionTransition command={copy.transitions.projects} seed={7} />
      <Projects snippets={snippets} />
      <SectionTransition command={copy.transitions.infra} seed={2} />
      <Infra filesHtml={filesHtml} />
      <SectionTransition command={copy.transitions.achievements} seed={9} />
      <Achievements
        heatmap={
          <Suspense fallback={<HeatmapSkeleton />}>
            <GitHubHeatmap />
          </Suspense>
        }
      />
      <SectionTransition command={copy.transitions.contact} seed={5} />
      <Contact />
      <Footer />
    </AppShell>
  );
}
