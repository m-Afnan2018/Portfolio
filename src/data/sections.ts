/**
 * sections.ts — the order of the journey. `scene` is the index of the Core
 * shape (see components/three/CoreTargets.ts) shown while the section is active.
 */
export interface SectionMeta {
  id: string;
  file: string; // editor-tab label
  label: string;
  scene: number;
  icon: "home" | "user" | "pkg" | "git" | "folder" | "server" | "trophy" | "mail";
}

export const sections: SectionMeta[] = [
  { id: "home", file: "home.tsx", label: "home", scene: 1, icon: "home" },
  { id: "about", file: "about.json", label: "about", scene: 2, icon: "user" },
  { id: "skills", file: "skills.ts", label: "skills", scene: 3, icon: "pkg" },
  { id: "experience", file: "experience.log", label: "experience", scene: 4, icon: "git" },
  { id: "projects", file: "projects/", label: "projects", scene: 5, icon: "folder" },
  { id: "infra", file: "infra.yml", label: "infra", scene: 6, icon: "server" },
  { id: "achievements", file: "stats.md", label: "achievements", scene: 7, icon: "trophy" },
  { id: "contact", file: "contact.sh", label: "contact", scene: 8, icon: "mail" },
];

export const SCENE_COUNT = 9; // 0 = boot scatter, 1..8 = sections
