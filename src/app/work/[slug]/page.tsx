import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { highlight } from "@/lib/highlight";
import { ldJson, projectGraph } from "@/lib/seo";
import { CaseStudy } from "@/components/case/CaseStudy";

/** /work/<slug> — one case study per project, all prerendered. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const description = `${p.tagline} ${p.description}`;
  return {
    title: `${p.title} — case study`,
    description,
    keywords: [p.title, ...p.stack, ...p.category, profile.name, "case study", "portfolio project"],
    authors: [{ name: profile.name, url: profile.siteUrl }],
    alternates: { canonical: `/work/${p.slug}` },
    // TODO placeholders stay out of search results until they're real projects
    ...(p.placeholder && { robots: { index: false, follow: true } }),
    // images come from ./opengraph-image.tsx and ./twitter-image.tsx
    openGraph: {
      type: "article",
      url: `/work/${p.slug}`,
      title: `${p.title} — ${profile.name}`,
      description: p.tagline,
      siteName: `${profile.name} — portfolio`,
      locale: "en_IN",
      authors: [profile.siteUrl],
      section: p.category[0],
      tags: p.stack,
      publishedTime: `${String(p.year).slice(0, 4)}-01-01`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} — ${profile.name}`,
      description: p.tagline,
      site: profile.links.twitterHandle,
      creator: profile.links.twitterHandle,
    },
  };
}

/**
 * The URL-independent shell (an empty dark page — the transition veil sits on
 * top of it anyway) renders instantly; the case study streams in behind it.
 */
export default function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="bg-bg min-h-screen" />}>
      <Case params={params} />
    </Suspense>
  );
}

async function Case({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const codeHtml = project.codeSnippet
    ? await highlight(project.codeSnippet.code, project.codeSnippet.lang)
    : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(projectGraph(project)) }}
      />
      <CaseStudy
        key={project.slug}
        project={project}
        next={next}
        index={index}
        total={projects.length}
        codeHtml={codeHtml}
      />
    </>
  );
}
