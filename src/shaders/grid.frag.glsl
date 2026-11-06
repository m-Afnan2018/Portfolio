// Restrained synthwave floor: anti-aliased grid lines fading with distance.
uniform vec3  uColor;
uniform float uOpacity;
uniform float uTime;
varying vec2  vUv;
varying vec3  vWorld;

float gridLine(vec2 p, float scale) {
  vec2 g = abs(fract(p * scale - 0.5) - 0.5) / fwidth(p * scale);
  return 1.0 - min(min(g.x, g.y), 1.0);
}

void main() {
  vec2 p = vWorld.xz + vec2(0.0, uTime * 0.25);
  float l = gridLine(p, 0.5) * 0.9 + gridLine(p, 2.0) * 0.18;
  float fade = smoothstep(18.0, 2.0, length(vWorld.xz)) * smoothstep(-14.0, -2.0, vWorld.z - 2.0);
  gl_FragColor = vec4(uColor, l * fade * uOpacity);
}
