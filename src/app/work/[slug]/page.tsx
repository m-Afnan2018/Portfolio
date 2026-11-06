import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { highlight } from "@/lib/highlight";
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
  return {
    title: `${p.title} — case study`,
    description: `${p.tagline} ${p.description}`,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${p.slug}`,
      title: `${p.title} — ${profile.name}`,
      description: p.tagline,
      images: [{ url: p.image }],
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
    <CaseStudy
      key={project.slug}
      project={project}
      next={next}
      index={index}
      total={projects.length}
      codeHtml={codeHtml}
    />
  );
}
