/**
 * /work-with-me — the client page.
 *
 * CONCEPT — "watch a website get built". The page is the proof: a dark hero
 * promises the outcome, the services read like an index you can open, and
 * the centrepiece pins while a browser window assembles a real site through
 * the five process steps — brief, wireframe, build, launch, care. Then the
 * results stack up, the offer is simple, and a blue call-to-action asks
 * for one thing: tell me about your project.
 *
 * Markup is server-rendered and fully readable without JS; ClientMotion and
 * the interactive pieces layer the motion on top. All copy: src/data/clients.ts.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/profile";
import { clientsGraph, ldJson } from "@/lib/seo";
import { BrandMark } from "@/components/brand/BrandMark";
import { ClientMotion } from "@/components/clients/ClientMotion";
import { ClientHero } from "@/components/clients/ClientHero";
import { ServicesIndex } from "@/components/clients/ServicesIndex";
import { ServiceRibbons } from "@/components/clients/ServiceRibbons";
import { WhySection } from "@/components/clients/WhySection";
import { WorkSection } from "@/components/clients/WorkSection";
import { PricingSection } from "@/components/clients/PricingSection";
import { CtaSection } from "@/components/clients/CtaSection";
import { ClosingFooter } from "@/components/clients/ClosingFooter";
import { BuildSequence } from "@/components/clients/BuildSequence";
import { Faq } from "@/components/clients/Faq";
import { InquirySection } from "@/components/clients/InquirySection";
import { ClientVersionSwitch } from "@/components/clients/ClientVersionSwitch";

const clientsDescription = `Hire ${profile.name} to build your web app, online store or business website — and keep it fast, secure and online.`;

export const metadata: Metadata = {
  title: "Work with me",
  description: clientsDescription,
  keywords: [
    "hire web developer India",
    "freelance web developer",
    "website development packages",
    "business website design",
    "e-commerce website developer",
    "Shopify developer",
    "WordPress developer",
    "Next.js developer",
    "website maintenance",
    profile.name,
  ],
  alternates: { canonical: "/work-with-me" },
  openGraph: {
    type: "website",
    url: "/work-with-me",
    title: `Work with ${profile.name} — websites, stores & web apps`,
    description: clientsDescription,
    siteName: `${profile.name} — portfolio`,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `Work with ${profile.name} — websites, stores & web apps`,
    description: clientsDescription,
    site: profile.links.twitterHandle,
    creator: profile.links.twitterHandle,
  },
};

function Heading({
  eyebrow,
  title,
  id,
  intro,
  className,
}: {
  eyebrow: string;
  title: string;
  id: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p data-reveal className="cl-eyebrow">
        {eyebrow}
      </p>
      <h2
        id={id}
        data-split
        className="cl-display mt-4 text-[clamp(2.4rem,6vw,5.4rem)] leading-[0.95]"
      >
        {title}
      </h2>
      {intro && (
        <p data-reveal className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--cl-muted)]">
          {intro}
        </p>
      )}
    </div>
  );
}

export default function WorkWithMePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(clientsGraph()) }}
      />
      <ClientMotion />
      <a
        href="#cl-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-[var(--cl-ink)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* ── header ── */}
      <header className="cl-header fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link
            href="/work-with-me"
            className="group flex min-w-0 items-center gap-2.5"
            data-cursor="Top"
          >
            <BrandMark size={36} draw />
            <span className="hidden truncate text-[15px] font-semibold min-[400px]:inline">
              {profile.name}
            </span>
          </Link>
          <nav
            aria-label="Page sections"
            className="hidden items-center gap-8 text-sm font-medium md:flex"
          >
            {[
              ["#services", "Services"],
              ["#process", "Process"],
              ["#work", "Work"],
              ["#pricing", "Pricing"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="cl-nav-link">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ClientVersionSwitch />
            <a href="#inquiry" className="cl-btn cl-btn-primary !h-11 shrink-0 !px-5 text-sm">
              Get a quote
            </a>
          </div>
        </div>
      </header>

      <main id="cl-main">
        <ClientHero />

        <ServiceRibbons />

        {/* ── services ── */}
        <section
          id="services"
          aria-labelledby="cl-services"
          className="scroll-mt-16 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <div className="mb-14 grid gap-8 lg:grid-cols-12 lg:items-end">
              <Heading
                eyebrow="Services"
                id="cl-services"
                title="What I can build for you."
                className="lg:col-span-7"
              />
              <p
                data-reveal
                className="text-[17px] leading-relaxed text-[var(--cl-muted)] lg:col-span-4 lg:col-start-9"
              >
                Pick one, or combine them — most clients start with a site and keep me on for
                hosting and care. Scroll through: each one plays out live.
              </p>
            </div>
            <ServicesIndex />
          </div>
        </section>

        <WhySection />

        <BuildSequence />

        <WorkSection />

        <PricingSection />

        <Faq />

        <CtaSection />

        <InquirySection />
      </main>

      <ClosingFooter />
    </>
  );
}
