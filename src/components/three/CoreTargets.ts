/**
 * CoreTargets.ts — the shapes the Core can become, plus the per-section
 * placement of the Core and camera.
 *
 * Every target is a Float32Array of N xyz positions sampled from real
 * geometry (edges for crisp silhouettes, surfaces for volume). Particle i in
 * one shape flies to particle i in the next.
 *
 * Tweak a shape: edit its builder below. Tweak where the Core sits per
 * section: edit DESKTOP_STATES / MOBILE_STATES.
 */
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

// ─── deterministic random ───────────────────────────────────────────────────
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;

// ─── samplers ───────────────────────────────────────────────────────────────
/** Points spread along the edges of a geometry, weighted by edge length. */
function sampleEdges(geo: THREE.BufferGeometry, count: number, rand: Rand, threshold = 1) {
  const edges = new THREE.EdgesGeometry(geo, threshold);
  const p = edges.attributes.position.array as Float32Array;
  const segs: { a: THREE.Vector3; b: THREE.Vector3; len: number }[] = [];
  let total = 0;
  for (let i = 0; i < p.length; i += 6) {
    const a = new THREE.Vector3(p[i], p[i + 1], p[i + 2]);
    const b = new THREE.Vector3(p[i + 3], p[i + 4], p[i + 5]);
    const len = a.distanceTo(b);
    total += len;
    segs.push({ a, b, len });
  }
  edges.dispose();
  return sampleSegments(segs, total, count, rand, 0.012);
}

function sampleSegments(
  segs: { a: THREE.Vector3; b: THREE.Vector3; len: number }[],
  total: number,
  count: number,
  rand: Rand,
  jitter = 0.01,
) {
  const out = new Float32Array(count * 3);
  const cumulative: number[] = [];
  let acc = 0;
  for (const s of segs) cumulative.push((acc += s.len));
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const r = rand() * total;
    let lo = 0;
    let hi = cumulative.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const s = segs[lo];
    v.lerpVectors(s.a, s.b, rand());
    out[i * 3] = v.x + (rand() - 0.5) * jitter;
    out[i * 3 + 1] = v.y + (rand() - 0.5) * jitter;
    out[i * 3 + 2] = v.z + (rand() - 0.5) * jitter;
  }
  return out;
}

/** Points spread across the surface of a geometry. */
function sampleSurface(geo: THREE.BufferGeometry, count: number, rand: Rand) {
  const mesh = new THREE.Mesh(geo.index ? geo.toNonIndexed() : geo);
  const sampler = new MeshSurfaceSampler(mesh);
  // setRandomGenerator exists at runtime but is missing from @types/three
  (sampler as unknown as { setRandomGenerator: (r: Rand) => void }).setRandomGenerator(rand);
  sampler.build();
  const out = new Float32Array(count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(v);
    out.set([v.x, v.y, v.z], i * 3);
  }
  return out;
}

function polyline(points: THREE.Vector3[]) {
  const segs: { a: THREE.Vector3; b: THREE.Vector3; len: number }[] = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const len = points[i].distanceTo(points[i + 1]);
    segs.push({ a: points[i], b: points[i + 1], len });
    total += len;
  }
  return { segs, total };
}

/** Concatenate weighted parts into exactly `count` points and shuffle. */
function compose(count: number, rand: Rand, parts: [number, (n: number) => Float32Array][]) {
  const out = new Float32Array(count * 3);
  let offset = 0;
  parts.forEach(([weight, build], idx) => {
    const n = idx === parts.length - 1 ? count - offset : Math.floor(count * weight);
    if (n <= 0) return;
    out.set(build(n), offset * 3);
    offset += n;
  });
  // Fisher–Yates shuffle so particle i lands on a random part of each shape
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    for (let k = 0; k < 3; k++) {
      const t = out[i * 3 + k];
      out[i * 3 + k] = out[j * 3 + k];
      out[j * 3 + k] = t;
    }
  }
  return out;
}

// ─── shared shape constants (meshes in other components align to these) ────
export const LAPTOP = {
  offsetY: -0.55,
  base: { w: 2.8, h: 0.12, d: 1.9 },
  lid: { w: 2.8, h: 1.8, d: 0.06, tilt: -0.28 },
  screen: { w: 2.5, h: 1.52 },
};

export const MONITORS = [
  { pos: [0, 0, 0] as const, rotY: 0, w: 2.4, h: 1.5 },
  { pos: [-2.55, 0.05, 0.75] as const, rotY: 0.5, w: 2.0, h: 1.25 },
  { pos: [2.55, 0.05, 0.75] as const, rotY: -0.5, w: 2.0, h: 1.25 },
];

