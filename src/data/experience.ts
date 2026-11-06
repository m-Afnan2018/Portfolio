export interface Job {
  company: string;
  role: string;
  period: string;
  start: string; // YYYY-MM
  mode: "On-site" | "Remote" | "Hybrid";
  branch: string;
  tag?: string;
  hash: string;
  current?: boolean;
  bullets: string[];
}

export const experience: Job[] = [
  {
    company: "Ganesyx",
    role: "Full Stack Developer / DevOps",
    period: "Sept 2025 – Present",
    start: "2025-09",
    mode: "On-site",
    branch: "main",
    tag: "HEAD -> main",
    hash: "a3f9c21",
    current: true,
    bullets: [
      "Build and maintain scalable full-stack applications across frontend, backend and database.",
      "Cut platform load time by 35% with Next.js, Node.js and MongoDB optimisation.",
      "Implemented authentication, role-based access and payment integrations for production systems.",
      "Own CI/CD pipelines, Git workflows and code reviews; manage Docker/Nginx infrastructure for 20+ client sites.",
    ],
  },
  {
    company: "Namaste Tech Solutions",
    role: "Full Stack Developer",
    period: "Aug 2024 – Sept 2025",
    start: "2024-08",
    mode: "Remote",
    branch: "feature/client-work",
    tag: "v1.0",
    hash: "7be04d8",
    bullets: [
      "Delivered real-world projects for diverse clients in a startup environment.",
      "Worked directly with clients to scope requirements and deliver tailored solutions.",
      "Built full-stack web apps with React, Node.js and MongoDB, with testing and documentation.",
    ],
  },
];
