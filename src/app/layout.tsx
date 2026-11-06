import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
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
  keywords: [
    "Mohammad Afnan",
    "Full Stack Developer",
    "DevOps Engineer",
    "Next.js developer India",
    "MERN developer",
    "Node.js",
    "MongoDB",
    "Docker",
    "Nginx",
    "AWS",
    "GitHub Actions",
    "Shopify developer",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: `${profile.name} — ${profile.shortTitle}`,
    description,
    siteName: profile.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.shortTitle}`,
    description,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  jobTitle: profile.title,
  worksFor: { "@type": "Organization", name: experience[0].company },
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  alumniOf: profile.education.map((e) => ({ "@type": "EducationalOrganization", name: e.school })),
  knowsAbout: [
    "Next.js",
    "React",
    "Node.js",
    "MongoDB",
    "TypeScript",
    "Docker",
    "Nginx",
    "AWS",
    "CI/CD",
    "Shopify",
  ],
  sameAs: [
    profile.links.github,
    profile.links.linkedin,
    profile.links.twitter,
    profile.links.instagram,
    profile.links.oldPortfolio,
  ].filter((l) => !l.includes("TODO")),
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
