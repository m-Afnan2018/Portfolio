import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${profile.siteUrl}/hr`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${profile.siteUrl}/work-with-me`, changeFrequency: "monthly", priority: 0.9 },
    ...projects
      .filter((p) => !p.placeholder)
      .map((p) => ({
        url: `${profile.siteUrl}/work/${p.slug}`,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
  ];
}
