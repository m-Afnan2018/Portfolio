import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

/** Web app manifest — install prompt, splash colours and home-screen icons. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${profile.name} — ${profile.shortTitle}`,
    short_name: profile.lastName,
    description: `${profile.title}. ${profile.oneLiner}`,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#05070D",
    theme_color: "#05070D",
    lang: "en-IN",
    dir: "ltr",
    categories: ["portfolio", "developer", "technology", "business"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Work with me",
        short_name: "Hire",
        url: "/work-with-me",
        description: "Packages, pricing and enquiries",
      },
      {
        name: "Recruiter brief",
        short_name: "Brief",
        url: "/hr",
        description: "Experience and skills at a glance",
      },
    ],
  };
}