export const RACKS = [-1.3, 0, 1.3].map((x) => ({ x, w: 0.9, h: 2.2, d: 0.9 }));

export const HELIX = { radius: 0.95, height: 8, turns: 3.2 };
/** commit nodes on the helix (y positions, top = newest) */
export const HELIX_NODES = [3.0, 1.0, -1.0, -3.0];

/** Direction the satellite dish faces (matches the rotations in `satellite`). */
export const DISH_AXIS = new THREE.Vector3(0, 1, 0)
  .applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2 - 0.5)
  .applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.6)
  .normalize();
export const DISH_CENTER = new THREE.Vector3(0, 0.35, 0);

export function helixPoint(y: number, strand: 0 | 1, out = new THREE.Vector3()) {
  const t = (y / HELIX.height + 0.5) * HELIX.turns * Math.PI * 2 + strand * Math.PI;
  return out.set(Math.cos(t) * HELIX.radius, y, Math.sin(t) * HELIX.radius);
}

// ─── shape builders ─────────────────────────────────────────────────────────
type Builder = (n: number, rand: Rand) => Float32Array;

const scatter: Builder = (n, rand) => {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 3 + rand() * 7;
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(2 * rand() - 1);
    out[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.4;
    out[i * 3 + 1] = r * Math.cos(ph) * 0.7;
    out[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 2;
  }
  return out;
};

const heroCore: Builder = (n, rand) =>
  compose(n, rand, [
    [0.5, (k) => sampleEdges(new THREE.IcosahedronGeometry(1.7, 1), k, rand)],
    [0.16, (k) => sampleEdges(new THREE.IcosahedronGeometry(0.85, 0), k, rand)],
    [0.34, (k) => sampleSurface(new THREE.IcosahedronGeometry(1.72, 3), k, rand)],
  ]);

const laptop: Builder = (n, rand) => {
  const { base, lid, offsetY } = LAPTOP;
  const baseGeo = new THREE.BoxGeometry(base.w, base.h, base.d);
  baseGeo.translate(0, -base.h / 2 + offsetY, 0);
  const lidGeo = new THREE.BoxGeometry(lid.w, lid.h, lid.d);
  lidGeo.translate(0, lid.h / 2, 0);
  lidGeo.rotateX(lid.tilt);
  lidGeo.translate(0, offsetY, -base.d / 2);
  // keyboard: a grid of short key outlines on the deck
  const keys = () => {
    const pts: THREE.Vector3[] = [];
    const segs: { a: THREE.Vector3; b: THREE.Vector3; len: number }[] = [];
    let total = 0;
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 12; c++) {
        const x = -1.15 + c * 0.21;
        const z = -0.6 + r * 0.22;
        const y = offsetY + 0.002;
        const a = new THREE.Vector3(x, y, z);
        const b = new THREE.Vector3(x + 0.16, y, z);
        const cc = new THREE.Vector3(x + 0.16, y, z + 0.16);
        const d = new THREE.Vector3(x, y, z + 0.16);
        for (const [p, q] of [[a, b], [b, cc], [cc, d], [d, a]] as const) {
          segs.push({ a: p, b: q, len: 0.16 });
          total += 0.16;
        }
        pts.push(a);
      }
    return (k: number) => sampleSegments(segs, total, k, rand, 0.004);
  };
  return compose(n, rand, [
    [0.2, (k) => sampleEdges(baseGeo, k, rand)],
    [0.18, (k) => sampleSurface(baseGeo, k, rand)],
    [0.14, keys()],
    [0.24, (k) => sampleEdges(lidGeo, k, rand)],
    [0.24, (k) => sampleSurface(lidGeo, k, rand)],
  ]);
};

