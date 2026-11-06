import type { MetadataRoute } from "next";
import { abs, siteUrl } from "@/lib/seo";

/**
 * Everything public is crawlable — search engines and AI assistants alike
 * (being cited by ChatGPT / Perplexity / Claude is the point of a portfolio).
 * The AI crawlers are named explicitly so the intent is unambiguous.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
        ],
        allow: "/",
      },
    ],
    sitemap: abs("/sitemap.xml"),
    host: siteUrl,
  };
}
