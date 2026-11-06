/**
 * clients.ts — copy for the client page at /work-with-me.
 *
 * Written for business owners, not developers: outcomes first, tech second.
 * Nothing here is invented proof — case studies and testimonials marked
 * `placeholder: true` are drafts for you to replace (case studies show a TODO
 * badge; placeholder testimonials are hidden). Prices are optional: leave
 * `price` undefined and the card shows "Custom quote".
 */

export const clientsPage = {
  eyebrow: "Freelance & contract work",
  headline: "I build your website —",
  headlineAccent: "and keep it",
  /** cycles after "and keep it …" in the hero */
  rotatingWords: ["running.", "fast.", "secure.", "growing."],
  intro:
    "Web apps, online stores and business sites, plus the hosting, security and updates behind them. One developer from first call to launch day and beyond, so nothing gets lost between handoffs.",
  availability: "Currently taking new projects",
  /** TODO: add your Calendly / Cal.com link — until then "Book a call" scrolls to the form */
  bookingUrl: "",
  responseTime: "I reply within one working day.",
};

/** headline proof — every number here comes from real work */
export const trustStats = [
  { value: "20+", label: "live client websites I manage today" },
  { value: "35%", label: "faster load times delivered at Ganesyx" },
  { value: "2+ yrs", label: "building production software" },
  { value: "1", label: "point of contact, start to finish" },
];

export interface Service {
  id: string;
  title: string;
  summary: string;
  includes: string[];
  /** typical delivery time — TODO: adjust to how you actually work */
  timeline: string;
  stack: string;
}

export const services: Service[] = [
  {
    id: "apps",
    title: "Web applications",
    summary: "Dashboards, client portals and SaaS products — with login, user roles and online payments built in.",
    includes: ["Secure login & user roles", "Payment gateway integration", "Admin dashboard for your team"],
    timeline: "4–10 weeks",
    stack: "Next.js · Node.js · MongoDB",
  },
  {
    id: "stores",
    title: "Online stores",
    summary: "Custom Shopify themes and store improvements that look like your brand and load fast.",
    includes: ["Custom Shopify 2.0 theme", "Product & collection page design", "Speed and checkout fixes"],
    timeline: "2–5 weeks",
    stack: "Shopify · Liquid",
  },
  {
    id: "websites",
    title: "Business websites",
    summary: "Fast, mobile-friendly sites your team can update without calling a developer.",
    includes: ["Easy editing for your team", "Mobile-first, SEO-ready pages", "Contact forms & analytics"],
    timeline: "1–3 weeks",
    stack: "WordPress · Next.js",
  },
  {
    id: "hosting",
    title: "Hosting & deployment",
    summary: "I set up and run your server so your site stays fast, secure and online.",
    includes: ["AWS or VPS server setup", "Free SSL that renews itself", "One-click, automatic deploys"],
    timeline: "About 1 week",
    stack: "Docker · Nginx · AWS",
  },
  {
    id: "automation",
    title: "Automation & AI",
    summary: "Workflows that connect your tools and take repetitive work off your team's plate.",
    includes: ["Connect CRM, sheets & email", "Scheduled reports and alerts", "AI-assisted content & support flows"],
    timeline: "1–3 weeks",
    stack: "n8n · AI tools",
  },
  {
    id: "care",
    title: "Care & maintenance",
    summary: "A monthly plan so updates, backups and small changes are simply handled.",
    includes: ["Security & software updates", "Backups and uptime checks", "Small content changes each month"],
    timeline: "Monthly",
    stack: "Any stack I build or inherit",
  },
];

/** why a business should pick a freelancer like you */
export const reasons = [
  { title: "One person, whole project", body: "Design, code and server under one roof — no finger-pointing between agencies." },
  { title: "You own everything", body: "Code, domain and hosting accounts stay in your name. Full handover, no lock-in." },
  { title: "Proven in production", body: "I run 20+ live client sites today, so launch day is routine, not a gamble." },
  { title: "You always know where it stands", body: "A live preview link from week one and a short progress update every week." },
];

/**
 * "Why" comparison — a typical agency path vs working with you directly.
 * Illustrative, not a claim about any particular agency; adjust freely.
 */