const skillSphere: Builder = (n, rand) => {
  const shell = (k: number) => {
    const out = new Float32Array(k * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < k; i++) {
      const y = 1 - (i / (k - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      out.set([Math.cos(th) * r * 1.9, y * 1.9, Math.sin(th) * r * 1.9], i * 3);
    }
    return out;
  };
  const ring = (tiltX: number, tiltZ: number, radius: number) => (k: number) => {
    const out = new Float32Array(k * 3);
    const e = new THREE.Euler(tiltX, 0, tiltZ);
    const v = new THREE.Vector3();
    for (let i = 0; i < k; i++) {
      const t = rand() * Math.PI * 2;
      v.set(Math.cos(t) * radius, (rand() - 0.5) * 0.03, Math.sin(t) * radius).applyEuler(e);
      out.set([v.x, v.y, v.z], i * 3);
    }
    return out;
  };
  return compose(n, rand, [
    [0.55, shell],
    [0.15, ring(0.4, 0.2, 2.6)],
    [0.15, ring(-0.9, -0.4, 2.85)],
    [0.15, ring(1.3, 0.9, 3.1)],
  ]);
};

const helix: Builder = (n, rand) => {
  const strand = (s: 0 | 1) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 240; i++) pts.push(helixPoint(-HELIX.height / 2 + (i / 240) * HELIX.height, s));
    const { segs, total } = polyline(pts);
    return (k: number) => sampleSegments(segs, total, k, rand, 0.03);
  };
  const rungs = (k: number) => {
    const segs: { a: THREE.Vector3; b: THREE.Vector3; len: number }[] = [];
    let total = 0;
    for (let i = 0; i < 26; i++) {
      const y = -HELIX.height / 2 + (i / 25) * HELIX.height;
      const a = helixPoint(y, 0);
      const b = helixPoint(y, 1);
      const len = a.distanceTo(b);
      segs.push({ a, b, len });
      total += len;
    }
    return sampleSegments(segs, total, k, rand, 0.01);
  };
  // a feature branch leaving the main line and merging back — very `git log --graph`
  const branch = (k: number) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const y = 2.2 - t * 3.6;
      const out = Math.sin(t * Math.PI) * 1.2;
      const p = helixPoint(y, 0);
      pts.push(new THREE.Vector3(p.x + out, y, p.z + out * 0.4));
    }
    const { segs, total } = polyline(pts);
    return sampleSegments(segs, total, k, rand, 0.02);
  };
  const nodes = (k: number) => {
    const out = new Float32Array(k * 3);
    for (let i = 0; i < k; i++) {
      const y = HELIX_NODES[i % HELIX_NODES.length];
      const c = helixPoint(y, 0);
      const r = 0.16 * Math.cbrt(rand());
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      out.set([c.x + r * Math.sin(ph) * Math.cos(th), c.y + r * Math.cos(ph), c.z + r * Math.sin(ph) * Math.sin(th)], i * 3);
    }
    return out;
  };
  return compose(n, rand, [
    [0.32, strand(0)],
    [0.3, strand(1)],
    [0.16, rungs],
    [0.12, branch],
    [0.1, nodes],
  ]);
};

const monitors: Builder = (n, rand) => {
  const geos = MONITORS.map((m) => {
    const g = new THREE.BoxGeometry(m.w + 0.12, m.h + 0.12, 0.05);
    g.rotateY(m.rotY);
    g.translate(m.pos[0], m.pos[1], m.pos[2]);
    return g;
  });
  const stands = MONITORS.map((m) => {
    const g = new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6);
    g.translate(m.pos[0], m.pos[1] - m.h / 2 - 0.35, m.pos[2]);
    return g;
  });
  return compose(n, rand, [
    ...geos.map((g) => [0.16, (k: number) => sampleEdges(g, k, rand)] as [number, (n: number) => Float32Array]),
    ...geos.map((g) => [0.12, (k: number) => sampleSurface(g, k, rand)] as [number, (n: number) => Float32Array]),
    ...stands.map((g) => [0.04, (k: number) => sampleSurface(g, k, rand)] as [number, (n: number) => Float32Array]),
  ]);
};

const racks: Builder = (n, rand) => {
  const parts: [number, (k: number) => Float32Array][] = [];
  for (const r of RACKS) {
    const g = new THREE.BoxGeometry(r.w, r.h, r.d);
    g.translate(r.x, 0, 0);
    parts.push([0.11, (k) => sampleEdges(g, k, rand)]);
    parts.push([0.09, (k) => sampleSurface(g, k, rand)]);
    // server "slots" across the front face
    const segs: { a: THREE.Vector3; b: THREE.Vector3; len: number }[] = [];
    let total = 0;
    for (let s = 0; s < 9; s++) {
      const y = -r.h / 2 + 0.2 + s * 0.23;
      const a = new THREE.Vector3(r.x - r.w / 2 + 0.08, y, r.d / 2 + 0.01);
      const b = new THREE.Vector3(r.x + r.w / 2 - 0.08, y, r.d / 2 + 0.01);
      segs.push({ a, b, len: a.distanceTo(b) });
      total += a.distanceTo(b);
    }
    parts.push([0.13, (k) => sampleSegments(segs, total, k, rand, 0.01)]);
  }
  return compose(n, rand, parts);
};

