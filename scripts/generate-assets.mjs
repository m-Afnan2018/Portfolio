/**
 * generate-assets.mjs — creates placeholder project covers and UI sounds.
 *
 *   npm run assets
 *
 * Covers: designed "editor window" art per project → /public/projects/<slug>.webp
 *         (only written when the file doesn't exist, so real screenshots are
 *         never overwritten).
 * Sounds: tiny synthesised WAVs → /public/sounds/*.wav
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = (...p) => path.join(root, "public", ...p);

// ── project covers ──────────────────────────────────────────────────────────
// Kept in sync with src/data/projects.ts by reading the slugs/titles from it.
const src = fs.readFileSync(path.join(root, "src/data/projects.ts"), "utf8");
const items = [...src.matchAll(/slug:\s*"([^"]+)",\s*\n\s*title:\s*"([^"]+)",[\s\S]*?stack:\s*\[([^\]]*)\]/g)].map((m) => ({
  slug: m[1],
  title: m[2].replace(/^TODO:\s*/, ""),
  stack: [...m[3].matchAll(/"([^"]+)"/g)].map((s) => s[1]),
}));

const hues = [
  ["#22D3EE", "#8B5CF6"],
  ["#22C55E", "#22D3EE"],
  ["#8B5CF6", "#F59E0B"],
  ["#F59E0B", "#22D3EE"],
  ["#22D3EE", "#22C55E"],
  ["#8B5CF6", "#22D3EE"],
  ["#22C55E", "#8B5CF6"],
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function rand(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function cover({ slug, stack }, i) {
  const [a, b] = hues[i % hues.length];
  const r = rand(i * 7919 + 13);
  const W = 1600;
  const H = 1000;
  const code = Array.from({ length: 18 }, (_, k) => {
    const indent = Math.floor(r() * 4) * 28;
    const w = 120 + r() * 420;
    const color = [a, b, "#94A3B8", "#E5E7EB", "#22C55E"][Math.floor(r() * 5)];
    return `<rect x="${120 + indent}" y="${300 + k * 34}" width="${w}" height="12" rx="6" fill="${color}" opacity="${0.25 + r() * 0.5}"/>
            <text x="80" y="${311 + k * 34}" font-family="monospace" font-size="16" fill="#475569">${k + 1}</text>`;
  }).join("");
  const bars = Array.from({ length: 9 }, (_, k) => {
    const h = 60 + r() * 220;
    return `<rect x="${960 + k * 56}" y="${800 - h}" width="34" height="${h}" rx="4" fill="url(#g)" opacity="${0.5 + r() * 0.5}"/>`;
  }).join("");
  const chips = stack
    .slice(0, 4)
    .map((s, k) => `<g transform="translate(${80 + k * 210}, 900)"><rect width="190" height="44" rx="6" fill="#0B1020" stroke="${a}" stroke-opacity="0.5"/><text x="16" y="29" font-family="monospace" font-size="18" fill="#E5E7EB">${esc(s.slice(0, 16))}</text></g>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <radialGradient id="glow" cx="0.75" cy="0.35" r="0.6"><stop offset="0" stop-color="${a}" stop-opacity="0.35"/><stop offset="1" stop-color="#05070D" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#94A3B8" stroke-opacity="0.07"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#05070D"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="16" fill="#0B1020" fill-opacity="0.75" stroke="#94A3B8" stroke-opacity="0.18"/>
  <circle cx="80" cy="80" r="9" fill="#F87171"/><circle cx="108" cy="80" r="9" fill="#F59E0B"/><circle cx="136" cy="80" r="9" fill="#22C55E"/>
  <text x="180" y="87" font-family="monospace" font-size="20" fill="#94A3B8">~/projects/${esc(slug)}</text>
  ${code}
  <circle cx="1180" cy="430" r="150" fill="none" stroke="url(#g)" stroke-width="3" opacity="0.8"/>
  <circle cx="1180" cy="430" r="96" fill="none" stroke="${b}" stroke-width="1.5" stroke-dasharray="6 10" opacity="0.7"/>
  <circle cx="1180" cy="430" r="36" fill="url(#g)" opacity="0.9"/>
  ${bars}
  ${chips}
</svg>`;
}

fs.mkdirSync(out("projects"), { recursive: true });
for (const [i, p] of items.entries()) {
  const file = out("projects", `${p.slug}.webp`);
  if (fs.existsSync(file) && !process.argv.includes("--force")) {
    console.log(`skip  ${p.slug}.webp (exists)`);
    continue;
  }
  await sharp(Buffer.from(cover(p, i))).webp({ quality: 82 }).toFile(file);
  console.log(`wrote ${p.slug}.webp`);
}

// ── sounds ──────────────────────────────────────────────────────────────────
const RATE = 44100;
function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767, i * 2));
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}
const gen = (sec, fn) => Array.from({ length: Math.floor(RATE * sec) }, (_, i) => fn(i / RATE));
const nr = rand(42);
const noise = () => nr() * 2 - 1;

const sounds = {
  // short high blip
  tick: gen(0.05, (t) => Math.sin(2 * Math.PI * 2400 * t) * Math.exp(-t * 90) * 0.6),
  // mechanical key: filtered noise burst + low thock
  key: gen(0.06, (t) => (noise() * Math.exp(-t * 160) * 0.5 + Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 60) * 0.5)),
  // airy sweep
  whoosh: gen(0.6, (t) => noise() * Math.sin(Math.PI * (t / 0.6)) ** 2 * 0.25 * (0.6 + 0.4 * Math.sin(2 * Math.PI * (200 + t * 900) * t))),
  // 4 s seamless low hum (integer number of cycles of 55 Hz and 110 Hz)
  hum: gen(4, (t) => Math.sin(2 * Math.PI * 55 * t) * 0.35 + Math.sin(2 * Math.PI * 110 * t) * 0.12 + Math.sin(2 * Math.PI * 165 * t) * 0.05),
};
fs.mkdirSync(out("sounds"), { recursive: true });
for (const [name, s] of Object.entries(sounds)) {
  fs.writeFileSync(out("sounds", `${name}.wav`), wav(s));
  console.log(`wrote sounds/${name}.wav`);
}
