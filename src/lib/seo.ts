/**
 * seo.ts — structured data (schema.org JSON-LD) built from the data files, so
 * search engines and AI assistants read the same facts the pages show.
 *
 * Every node has a stable @id, so the per-page graphs (case studies, the
 * client page, the recruiter brief) point back at the Person and WebSite
 * defined in the root layout instead of repeating them.
 */
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { skillDisplayName } from "@/data/hr";
import type { Project } from "@/data/projects";
import { clientsPage, services, packages, faqs } from "@/data/clients";

export const siteUrl = profile.siteUrl.replace(/\/$/, "");
export const abs = (path = "/") => (path.startsWith("http") ? path : `${siteUrl}${path}`);

export const ids = {
  person: `${siteUrl}/#person`,
  website: `${siteUrl}/#website`,
  profilePage: `${siteUrl}/#profilepage`,
  service: `${siteUrl}/work-with-me#service`,
};

/** every public profile — Person.sameAs (the current host itself is left out) */
export const sameAs = [
  profile.links.github,
  profile.links.linkedin,
  profile.links.twitter,
  profile.links.instagram,
  ...profile.mirrors,
  ...profile.codingProfiles,
].filter((l) => !l.includes("TODO") && !l.startsWith(siteUrl));

export const knowsAbout = Array.from(
  new Set([
    "Full Stack Development",
    "DevOps",
    ...skillGroups.flatMap((g) => g.skills.map((s) => skillDisplayName[s.name] ?? s.name)),
  ]),
);

export function personNode() {
  return {
    "@type": "Person",
    "@id": ids.person,
    name: profile.name,
    givenName: profile.firstName,
    familyName: profile.lastName,
    alternateName: [profile.links.githubUser, `@${profile.links.githubUser}`],
    url: siteUrl,
    image: abs("/opengraph-image"),
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    jobTitle: profile.title,
    description: profile.summary,
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    nationality: { "@type": "Country", name: "India" },
    worksFor: { "@type": "Organization", name: experience[0].company },
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer",
      occupationLocation: { "@type": "Country", name: "India" },
      skills: knowsAbout.join(", "),
    },
    alumniOf: profile.education.map((e) => ({
      "@type": "EducationalOrganization",
      name: e.school,
    })),
    knowsAbout,
    sameAs,
  };
}

/** the site-wide graph, rendered once in the root layout */
export function rootGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: siteUrl,
        name: `${profile.name} — portfolio`,
        alternateName: profile.name,
        description: profile.oneLiner,
        inLanguage: "en-IN",
        author: { "@id": ids.person },
        publisher: { "@id": ids.person },
        copyrightHolder: { "@id": ids.person },
      },
      {
        "@type": "ProfilePage",
        "@id": ids.profilePage,
        url: siteUrl,
        name: `${profile.name} — ${profile.shortTitle}`,
        isPartOf: { "@id": ids.website },
        mainEntity: { "@id": ids.person },
        about: { "@id": ids.person },
        inLanguage: "en-IN",
        primaryImageOfPage: abs("/opengraph-image"),
      },
    ],
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** /work/<slug> — the project as a CreativeWork + its breadcrumb trail */
export function projectGraph(p: Project) {
  const url = abs(`/work/${p.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name: p.title,
        headline: `${p.title} — ${p.tagline}`,
        abstract: p.tagline,
        description: p.description,
        image: [abs(p.image), ...(p.gallery ?? []).map(abs)],
        thumbnailUrl: abs(p.image),
        dateCreated: String(p.year).slice(0, 4),
        creator: { "@id": ids.person },
        author: { "@id": ids.person },
        keywords: [...p.stack, ...p.category].join(", "),
        genre: p.category.join(", "),
        inLanguage: "en-IN",
        isPartOf: { "@id": ids.website },
        ...(p.liveUrl && { sameAs: p.liveUrl }),
        ...(p.repoUrl && { isBasedOn: p.repoUrl }),
      },
      breadcrumbs([{ name: p.title, path: `/work/${p.slug}` }]),
    ],
  };
}

/** /work-with-me — the freelance offer: services, priced packages and the FAQ */
export function clientsGraph() {
  const url = abs("/work-with-me");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ids.service,
        name: `${profile.name} — web development`,
        url,
        description: clientsPage.intro,
        image: abs("/work-with-me/opengraph-image"),
        email: profile.email,
        telephone: profile.phone,
        founder: { "@id": ids.person },
        provider: { "@id": ids.person },
        address: { "@type": "PostalAddress", addressCountry: "IN" },
        areaServed: { "@type": "Place", name: "Worldwide" },
        priceRange: `₹${Math.min(...packages.map((x) => x.price)).toLocaleString("en-IN")}+`,
        currenciesAccepted: "INR",
        knowsAbout,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Website packages",
          itemListElement: packages.map((pk) => ({
            "@type": "Offer",
            name: `${pk.name} website package`,
            description: `${pk.blurb} Up to ${pk.pages} pages, ${pk.delivery}, ${pk.support} support.`,
            price: pk.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${url}#pricing`,
            seller: { "@id": ids.person },
          })),
        },
        makesOffer: services.map((sv) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: sv.title,
            description: sv.summary,
            serviceType: sv.title,
            provider: { "@id": ids.person },
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      breadcrumbs([{ name: "Work with me", path: "/work-with-me" }]),
    ],
  };
}

/** /hr — the recruiter brief is a profile page about the same Person */
export function hrGraph() {
  const url = abs("/hr");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url}#profilepage`,
        url,
        name: `${profile.name} — Recruiter brief`,
        description: `${profile.title}. Experience, skills, projects and availability at a glance.`,
        isPartOf: { "@id": ids.website },
        mainEntity: { "@id": ids.person },
        primaryImageOfPage: abs("/hr/opengraph-image"),
        inLanguage: "en-IN",
      },
      breadcrumbs([{ name: "Recruiter brief", path: "/hr" }]),
    ],
  };
}

/** JSON for a <script type="application/ld+json"> — `<` escaped so content can't close the tag */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
