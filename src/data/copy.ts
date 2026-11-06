/** UI copy — section headings, labels and microcopy. */

export type TitlePart = { text: string; outline?: boolean; accent?: boolean; inline?: "cube" | "caret" | "term" };

export const copy = {
  hero: {
    eyebrow: "// 01. home",
    status: "● online — accepting new projects",
    ctaProjects: "$ view --projects",
    ctaResume: "$ download resume.pdf",
    scroll: "scroll to boot the journey",
  },
  about: {
    eyebrow: "// 02. about",
    title: [{ text: "Writes" }, { text: "the app", outline: true }, { text: "& the" }, { text: "infra", accent: true, inline: "caret" }] as TitlePart[],
    file: "about.ts",
  },
  skills: {
    eyebrow: "// 03. skills",
    title: [{ text: "dependen" }, { text: "cies", outline: true }] as TitlePart[],
    hint: "drag the sphere · hover a package",
    file: "package.json",
  },
  experience: {
    eyebrow: "// 04. experience",
    title: [{ text: "git" }, { text: "log", outline: true, inline: "term" }] as TitlePart[],
    command: "$ git log --graph --decorate --oneline=false",
  },
  projects: {
    eyebrow: "// 05. projects",
    title: [{ text: "Selected" }, { text: "work", outline: true, inline: "cube" }] as TitlePart[],
    hint: "drag / scroll →",
    archiveTitle: "ls ./projects",
    viewSource: "view source",
    backToCard: "← back",
    open: "open",
  },
  infra: {
    eyebrow: "// 06. infra",
    title: [{ text: "push" }, { text: "→ prod", outline: true }] as TitlePart[],
    lead: "Every client site I run ships through the same boring, reliable pipeline. Boring is the feature.",
  },
  achievements: {
    eyebrow: "// 07. stats",
    title: [{ text: "by the" }, { text: "numbers", outline: true }] as TitlePart[],
    githubTitle: "contributions --last-year",
  },
  contact: {
    eyebrow: "// 08. contact",
    title: [{ text: "Let's" }, { text: "ship", accent: true }, { text: "something", outline: true }] as TitlePart[],
    lead: "Got a product to build or servers to tame? The terminal below sends straight to my inbox.",
    success: "✓ message delivered (200 OK)",
  },
  footer: {
    built: "Built with Next.js, R3F & too much coffee",
  },
  transitions: {
    about: "clear && cat about.ts",
    skills: "npm ls --depth=0",
    experience: "git log --graph",
    projects: "ls -la ./projects",
    infra: "docker compose ps",
    achievements: "cat stats.md",
    contact: "./contact.sh",
  } as Record<string, string>,
};