export const agencyVsMe = {
  agency: {
    label: "The usual agency way",
    hops: ["Account manager", "Designer", "Dev team", "Hosting company", "Support desk"],
    stats: [
      { value: 5, suffix: "", label: "people to brief" },
      { value: 3, suffix: "", label: "invoices" },
      { value: 9, suffix: " days", label: "for a small change" },
    ],
  },
  me: {
    label: "Working with me",
    stats: [
      { value: 1, suffix: "", label: "person who does it all" },
      { value: 1, suffix: "", label: "invoice" },
      { value: 0, suffix: "", display: "Same day", label: "for a small change" },
    ],
  },
};

/** TODO: confirm these steps match how you work */
export const process = [
  { title: "Free intro call", body: "20 minutes to understand your goals, audience and deadline. No obligation." },
  { title: "Clear proposal", body: "Fixed scope, timeline and quote in writing — usually within two working days." },
  { title: "Design & build", body: "You watch it come together on a live preview link, with weekly check-ins." },
  { title: "Launch", body: "I deploy, connect your domain, set up SSL and analytics, and walk you through it." },
  { title: "Support", body: "A free fix window after launch, then an optional care plan if you want one." },
];

export interface CaseStudy {
  client: string;
  industry: string;
  title: string;
  problem: string;
  solution: string;
  result: string;
  services: string[];
  /** the headline number on the card — counts up as the card arrives */
  metric: { value: number; suffix: string; label: string };
  /** which live illustration the card plays */
  visual: "speed" | "deploy" | "payments";
  liveUrl?: string;
  /** drafts render with a TODO badge — replace with real, approved client work */
  placeholder?: boolean;
}

/**
 * Drawn only from work listed in experience.ts (Ganesyx). No client names or
 * numbers beyond what's there — add specifics (and liveUrl) once a client
 * agrees to be named.
 */
export const caseStudies: CaseStudy[] = [
  {
    client: "Ganesyx",
    industry: "Production platform · performance",
    title: "Made a live platform 35% faster to load",
    problem: "A production web platform was loading slower than it should — and slow pages quietly lose visitors.",
    solution: "Profiled the Next.js front end, the Node.js API and the MongoDB queries behind it, then optimised each layer.",
    result: "35% faster load time across the platform.",
    services: ["Web applications", "Performance"],
    metric: { value: 35, suffix: "%", label: "faster load time" },
    visual: "speed",
  },
  {
    client: "Ganesyx",
    industry: "Infrastructure · hosting",
    title: "One secure, auto-deploying home for 20+ client sites",
    problem: "Many client websites need to stay fast, secure and updated without someone babysitting each server.",
    solution: "Run Docker + Nginx infrastructure with CI/CD pipelines, so every update ships through the same reviewed, automatic path.",
    result: "20+ client sites managed on one consistent, automated setup.",
    services: ["Hosting & deployment", "Care & maintenance"],
    metric: { value: 20, suffix: "+", label: "client sites managed" },
    visual: "deploy",
  },
  {
    client: "Ganesyx",
    industry: "Production systems · accounts & payments",
    title: "Logins, user roles and online payments — shipped to production",
    problem: "Production apps needed secure sign-in, different access for different people, and a way to take payments.",
    solution: "Implemented authentication, role-based access control and payment-gateway integrations end to end.",
    result: "Secure accounts, per-role access and online payments running in production.",
    services: ["Web applications"],
    metric: { value: 3, suffix: "", label: "core flows: sign-in, roles, payments" },
    visual: "payments",
  },
];

/** placeholder testimonials are never rendered — the section appears once a real one exists */
export const testimonials: { quote: string; name: string; role: string; placeholder?: boolean }[] = [
  {
    quote: "TODO: a short quote from a happy client or manager.",
    name: "TODO: Name",
    role: "TODO: Role, Company",
    placeholder: true,
  },
];

/**
 * Website packages — from "Website Packages & Pricing" (Oct 2026). One-time
 * development prices in INR; domain, hosting and yearly maintenance are
 * separate (see runningCosts).
 */
export type PackageId = "basic" | "standard" | "premium";

