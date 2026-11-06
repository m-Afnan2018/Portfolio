import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile } from "@/data/profile";
import { ldJson, rootGraph } from "@/lib/seo";
import { themeScript } from "@/lib/themeScript";
import { personaScript } from "@/lib/persona";
import "@/styles/globals.css";

// next/font self-hosts these at build time — no runtime request to Google.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const description = `${profile.name} — ${profile.title}. ${profile.oneLiner} Next.js, Node.js, MongoDB, Docker, Nginx, AWS and CI/CD.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} — Full Stack Developer & DevOps Engineer`,
    template: `%s · ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} — portfolio`,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  classification: "Personal portfolio — software development",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Mohammad Afnan",
    "Afnan",
    "m-Afnan2018",
    "Full Stack Developer",
    "DevOps Engineer",
    "Full Stack Developer India",
    "Next.js developer India",
    "MERN stack developer",
    "React developer",
    "Node.js developer",
    "MongoDB",
    "TypeScript",
    "Docker",
    "Nginx",
    "AWS",
    "CI/CD",
    "GitHub Actions",
    "Shopify developer",
    "WordPress developer",
    "freelance web developer India",
    "hire full stack developer",
    "developer portfolio",
  ],
  alternates: {
    canonical: "/",
    languages: { "en-IN": "/", "x-default": "/" },
  },
  openGraph: {
    type: "profile",
    url: "/",
    title: `${profile.name} — ${profile.shortTitle}`,
    description,
    siteName: `${profile.name} — portfolio`,
    locale: "en_IN",
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.links.githubUser,
    emails: [profile.email],
    phoneNumbers: [profile.phone],
    countryName: "India",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.shortTitle}`,
    description,
    site: profile.links.twitterHandle,
    creator: profile.links.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { capable: true, title: profile.lastName, statusBarStyle: "black-translucent" },
  // paste the codes from Google Search Console / Bing Webmaster Tools / Yandex
  // into these env vars (Vercel + Netlify) — nothing renders while they're empty
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05070D" },
    { media: "(prefers-color-scheme: light)", color: "#F1ECE1" },
  ],
  colorScheme: "dark light",
};

/**
 * Before first paint: theme, persona routing on "/" (returning recruiter /
 * client → their version, first-timers → .js-ask so the "who are you?" gate
 * shows), and whether the boot loader runs this session.
 */
const bootScript = `${themeScript}${personaScript}(function(){try{var d=document.documentElement;var m=localStorage.getItem('motion');var r=m==='reduce'||(m!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches);if(d.classList.contains('js-away'))return;if(!sessionStorage.getItem('booted')&&!r&&!location.hash){d.classList.add('js-boot')}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ldJson(rootGraph()) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
