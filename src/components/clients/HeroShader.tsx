"use client";

/**
 * HeroShader — the living background of the /work-with-me hero.
 *
 * A single full-screen fragment shader (raw WebGL, no three.js): domain-warped
 * noise flowing in the page's navy → royal → sky → cyan range, with a soft
 * light that follows the pointer. Rendered at reduced resolution and paused
 * whenever the hero is off-screen or the tab is hidden. Reduced motion → one
 * still frame. No WebGL → the CSS gradient underneath simply shows.
 */
import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uFade;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 m = vec2(uMouse.x * asp, uMouse.y);
  float t = uTime * 0.05;

  // pointer gently bends the flow around it
  vec2 toM = p - m;
  float pull = exp(-dot(toM, toM) * 3.0);
  p += toM * pull * 0.18;

  vec2 q = vec2(fbm(p * 1.5 + vec2(0.0, t)), fbm(p * 1.5 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.3 + 2.0 * q + vec2(1.7, 9.2) + t * 1.4),
                fbm(p * 1.3 + 2.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.1 + 2.4 * r);

  vec3 ink   = vec3(0.043, 0.067, 0.125);   // --cl-ink #0b1120
  vec3 deep  = vec3(0.063, 0.122, 0.329);   // #101f54
  vec3 royal = vec3(0.145, 0.388, 0.922);   // #2563eb
  vec3 sky   = vec3(0.220, 0.741, 0.973);   // #38bdf8
  vec3 cyan  = vec3(0.133, 0.827, 0.933);   // #22d3ee

  vec3 col = ink;
  col = mix(col, deep, smoothstep(0.25, 0.6, f));
  col = mix(col, royal, smoothstep(0.5, 0.85, f) * 0.75);
  col = mix(col, sky, smoothstep(0.72, 1.0, f) * 0.55);
  col += cyan * 0.12 * pow(clamp(r.y, 0.0, 1.0), 4.0);

  // light under the pointer
  col += mix(royal, sky, 0.5) * pull * 0.22 * (0.4 + f);

  // keep the text side (left / bottom) calmer and readable
  float calm = smoothstep(0.0, 1.0, uv.x * 0.9 + uv.y * 0.35);
  col = mix(ink, col, 0.35 + 0.65 * calm);
  col = mix(col, ink, smoothstep(0.22, 0.0, uv.y));

  // film grain
  col += (hash(gl_FragCoord.xy + fract(uTime * 7.0)) - 0.5) * 0.03;

  gl_FragColor = vec4(mix(ink, col, uFade), 1.0);
}
`;

export function HeroShader({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const gl = c.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    // a lost / missing context paints nothing useful — hide it so the CSS gradient shows
    const hide = () => {
      c.style.visibility = "hidden";
    };
    if (!gl || gl.isContextLost()) {
      hide();
      return;
    }
    c.style.visibility = "";
    c.addEventListener("webglcontextlost", hide);

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      hide();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uFade = gl.getUniformLocation(prog, "uFade");

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // render below native resolution — the image is soft by design
    const scale = Math.min(devicePixelRatio, 1.5) * (innerWidth < 768 ? 0.4 : 0.55);
    const resize = () => {
      c.width = Math.max(1, Math.round(c.clientWidth * scale));
      c.height = Math.max(1, Math.round(c.clientHeight * scale));
      gl.viewport(0, 0, c.width, c.height);
      gl.uniform2f(uRes, c.width, c.height);
      if (!raf) draw(performance.now());
    };

    const mouse = { x: 0.72, y: 0.62, tx: 0.72, ty: 0.62 };
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };

    let fade = reduced ? 1 : 0;
    const t0 = performance.now() - 20000; // start mid-flow, not at a seed pattern
    function draw(now: number) {
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      fade = Math.min(1, fade + 0.012);
      gl!.uniform1f(uTime, (now - t0) / 1000);
      gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.uniform1f(uFade, fade);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    let raf = 0;
    let visible = true;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && visible && !document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(c);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      c.removeEventListener("webglcontextlost", hide);
      // free GPU objects but keep the context: React may mount this canvas again
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className={className} />;
}
