import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { abs } from "@/lib/seo";

/** bump when the site's content changes meaningfully */
const LAST_UPDATED = "2026-11-06";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: abs("/"),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
      images: [abs("/opengraph-image")],
    },
    {
      url: abs("/work-with-me"),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [abs("/work-with-me/opengraph-image")],
    },
    {
      url: abs("/hr"),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [abs("/hr/opengraph-image")],
    },
    ...projects
      .filter((p) => !p.placeholder)
      .map((p) => ({
        url: abs(`/work/${p.slug}`),
        lastModified: LAST_UPDATED,
        changeFrequency: "yearly" as const,
        priority: 0.7,
        images: [p.image, ...(p.gallery ?? [])].map(abs),
      })),
    {
      url: abs("/llms.txt"),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
