"use client";

/**
 * HoverPreview — a cursor-following project image rendered with a tiny raw
 * WebGL program: liquid displacement + RGB split, both driven by how fast
 * the cursor moves. Triggered by `showPreview(src)` / `hidePreview()`.
 */
import { useEffect, useRef } from "react";
import { useReducedMotionFlag } from "@/hooks/useScrollStore";

type Listener = (src: string | null) => void;
const listeners = new Set<Listener>();
export const showPreview = (src: string) => listeners.forEach((l) => l(src));
export const hidePreview = () => listeners.forEach((l) => l(null));

const VERT = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uVel;
uniform float uTime;
uniform float uAlpha;
void main(){
  vec2 uv = vUv;
  float speed = length(uVel);
  // liquid displacement: travelling waves, stronger with cursor speed
  uv.x += sin(uv.y * 12.0 + uTime * 3.0) * 0.012 * (0.3 + speed * 6.0);
  uv.y += cos(uv.x * 10.0 + uTime * 2.4) * 0.01 * (0.3 + speed * 6.0);
  // reveal: a wobbly mask that grows with uAlpha
  float edge = smoothstep(uAlpha * 1.4 - 0.2, uAlpha * 1.4, distance(vUv, vec2(0.5)) + sin(vUv.x * 18.0 + uTime) * 0.03);
  vec2 shift = uVel * 0.06 + vec2(0.003);
  float r = texture2D(uTex, uv + shift).r;
  float g = texture2D(uTex, uv).g;
  float b = texture2D(uTex, uv - shift).b;
  gl_FragColor = vec4(r, g, b, 1.0) * (1.0 - edge);
}`;

export function HoverPreview() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionFlag();

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const c = canvas.current!;
    const gl = c.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) return;
    const W = 360;
    const H = 225;
    const dpr = Math.min(2, window.devicePixelRatio);
    c.width = W * dpr;
    c.height = H * dpr;
    c.style.width = `${W}px`;
    c.style.height = `${H}px`;
    gl.viewport(0, 0, c.width, c.height);

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uVel = gl.getUniformLocation(prog, "uVel");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uAlpha = gl.getUniformLocation(prog, "uAlpha");
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    const cache = new Map<string, HTMLImageElement>();
    let target = 0;
    let alpha = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let x = mx;
    let y = my;
    let vx = 0;
    let vy = 0;
    let raf = 0;
    let t = 0;

    const upload = (img: HTMLImageElement) => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };
    const onPreview: Listener = (src) => {
      if (!src) return void (target = 0);
      let img = cache.get(src);
      if (!img) {
        img = new Image();
        img.src = src;
        cache.set(src, img);
      }
      const ready = img;
      if (ready.complete) upload(ready);
      else ready.onload = () => upload(ready);
      target = 1;
    };
    listeners.add(onPreview);

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const loop = () => {
      raf = requestAnimationFrame(loop);
      t += 0.016;
      alpha += (target - alpha) * 0.12;
      const k = reduced ? 1 : 0.14;
      const nx = x + (mx - x) * k;
      const ny = y + (my - y) * k;
      vx += ((nx - x) / W - vx) * 0.2;
      vy += ((ny - y) / H - vy) * 0.2;
      x = nx;
      y = ny;
      c.style.transform = `translate3d(${x + 28}px, ${y - H / 2}px, 0) rotate(${vx * 20}deg)`;
      c.style.opacity = alpha > 0.01 ? "1" : "0";
      if (alpha < 0.005) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uVel, reduced ? 0 : vx, reduced ? 0 : vy);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uAlpha, alpha);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      listeners.delete(onPreview);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[55] rounded-[8px] opacity-0" />;
}
