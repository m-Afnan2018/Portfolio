/**
 * hr.ts — copy for the recruiter brief at /hr. Everything factual (jobs,
 * skills, projects, education, numbers) is pulled from the sibling data
 * files; this file only holds the HR-specific framing.
 */

export const hr = {
  headline: "Full-stack developer who also runs the servers.",
  headlineAccent: "runs the servers.",
  intro:
    "I build production web apps with Next.js, Node.js and MongoDB, and I own the infrastructure they run on: Docker, Nginx, SSL and CI/CD on AWS and VPS hosting. One hire covers the product and the deployment.",

  /** the three things a hiring manager should remember */
  strengths: [
    {
      title: "Ships full-stack products",
      body: "From database schema to UI, with the parts that make apps production-ready.",
      points: ["Auth & role-based access", "Payment integrations", "35% faster load times at Ganesyx"],
    },
    {
      title: "Owns the infrastructure",
      body: "Sets up, deploys and maintains the servers rather than handing off to ops.",
      points: ["20+ live client sites managed", "Docker, Nginx, Certbot, GitHub Actions", "AWS EC2 / Lightsail & VPS"],
    },
    {
      title: "Strong fundamentals, client-ready",
      body: "Competitive-programming background and direct client experience.",
      points: ["1,000+ DSA problems solved", "Codeforces max rating 1364", "Scopes requirements with clients"],
    },
  ],

  /** roles this profile fits — shown as tags */
  roleFit: ["Full Stack Developer", "MERN / Next.js Developer", "DevOps Engineer", "Backend Developer (Node.js)"],

  /** hiring logistics — TODO: confirm these match your situation */
  logistics: [
    { label: "Availability", value: "Open to new opportunities" },
    { label: "Work mode", value: "On-site · Hybrid · Remote" }, // TODO: confirm preference
    { label: "Location", value: "India" },
    { label: "Time zone", value: "IST (UTC +5:30)" },
    { label: "Notice period", value: "Shared on request" }, // TODO: e.g. "30 days"
  ],

  contactLead: "The fastest way to reach me is email — I usually reply within a day.",
} as const;

/** skills used day-to-day — rendered as solid chips */
export const coreSkills = ["typescript", "react", "next", "node", "express", "mongodb", "docker", "nginx", "github-actions", "aws", "linux"];

/** recruiter-friendly names for the package-style ids in skills.ts */
export const skillDisplayName: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  "c/c++": "C / C++",
  "html/css": "HTML & CSS",
  react: "React",
  next: "Next.js",
  tailwindcss: "Tailwind CSS",
  "shopify-liquid": "Shopify Liquid",
  node: "Node.js",
  express: "Express",
  django: "Django",
  "auth-rbac": "Auth & RBAC (JWT)",
  payments: "Payment gateways",
  mongodb: "MongoDB",
  mysql: "MySQL",
  docker: "Docker",
  "docker-compose": "Docker Compose",
  nginx: "Nginx",
  certbot: "Certbot / SSL",
  "github-actions": "GitHub Actions",
  aws: "AWS (EC2, Lightsail)",
  linux: "Linux server admin",
  "shopify-themes": "Shopify themes",
  wordpress: "WordPress",
  n8n: "n8n",
  "ai-workflows": "AI-assisted development",
  git: "Git",
  vscode: "VS Code",
  postman: "Postman",
  gcp: "Google Cloud",
};

export const skillGroupName: Record<string, string> = {
  languages: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  databases: "Databases",
  devops: "DevOps & Cloud",
  cms: "CMS & E-commerce",
  automation: "Automation & AI",
  tools: "Tools",
};
