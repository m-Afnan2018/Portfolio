# Mohammad Afnan — portfolio v2

> A journey through a developer's machine at night. One particle **Core** travels the whole page and re-forms at every stop: neural core → laptop → package sphere → git helix → monitors → server racks → trophy → antenna.

Next.js 16 (App Router, Cache Components) · TypeScript strict · Tailwind CSS v4 · React Three Fiber + drei + postprocessing · GSAP (ScrollTrigger, SplitText, Flip, ScrambleText) · Lenis · Framer Motion · shiki · cmdk · zod + React Hook Form · Resend · Howler.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you need (all optional for local dev)
npm run dev                  # http://localhost:3000
```

| script | what it does |
| --- | --- |
| `npm run dev` | dev server (Turbopack) |
| `npm run build` / `npm start` | production build / serve |
| `npm run lint` · `npm run typecheck` · `npm run format` | ESLint · `tsc --noEmit` · Prettier |
| `npm run assets` | regenerate placeholder project covers + UI sounds (never overwrites existing covers unless `-- --force`) |

## Environment variables

| var | required | purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | prod | canonical URL, OG image, sitemap, JSON-LD |
| `RESEND_API_KEY` | for the contact form | Resend API key |
| `CONTACT_TO_EMAIL` | for the contact form | inbox that receives messages |
| `CONTACT_FROM_EMAIL` | no | sender on a Resend-verified domain (default `onboarding@resend.dev`) |
| `GITHUB_TOKEN` | no | GitHub GraphQL for the heatmap. Without it, the public contributions page is used; if GitHub is unreachable, an empty calendar is shown with a stderr note |

Without the Resend vars the form still validates, but sending prints `stderr: 503 mail transport not configured`.

## Editing content

Everything personal lives in `src/data/*` — components contain no copy.

- `profile.ts` — name, roles, summary, links, education, achievements, changelog, "currently building"
- `experience.ts` — jobs (rendered as git commits)
- `skills.ts` — groups → `package.json` panel + 3D skill sphere labels
- `projects.ts` — every project (see below)
- `infra.ts` — pipeline stages + the docker-compose / nginx / workflow files shown in Infra
- `copy.ts` — section headings, CTA labels, microcopy
- `sections.ts` — section order, editor-tab filenames, Core shape per section

### Adding a project

1. Append an object to `projects` in `src/data/projects.ts` (typed by the `Project` interface).
2. Put a 16:10 screenshot at `public/projects/<slug>.webp` (or run `npm run assets` for a generated placeholder).
3. Optional: `video` (short muted loop, plays on hover), `codeSnippet` (shown on the "view source" flip side and in the modal), `gallery`, `liveUrl`, `repoUrl`.
4. `featured: true` puts it in the horizontal pinned track; the first three featured projects also appear on the 3D monitors.

Categories in the git-branch filter are generated from the data. Projects open at `/#project-<slug>`.

## How the 3D works

- `src/components/three/Scene.tsx` — one fixed `<Canvas>` behind the DOM (`pointer-events: none`, events via `eventSource` on `#app-root`). Code-split with `next/dynamic({ ssr: false })`.
- `src/hooks/useLenis.ts` — Lenis ↔ ScrollTrigger sync; maps scroll → a **continuous scene index** (`1` hero … `8` contact). The index sits still while a section fills the viewport and interpolates in the gaps between sections.
- `src/components/three/CoreTargets.ts` — every shape is sampled from real geometry (edges + surfaces). **Tweak shapes here**, and per-section placement in `DESKTOP_STATES` / `MOBILE_STATES`.
- `src/components/three/Core.tsx` — `THREE.Points` + a paused GSAP master timeline that tweens placement between section states; `floor(scene)` → `ceil(scene)` drives the morph.
- `src/shaders/core.vert.glsl` — staggered per-particle morph, mid-flight swarm noise, boot-scatter intro, velocity stretch, burst and pointer repulsion (heavily commented).
- Companion layers: `Layers.tsx` (wireframe core, laptop screen CanvasTexture, helix nodes, torus wire, antenna rings), `SkillSphere.tsx`, `ProjectPanels.tsx`, `InfraRacks.tsx` (packets share `lib/pipeline.ts` with the DOM diagram so they move in lock-step).
- Performance: GPU tier via `detect-gpu` (benchmarks self-hosted in `/public/detect-gpu`). Low tier / mobile → ~4k particles, no post-processing, DPR ≤ 1.25. Rendering pauses when the tab is hidden. Reduced motion (OS setting **or** the status-bar toggle) → no Lenis, no pins, no morphs; a static, gently rotating Core.

Motion tokens (easings, durations, staggers) live in `src/lib/motion.ts`.

## Easter eggs

`⌘K / Ctrl+K` palette · `` ` `` terminal (`help`, `sudo hire-me`, `matrix`, tab-completion, ↑/↓ history) · Konami code · DevTools console · tab-blur title · blinking favicon · 404 stack trace.

## Deploy

### Vercel
Import the repo, set the env vars above, deploy. Nothing else needed.

### Docker + Nginx on a VPS / EC2 / Lightsail

```bash
cp .env.example .env.production      # fill in
docker compose up -d --build         # serves on 127.0.0.1:3000
sudo cp deploy/nginx.conf /etc/nginx/sites-available/portfolio
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo certbot --nginx -d mafnan.dev -d www.mafnan.dev
sudo nginx -t && sudo systemctl reload nginx
```

The `Dockerfile` is multi-stage and uses Next's `output: "standalone"`; the container runs as a non-root user with a healthcheck.

## Still TODO (your input needed)

- [ ] `public/Mohammad_Afnan_Resume.pdf` — add your resume (every "resume" button links here)
- [ ] LinkedIn URL in `src/data/profile.ts` (`links.linkedin`) and the repo URL (`links.source`)
- [ ] Replace the four `TODO:` projects in `src/data/projects.ts`, and point `repoUrl`s at the exact repos
- [ ] Real screenshots in `public/projects/` (the current covers are generated placeholders)
- [ ] `NEXT_PUBLIC_SITE_URL` (defaults to `https://mafnan.dev`)
