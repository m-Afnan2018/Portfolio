// Soft round point with a hot centre — bright cores feed the bloom pass.
uniform float uOpacity;
uniform float uAdditive; // 1 = dark theme glow, 0 = light theme ink

varying vec3  vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  float hot = smoothstep(0.18, 0.0, d);
  vec3 col = vColor * (core + hot * 0.8 * uAdditive);
  float a = mix(smoothstep(0.5, 0.25, d), core, uAdditive) * vAlpha * uOpacity;
  gl_FragColor = vec4(col, a);
}
