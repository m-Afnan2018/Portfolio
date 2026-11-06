import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";

/** Builds the `about.ts` source shown in the About section from the data files. */
export function buildAboutCode() {
  const pick = (id: string, n = 5) =>
    skillGroups
      .find((g) => g.id === id)!
      .skills.slice(0, n)
      .map((s) => `"${s.name}"`)
      .join(", ");
  const now = experience[0];
  return `interface Developer {
  name: string;
  roles: string[];
  stack: Record<string, string[]>;
  available: boolean;
}

const ${profile.handle}: Developer = {
  name: "${profile.name}",
  roles: ["Full Stack Developer", "DevOps Engineer"],
  location: "${profile.location} · ${profile.timezoneLabel}",
  currently: "${now.role} @ ${now.company}",
  stack: {
    frontend: [${pick("frontend", 3)}],
    backend:  [${pick("backend", 3)}],
    data:     [${pick("databases", 2)}],
    infra:    [${pick("devops", 4)}],
  },
  sitesInProduction: 20, // and counting
  education: "${profile.education[0].degree}, ${profile.education[0].school}",
  available: true,
};

export default ${profile.handle}; // ✓ compiled, 0 errors`;
}
