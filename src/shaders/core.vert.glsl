// ─────────────────────────────────────────────────────────────────────────────
// The Core — particle morph vertex shader
//
// Every particle owns one position per shape. The CPU uploads the two shapes
// we are travelling between (aFrom → aTo) and drives uMorph 0→1 from scroll.
//
//  1. Each particle gets its own delay (aRand.x) so the morph is staggered —
//     the shape dissolves and reassembles instead of tweening rigidly.
//  2. Mid-flight (sin(PI * m)) particles are pushed through a curl-ish noise
//     field: that is the "swarm".
//  3. uIntro blends from the boot-loader scatter cloud into the Core.
//  4. Scroll velocity stretches particles vertically; uBurst throws them
//     outward; the pointer gently repels them.
// ─────────────────────────────────────────────────────────────────────────────
uniform float uTime;
uniform float uMorph;      // 0 → 1 between aFrom and aTo
uniform float uIntro;      // 0 = boot scatter, 1 = assembled
uniform float uVelocity;   // -1…1 normalised scroll velocity
uniform float uBurst;      // 0…1 impulse
uniform float uSize;       // base point size
uniform float uPixelRatio;
uniform float uPulse;      // 0…1 caret-blink pulse
uniform float uSwarm;      // swarm amplitude
uniform vec3  uPointer;    // pointer projected into Core-local space
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;

attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec3 aScatter;
attribute vec4 aRand;      // x: morph delay, y: colour mix, z: burst strength, w: size jitter

varying vec3  vColor;
varying float vAlpha;

// cheap 3D hash noise → smooth value noise
float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
                 mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
                 mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
vec3 swirl(vec3 p) {
  return vec3(
    noise(p + vec3(0.0, uTime * 0.15, 0.0)),
    noise(p + vec3(31.7, uTime * 0.15, 4.1)),
    noise(p + vec3(-12.3, 7.9, uTime * 0.15))
  ) * 2.0 - 1.0;
}

void main() {
  // 1. staggered morph progress for this particle
  float delay = aRand.x * 0.45;
  float m = clamp((uMorph - delay) / 0.55, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);

  vec3 pos = mix(aFrom, aTo, m);

  // 2. swarm while in flight
  float flight = sin(3.14159265 * m);
  pos += swirl(pos * 0.6 + aRand.xyz * 4.0) * flight * uSwarm;

  // idle breathing so a resting shape still feels alive
  pos += swirl(pos * 1.3) * 0.025;

  // 3. boot-loader scatter → assembled
  float intro = clamp((uIntro - aRand.x * 0.35) / 0.65, 0.0, 1.0);
  intro = 1.0 - pow(1.0 - intro, 3.0);
  pos = mix(aScatter, pos, intro);

  // 4a. burst outward
  pos += normalize(pos + 0.0001) * uBurst * (0.6 + aRand.z * 2.4);

  // 4b. pointer repulsion
  vec3 toP = pos - uPointer;
  float d = length(toP);
  pos += normalize(toP + 0.0001) * smoothstep(1.1, 0.0, d) * 0.35;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  // 4c. scroll velocity stretch (view space, so it always reads as vertical)
  mvPosition.y += uVelocity * (0.06 + aRand.w * 0.2);

  gl_Position = projectionMatrix * mvPosition;

  float size = uSize * (0.55 + aRand.w * 0.9) * (1.0 + uPulse * 0.25);
  size *= 1.0 + abs(uVelocity) * 0.2;
  gl_PointSize = size * uPixelRatio * (8.0 / -mvPosition.z);

  // colour: cyan ↔ violet mix with a few green "terminal" sparks
  vec3 col = mix(uColorA, uColorB, smoothstep(0.2, 1.0, aRand.y + pos.y * 0.08));
  col = mix(col, uColorC, step(0.94, aRand.y));
  vColor = col * (1.0 + flight * 0.25 + uBurst * 0.8);
  vAlpha = 0.55 + aRand.w * 0.45;
}
