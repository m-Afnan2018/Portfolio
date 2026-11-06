/**
 * profile.ts — every piece of personal copy lives here (and in the sibling
 * data files). Components never hard-code content.
 */

export const profile = {
  name: "Mohammad Afnan",
  firstName: "Mohammad",
  lastName: "Afnan",
  handle: "afnan",
  title: "Senior Full Stack Developer · DevOps Engineer",
  shortTitle: "Full Stack · DevOps",
  location: "India",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST",
  coordinates: "20.59°N 78.96°E",
  email: "m.afnan2018@gmail.com",
  phone: "+91 7235893701",
  oneLiner: "I build full-stack products and the infrastructure they run on.",
  roles: [
    "Full Stack Developer",
    "DevOps Engineer",
    "Next.js · Node.js · MongoDB",
    "I ship to production.",
  ],
  summary:
    "MERN + TypeScript developer who grew into DevOps. I build production Next.js / Node.js / MongoDB applications with auth, role-based access and payment integrations, and I run the servers behind them: Docker Compose, Nginx, Certbot, and GitHub Actions CI/CD across AWS EC2/Lightsail and VPS hosting.",
  summaryExtra:
    "Today I manage 20+ live client websites end to end, from server admin down to frontend components, and also ship Shopify themes, WordPress sites and AI-assisted development workflows.",
  availability: "Available for work",
  // TODO: keep this line fresh — it shows in the footer & status bar
  currentlyBuilding: "this portfolio, v2 — particles, shaders & CI",
  resume: "/Mohammad_Afnan_Resume.pdf",
  links: {
    github: "https://github.com/m-Afnan2018",
    githubUser: "m-Afnan2018",
    linkedin: "https://www.linkedin.com/in/mafnan2018",
    twitter: "https://x.com/m_Afnan2018",
    instagram: "https://www.instagram.com/m.afnan2018",
    twitterHandle: "@m_Afnan2018",
    source: "https://github.com/m-Afnan2018/Portfolio",
  },
  /**
   * Canonical URL — every canonical tag, OG/Twitter URL, sitemap entry and
   * JSON-LD id is built from this. Netlify serves the same build as a mirror,
   * so its pages point search engines back here (no duplicate content).
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mafnan2018.vercel.app",
  mirrors: ["https://mafnan2018.netlify.app"],
  /** public coding profiles — linked from achievements and listed in JSON-LD sameAs */
  codingProfiles: [
    "https://leetcode.com/u/m_afnan2018",
    "https://www.geeksforgeeks.org/user/mafnan2018/",
    "https://codeforces.com/profile/m.afnan2018",
    "https://www.codechef.com/users/m_afnan2018",
  ],
  version: "v2.0.0",
  changelog: [
    { version: "v2.0.0", note: "rebuilt with Next.js 16, R3F & a particle Core" },
    { version: "v1.0.0", note: "first deploy on Netlify" },
  ],
  education: [
    {
      degree: "BCA",
      school: "University of Allahabad",
      period: "2021 – 2024",
      start: "2021-07",
    },
    {
      degree: "ISC (Math + Computer)",
      school: "Bishop Johnson School and College",
      period: "2019 – 2021",
      start: "2019-04",
    },
  ],
} as const;

export type Profile = typeof profile;

export interface Achievement {
  label: string;
  value: number;
  suffix: string;
  /** 0–1 fill for the terminal progress bar */
  fill: number;
  detail: string;
  /** public profiles that back the number up */
  proof?: { label: string; href: string }[];
}

export const achievements: Achievement[] = [
  {
    label: "DSA problems solved",
    value: 1000,
    suffix: "+",
    fill: 1,
    detail: "LeetCode 500+ · GeeksforGeeks 500+",
    proof: [
      { label: "LeetCode", href: "https://leetcode.com/u/m_afnan2018" },
      { label: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/user/mafnan2018/" },
    ],
  },
  {
    label: "Codeforces max rating",
    value: 1364,
    suffix: "",
    fill: 0.68,
    detail: "rated contests · CodeChef 3★",
    proof: [
      { label: "Codeforces", href: "https://codeforces.com/profile/m.afnan2018" },
      { label: "CodeChef", href: "https://www.codechef.com/users/m_afnan2018" },
    ],
  },
  {
    label: "client sites in production",
    value: 20,
    suffix: "+",
    fill: 0.9,
    detail: "Docker · Nginx · Certbot · CI/CD",
  },
  {
    label: "load-time reduction",
    value: 35,
    suffix: "%",
    fill: 0.35,
    detail: "Next.js + Node + Mongo tuning at Ganesyx",
  },
];

export const openSource = {
  project: "Kontest",
  description:
    "Contributed API updates to Kontest, a Chrome extension for programming-contest reminders.",
};

export const techMarquee = [
  "NEXT.JS",
  "NODE.JS",
  "MONGODB",
  "DOCKER",
  "NGINX",
  "AWS",
  "TYPESCRIPT",
  "GITHUB ACTIONS",
  "REACT",
  "SHOPIFY",
  "N8N",
  "LINUX",
];