export const packages: {
  id: PackageId;
  name: string;
  price: number;
  pages: number;
  delivery: string;
  /** midpoint of the delivery range, in working days — used by the estimate */
  days: [number, number];
  support: string;
  revisions: number;
  blurb: string;
  points: string[];
  popular?: boolean;
}[] = [
  {
    id: "basic",
    name: "Basic",
    price: 25000,
    pages: 8,
    delivery: "10–15 working days",
    days: [10, 15],
    support: "1 month",
    revisions: 2,
    blurb: "A professional website for a strong online presence. I make any later changes for you.",
    points: [
      "Custom design, fully mobile responsive",
      "Gallery, media & contact form",
      "Basic SEO, sitemap & SSL (https)",
      "WhatsApp & social media buttons",
      "Updates done by me, on request",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 35000,
    pages: 15,
    delivery: "25–30 working days",
    days: [25, 30],
    support: "2 months",
    revisions: 3,
    blurb: "Your team posts news, photos and events themselves — no developer needed.",
    points: [
      "Everything in Basic",
      "Admin panel for gallery, news, events & press",
      "New posts appear on Home automatically",
      "SEO and share buttons on every post",
      "1-hour admin training + user guide",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 65000,
    pages: 25,
    delivery: "45–60 working days",
    days: [45, 60],
    support: "3 months",
    revisions: 4,
    blurb: "A complete CMS with analytics and live features, for a large, active audience.",
    points: [
      "Edit every page — and create new ones yourself",
      "Visitor analytics & live “people online now”",
      "Live stream, updates ticker & push notifications",
      "Unlimited users with roles + two-step login",
      "Premium animations, advanced SEO, daily backups",
    ],
  },
];

/** the "at a glance" comparison — true / false render as ✓ / —, strings as text */
export const packageCompare: { feature: string; values: [string | boolean, string | boolean, string | boolean] }[] = [
  { feature: "Pages", values: ["8", "12–15 (15 included)", "20+ (25 included)"] },
  { feature: "Custom design, mobile responsive", values: [true, true, "✓ + premium animations"] },
  { feature: "Contact / enquiry form", values: [true, true, "✓ + custom form builder"] },
  { feature: "Social media links and feeds", values: [true, true, true] },
  { feature: "SEO", values: ["Basic", "Basic + per-post", "Advanced + schema markup"] },
  { feature: "Content management", values: ["Updates done by me", "Admin panel: gallery, news, events, press", "Complete CMS: every page, section, menu"] },
  { feature: "Create new pages yourself", values: [false, false, true] },
  { feature: "Visitor analytics dashboard", values: [false, false, true] },
  { feature: "Live “people online now”", values: [false, false, true] },
  { feature: "Live stream, ticker & push notifications", values: [false, false, true] },
  { feature: "Newsletter & engagement modules", values: [false, false, true] },
  { feature: "Admin users and roles", values: ["—", "1 admin", "Unlimited, role-based"] },
  { feature: "Free support after launch", values: ["1 month", "2 months", "3 months"] },
  { feature: "Delivery time", values: ["10–15 working days", "25–30 working days", "45–60 working days"] },
  { feature: "Design revision rounds", values: ["2", "3", "4"] },
];

/** one-time add-ons; `inPremium` ones are already part of the Premium package */
export const addOns: { id: string; name: string; price: number; unit?: string; inPremium?: boolean }[] = [
  { id: "bilingual", name: "Two languages (e.g. Hindi + English)", price: 12000 },
  { id: "page", name: "Extra page beyond the package", price: 2000, unit: "per page", inPremium: true },
  { id: "blog", name: "Blog / articles section", price: 4000, inPremium: true },
  { id: "tickets", name: "Complaint / ticket system with tracking", price: 6000, inPremium: true },
  { id: "testimonials", name: "Testimonials section", price: 2500, inPremium: true },
  { id: "mediakit", name: "Media kit / downloads page", price: 2500, inPremium: true },
  { id: "a11y", name: "Accessibility: dark mode & large font", price: 3000, inPremium: true },
  { id: "whatsapp", name: "WhatsApp channel integration", price: 1500, inPremium: true },
  { id: "content", name: "Content writing (about, bio, services)", price: 5000 },
  { id: "logo", name: "Logo design", price: 3000 },
];

export const paymentSchedule = [
  { pct: 50, label: "Advance to start" },
  { pct: 30, label: "After design approval" },
  { pct: 20, label: "Before going live" },
];

/** yearly running costs, paid separately (approximate) */
export const runningCosts: Record<PackageId, { domain: string; hosting: number; maintenance: number }> = {
  basic: { domain: "₹800–1,200", hosting: 4000, maintenance: 5000 },
  standard: { domain: "₹800–1,200", hosting: 6000, maintenance: 7000 },
  premium: { domain: "₹800–1,200", hosting: 10000, maintenance: 12000 },
};

/** TODO: review the answers, especially payments and support */
export const faqs = [
  {
    q: "Will I own the website and the code?",
    a: "Yes. The code, domain and hosting accounts are yours. At the end of the project you get full access and a handover walkthrough — no lock-in.",
  },
  {
    q: "Can you work on my existing website?",
    a: "Yes — fixes, speed improvements, redesigns, new features, or moving it to better hosting. I'll review it first and tell you honestly what's worth changing.",
  },
  {
    q: "I'm not technical. Is that a problem?",
    a: "Not at all. I explain things in plain language, handle the technical decisions, and show progress on a live link you can open on your phone.",
  },
  {
    q: "Where are you based, and how do we stay in touch?",
    a: "I'm in India (IST). We can use email, calls or video — whatever suits you — and you get a short progress update every week.",
  },
  {
    q: "How do payments work?",
    a: "In three milestones: 50% to start, 30% once you approve the design, and the final 20% before the site goes live. The timeline starts once the advance and your content (logo, photos, text) are in.",
  },
  {
    q: "What happens after launch?",
    a: "Every package includes free support after launch — 1 to 3 months depending on the package. After that you can pick a yearly care plan, book work on demand, or simply take it from there yourself.",
  },
  {
    q: "What do I need to provide?",
    a: "Your logo, good-quality photos and videos, and the text for pages like About and Services — or add logo design and content writing and I'll handle those. If you already own a domain, just its login details.",
  },
  {
    q: "Are domain and hosting included in the price?",
    a: "No — the package price is the one-time build. Domain (about ₹800–1,200 a year) and hosting with SSL (₹4,000–10,000 a year, depending on the package) are paid separately, and I set them up for you.",
  },
];

/** inquiry form options — TODO: adjust the budget ranges / currency to your market */
export const inquiryOptions = {
  projectTypes: [...services.map((s) => s.title), "Not sure yet"],
  budgets: ["Under ₹25,000", "₹25,000 – ₹35,000", "₹35,000 – ₹65,000", "₹65,000+", "Not sure yet"],
  timelines: ["As soon as possible", "Within a month", "1–3 months", "Flexible"],
};

/** decorative UI cards that float around the hero — illustrative, not claims */
/**
 * The hero's live dashboard — an illustration of "your site, running", not a
 * real client's numbers. The feed cycles through these events.
 */
export const heroLive = {
  domain: "yourbusiness.com",
  feed: [
    { kind: "order", title: "New order received", meta: "₹2,499 · paid online" },
    { kind: "lead", title: "New enquiry", meta: "contact form · just now" },
    { kind: "deploy", title: "Update is live", meta: "deployed in 42s · zero downtime" },
    { kind: "ssl", title: "SSL renewed", meta: "secure for another 90 days" },
    { kind: "backup", title: "Nightly backup done", meta: "stored off-site · 2:00 AM" },
  ],
} as const;

/** copy for the "watch a website get built" sequence (illustration only) */
export const buildDemo = {
  brief: { title: "Project brief", items: ["More enquiries from Google", "Looks great on phones", "Easy for my team to update"] },
  domain: "https://yourbusiness.com",
  siteName: "yourbusiness",
  siteHeadline: ["Grow your", "business online"],
  code: [
    "export default function Home() {",
    "  const leads = useEnquiries();",
    "  return (",
    "    <Hero cta=\"Book a visit\" />",
    "    <Services items={leads.top} />",
    "  );",
    "}",
  ],
  status: ["All systems normal", "Backups: daily", "SSL: valid"],
};

/**
 * The "how it works" sequence: one moment per process step — the giant word
 * behind the browser, the day it lands on, and the little scenes that float
 * around it. Illustrative; the day numbers are a typical small-site timeline.
 */
export const buildMoments = [
  { word: "Brief", day: 1, left: "We need more enquiries from Google 🙏", right: "Got it — call at 4pm?" },
  { word: "Proposal", day: 3, left: "Fixed quote · 3 weeks · 2 revisions", right: "Approved ✓" },
  { word: "Build", day: 17, left: "Preview: yourbusiness.vercel.app", right: "Logo a bit bigger?" },
  { word: "Launch", day: 21, left: "First enquiry in 2 hours 🎉", right: "Performance 98" },
  { word: "Care", day: 30, left: "Monthly report sent", right: "Backup done · 2:00 AM" },
];

/** words for the big scrolling band */
export const marqueeWords = ["Web apps", "Online stores", "Business websites", "Hosting", "Automation", "Care plans"];
/** the back tape of the crossing ribbons under the hero — outcomes, not services */
export const ribbonPromises = ["Fast", "Secure", "Mobile-first", "SEO-ready", "Easy to edit", "Always online"];
