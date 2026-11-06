import { profile, achievements } from "@/data/profile";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { packages, services } from "@/data/clients";
import { abs, knowsAbout } from "@/lib/seo";

/**
 * /llms.txt — a plain-markdown summary for AI assistants (llmstxt.org),
 * generated from the same data files as the site so it never drifts.
 */
export function GET() {
  const real = projects.filter((p) => !p.placeholder);
  const body = [
    `# ${profile.name}`,
    "",
    `> ${profile.title}. ${profile.oneLiner}`,
    "",
    profile.summary,
    "",
    profile.summaryExtra,
    "",
    `- Location: India (${profile.timezoneLabel})`,
    `- Email: ${profile.email}`,
    `- Status: ${profile.availability}`,
    `- GitHub: ${profile.links.github}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    `- X / Twitter: ${profile.links.twitter}`,
    `- Resume (PDF): ${abs(profile.resume)}`,
    "",
    "## Pages",
    "",
    `- [Portfolio](${abs("/")}): the developer site — about, skills, experience, projects, infrastructure, contact`,
    `- [Recruiter brief](${abs("/hr")}): one-page résumé — experience, skills, projects, availability`,
    `- [Work with me](${abs("/work-with-me")}): freelance services, packages and pricing for businesses`,
    "",
    "## Experience",
    "",
    ...experience.map(
      (j) => `- ${j.role} at ${j.company} (${j.period}, ${j.mode}): ${j.bullets.join(" ")}`,
    ),
    "",
    "## Projects",
    "",
    ...real.map(
      (p) =>
        `- [${p.title}](${abs(`/work/${p.slug}`)}) (${p.year}; ${p.stack.join(", ")}): ${p.description}` +
        (p.liveUrl ? ` Live: ${p.liveUrl}` : "") +
        (p.repoUrl ? ` Code: ${p.repoUrl}` : ""),
    ),
    "",
    "## Skills",
    "",
    knowsAbout.join(", "),
    "",
    "## Achievements",
    "",
    ...achievements.map((a) => `- ${a.value}${a.suffix} ${a.label} — ${a.detail}`),
    "",
    "## Freelance services",
    "",
    ...services.map((s) => `- ${s.title}: ${s.summary} (${s.timeline})`),
    "",
    ...packages.map(
      (p) =>
        `- ${p.name} package: ₹${p.price.toLocaleString("en-IN")} — up to ${p.pages} pages, ${p.delivery}`,
    ),
    "",
    "## Education",
    "",
    ...profile.education.map((e) => `- ${e.degree}, ${e.school} (${e.period})`),
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
