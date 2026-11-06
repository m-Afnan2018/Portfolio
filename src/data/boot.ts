/** Boot-sequence log lines. `at` = load progress (0–1) at which the line prints. */
export const bootLines: { text: string; at: number; status: "ok" | "info" }[] = [
  { text: "AFNAN-BIOS v2.0.0 · POST check passed", at: 0, status: "info" },
  { text: "Mounting /dev/afnan", at: 0.05, status: "ok" },
  { text: "Loading kernel modules: typescript node next", at: 0.15, status: "ok" },
  { text: "Starting docker.service", at: 0.3, status: "ok" },
  { text: "npm run build ✓ compiled in 1.21s", at: 0.45, status: "ok" },
  { text: "docker compose up -d ✓ 3 containers running", at: 0.6, status: "ok" },
  { text: "nginx: configuration file syntax is ok", at: 0.72, status: "ok" },
  { text: "Uploading particle shaders to GPU", at: 0.84, status: "ok" },
  { text: "Reached target graphical.target", at: 0.96, status: "ok" },
];

/** Faint code that drifts behind sections. */
export const ambientCode = [
  "const core = new ParticleCore({ count: 12_000 });",
  "await deploy({ target: 'vps', strategy: 'rolling' });",
  "ssl_certificate /etc/letsencrypt/live/afnan/fullchain.pem;",
  "export async function GET() { return Response.json({ ok: true }) }",
  "docker compose -f docker-compose.prod.yml up -d --build",
  "db.orders.createIndex({ userId: 1, createdAt: -1 })",
  "if (!session?.user.roles.includes('admin')) redirect('/403');",
  "git rebase origin/main && git push --force-with-lease",
  "uniform float uMorph; varying vec3 vColor;",
  "location / { proxy_pass http://app:3000; }",
  "const tl = gsap.timeline({ scrollTrigger: { scrub: true } });",
  "runs-on: ubuntu-latest  # ship it",
  "SELECT id, total FROM payments WHERE status = 'captured';",
  "useFrame((_, dt) => core.current.rotation.y += dt * 0.1);",
];
