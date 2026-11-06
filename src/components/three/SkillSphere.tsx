"use client";

/**
 * SkillSphere.tsx — tech labels orbiting the Core's sphere form.
 * Sprites always face the camera (billboards). Drag anywhere on empty space
 * in the Skills section to spin it; hovering a dependency in the DOM
 * highlights its sprite here (via `hoveredSkill` in the store).
 */
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { allSkills } from "@/data/skills";
import { corePose } from "./corePose";
import { sceneWeight } from "./CoreTargets";
import { scrollState, useScrollStore } from "@/hooks/useScrollStore";
import { isInteractive } from "@/lib/utils";
import type { ScenePalette } from "./palette";

function labelTexture(text: string, palette: ScenePalette) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  ctx.font = "600 44px ui-monospace, 'JetBrains Mono', monospace";
  const w = Math.ceil(ctx.measureText(text).width) + 56;
  c.width = w;
  c.height = 84;
  const dark = palette.additive;
  ctx.fillStyle = dark ? "rgba(11,16,32,0.85)" : "rgba(248,245,238,0.92)";
  ctx.strokeStyle = dark ? "rgba(34,211,238,0.75)" : "rgba(29,78,216,0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(2, 2, w - 4, 80, 10);
  ctx.fill();
  ctx.stroke();
  ctx.font = "600 44px ui-monospace, 'JetBrains Mono', monospace";
  ctx.fillStyle = dark ? "#e5e7eb" : "#0f1d3d";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 28, 44);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: w / 84 };
}

export function SkillSphere({ palette }: { palette: ScenePalette }) {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef<string | null>(null);

  const items = useMemo(() => {
    const n = allSkills.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    return allSkills.map((skill, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const pos = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(2.45);
      const { tex, aspect } = labelTexture(skill.short, palette);
      const material = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false });
      return { skill, pos, material, aspect };
    });
  }, [palette]);

  useEffect(
    () => () =>
      items.forEach((it) => {
        it.material.map?.dispose();
        it.material.dispose();
      }),
    [items],
  );

  useEffect(() => useScrollStore.subscribe((s) => (hovered.current = s.hoveredSkill)), []);

  // drag-to-rotate on empty space while the Skills section is active
  useEffect(() => {
    let dragging = false;
    let lx = 0;
    let ly = 0;
    const down = (e: PointerEvent) => {
      if (useScrollStore.getState().activeSection !== "skills") return;
      if (isInteractive(e.target as Element) || (e.target as Element).closest("[data-no-drag]")) return;
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      document.documentElement.dataset.dragging = "true";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      scrollState.drag.vy = (e.clientX - lx) * 0.006;
      scrollState.drag.vx = (e.clientY - ly) * 0.004;
      lx = e.clientX;
      ly = e.clientY;
    };
    const up = () => {
      dragging = false;
      delete document.documentElement.dataset.dragging;
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  useFrame((_, dt) => {
    const w = sceneWeight(corePose.scene, 3, 0.6);
    const g = group.current!;
    g.visible = w > 0.01;
    const drag = scrollState.drag;
    drag.y += drag.vy;
    drag.x = THREE.MathUtils.clamp(drag.x + drag.vx, -0.9, 0.9);
    drag.vx *= 0.92;
    drag.vy *= 0.94;
    g.rotation.set(drag.x, drag.y, 0);
    if (!g.visible) return;
    g.children.forEach((child, i) => {
      const it = items[i];
      const active = hovered.current === it.skill.name;
      const sprite = child as THREE.Sprite;
      const targetScale = active ? 0.4 : 0.19;
      const cur = sprite.scale.y + (targetScale - sprite.scale.y) * Math.min(1, dt * 10);
      sprite.scale.set(cur * it.aspect, cur, 1);
      it.material.opacity = w * (active ? 1 : hovered.current ? 0.3 : 0.85);
    });
  });

  return (
    <group ref={group}>
      {items.map((it) => (
        <sprite key={it.skill.name} position={it.pos} material={it.material} scale={[0.24 * it.aspect, 0.24, 1]} />
      ))}
    </group>
  );
}