const trophy: Builder = (n, rand) =>
  compose(n, rand, [
    [0.8, (k) => sampleSurface(new THREE.TorusKnotGeometry(1.25, 0.32, 220, 20), k, rand)],
    [0.2, (k) => sampleEdges(new THREE.TorusKnotGeometry(1.25, 0.34, 120, 6), k, rand, 20)],
  ]);

const satellite: Builder = (n, rand) => {
  // parabolic dish
  const profile: THREE.Vector2[] = [];
  for (let i = 0; i <= 16; i++) {
    const x = (i / 16) * 1.0;
    profile.push(new THREE.Vector2(x, x * x * 0.45));
  }
  const dish = new THREE.LatheGeometry(profile, 48);
  dish.rotateX(Math.PI / 2 - 0.5);
  dish.rotateY(-0.6);
  dish.translate(0, 0.35, 0);
  const mast = new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8);
  mast.translate(0, -0.55, 0);
  const feed = new THREE.CylinderGeometry(0.015, 0.015, 0.75, 6);
  feed.rotateX(Math.PI / 2 - 0.5);
  feed.rotateY(-0.6);
  feed.translate(-0.17, 0.52, 0.25);
  const baseG = new THREE.CylinderGeometry(0.55, 0.65, 0.12, 24);
  baseG.translate(0, -1.38, 0);
  return compose(n, rand, [
    [0.42, (k) => sampleSurface(dish, k, rand)],
    [0.18, (k) => sampleEdges(dish, k, rand, 10)],
    [0.12, (k) => sampleSurface(mast, k, rand)],
    [0.06, (k) => sampleSurface(feed, k, rand)],
    [0.22, (k) => sampleEdges(baseG, k, rand, 10)],
  ]);
};

/** Index → shape. 0 is the boot-loader scatter. */
const BUILDERS: Builder[] = [scatter, heroCore, laptop, skillSphere, helix, monitors, racks, trophy, satellite];
export const SHAPE_NAMES = ["scatter", "core", "laptop", "sphere", "helix", "monitors", "racks", "trophy", "satellite"];

export function buildTargets(count: number) {
  return BUILDERS.map((b, i) => b(count, mulberry32(1337 + i * 97)));
}

// ─── per-section placement (tweened by a GSAP timeline in Core.tsx) ────────
export interface CoreState {
  x: number;
  y: number;
  z: number;
  scale: number;
  tilt: number; // rotation.x
  yaw: number; // base rotation.y
  spin: number; // auto-rotation speed
  opacity: number;
  camZ: number;
}

const s = (o: Partial<CoreState>): CoreState => ({
  x: 0, y: 0, z: 0, scale: 1, tilt: 0, yaw: 0, spin: 0.12, opacity: 1, camZ: 8, ...o,
});

/** index = scene number (1 hero … 8 contact). Index 0 mirrors the hero. */
export const DESKTOP_STATES: CoreState[] = [
  s({ x: 2.7, y: 0.1, scale: 1 }),
  s({ x: 2.7, y: 0.1, scale: 1 }),
  s({ x: -2.7, y: -0.2, scale: 0.92, tilt: 0.32, yaw: 0.55, spin: 0 }),
  s({ x: 0, y: 0, scale: 1.05, spin: 0.08, opacity: 0.6 }),
  s({ x: 3.0, y: 0, z: -1, scale: 0.85, tilt: 0.05, spin: 0.18, opacity: 0.75 }),
  s({ x: 0, y: 0.35, z: -3.2, scale: 1.15, spin: 0, opacity: 0.35 }),
  s({ x: 3.0, y: -1.45, scale: 0.62, tilt: 0.18, yaw: -0.45, spin: 0, opacity: 0.7 }),
  s({ x: 2.9, y: 0.1, z: -1.2, scale: 0.95, tilt: 0.4, spin: 0.25 }),
  s({ x: 3.0, y: 0.55, scale: 0.8, tilt: 0.1, yaw: -0.3, spin: 0.05 }),
];

/** Mobile: the Core lives behind the content, high and dim. */
export const MOBILE_STATES: CoreState[] = DESKTOP_STATES.map((st, i) =>
  s({
    ...st,
    x: 0,
    y: i === 4 ? 0 : 1.2,
    z: Math.min(st.z, 0) - 1.5,
    scale: st.scale * (i === 5 ? 0.55 : 0.7),
    opacity: Math.min(st.opacity, i === 6 ? 0.15 : 0.35),
  }),
);

/** 0–1 visibility of a scene-specific layer given the continuous scene index. */
export function sceneWeight(scene: number, k: number, width = 0.65) {
  return Math.max(0, 1 - Math.abs(scene - k) / width);
}
