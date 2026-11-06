export interface Skill {
  name: string;
  /** package.json-style "version" — the comfort level */
  version: string;
  note: string;
  /** short label rendered on the 3D sprite */
  short: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "languages",
    skills: [
      { name: "typescript", short: "TS", version: "^5.6.0", note: "daily driver" },
      { name: "javascript", short: "JS", version: "^ES2024", note: "native tongue" },
      { name: "python", short: "PY", version: "^3.12", note: "scripts & Django" },
      { name: "java", short: "JAVA", version: "~21.0", note: "DSA days" },
      { name: "c/c++", short: "C++", version: "~17", note: "competitive programming" },
      { name: "html/css", short: "HTML", version: "^5 / ^3", note: "pixel-level" },
    ],
  },
  {
    id: "frontend",
    label: "frontend",
    skills: [
      { name: "react", short: "REACT", version: "^19.0.0", note: "daily driver" },
      { name: "next", short: "NEXT", version: "^16.0.0", note: "daily driver" },
      { name: "tailwindcss", short: "TW", version: "^4.0.0", note: "default styling" },
      { name: "shopify-liquid", short: "LIQUID", version: "^2.0", note: "custom themes" },
    ],
  },
  {
    id: "backend",
    label: "backend",
    skills: [
      { name: "node", short: "NODE", version: "^22.0.0", note: "daily driver" },
      { name: "express", short: "EXP", version: "^5.0.0", note: "REST APIs" },
      { name: "django", short: "DJ", version: "~5.0", note: "when Python fits" },
      { name: "auth-rbac", short: "RBAC", version: "^2.0.0", note: "JWT, sessions, roles" },
      { name: "payments", short: "PAY", version: "^1.4.0", note: "payment gateways" },
    ],
  },
  {
    id: "databases",
    label: "databases",
    skills: [
      { name: "mongodb", short: "MONGO", version: "^8.0.0", note: "indexes & aggregations" },
      { name: "mysql", short: "SQL", version: "^8.0", note: "relational work" },
    ],
  },
  {
    id: "devops",
    label: "devops & cloud",
    skills: [
      { name: "docker", short: "DOCKER", version: "^27.0.0", note: "everything containerised" },
      { name: "docker-compose", short: "COMPOSE", version: "^2.29", note: "multi-service stacks" },
      { name: "nginx", short: "NGINX", version: "^1.27", note: "reverse proxy & SSL" },
      { name: "certbot", short: "SSL", version: "^2.11", note: "auto-renewing certs" },
      { name: "github-actions", short: "CI/CD", version: "^4.0.0", note: "push → prod" },
      { name: "aws", short: "AWS", version: "EC2 · Lightsail", note: "production hosting" },
      { name: "linux", short: "LINUX", version: "ubuntu-24.04", note: "server admin" },
    ],
  },
  {
    id: "cms",
    label: "cms & e-commerce",
    skills: [
      { name: "shopify-themes", short: "SHOP", version: "^OS2.0", note: "theme development" },
      { name: "wordpress", short: "WP", version: "^6.6", note: "Elementor builds" },
    ],
  },
  {
    id: "automation",
    label: "automation & ai",
    skills: [
      { name: "n8n", short: "N8N", version: "^1.60", note: "workflow automation" },
      { name: "ai-workflows", short: "AI", version: "latest", note: "AI-assisted development" },
    ],
  },
  {
    id: "tools",
    label: "devDependencies",
    skills: [
      { name: "git", short: "GIT", version: "^2.46", note: "rebase, don't panic" },
      { name: "vscode", short: "CODE", version: "^1.95", note: "home" },
      { name: "postman", short: "API", version: "^11.0", note: "API testing" },
      { name: "gcp", short: "GCP", version: "~1.0", note: "occasional" },
    ],
  },
];

export const allSkills: Skill[] = skillGroups.flatMap((g) => g.skills);
