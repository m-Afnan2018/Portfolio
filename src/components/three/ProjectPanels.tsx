"use client";

/**
 * ProjectPanels.tsx — featured project screenshots on the Core's monitor
 * form. Panels tilt toward the cursor; clicking one (on empty page space —
 * DOM cards win) opens the project modal.
 */
import { Suspense, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { featuredProjects } from "@/data/projects";
import { corePose } from "./corePose";
import { MONITORS, sceneWeight } from "./CoreTargets";
import { scrollState, useScrollStore } from "@/hooks/useScrollStore";
import { isInteractive } from "@/lib/utils";
import type { ScenePalette } from "./palette";

function Panels({ palette }: { palette: ScenePalette }) {
  const list = featuredProjects.slice(0, MONITORS.length);
  const textures = useTexture(list.map((p) => p.image));
  const group = useRef<THREE.Group>(null);
  const materials = useMemo(
    () =>
      textures.map((t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        return new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, depthWrite: false });
      }),
    [textures],
  );

  useFrame((_, dt) => {
    const archive = THREE.MathUtils.smoothstep(scrollState.local.projects ?? 0, 0.45, 0.6);
    const w = sceneWeight(corePose.scene, 5, 0.55) * (1 - archive * 0.85);
    const g = group.current!;
    g.visible = w > 0.01;
    if (!g.visible) return;
    g.children.forEach((child, i) => {
      const m = MONITORS[i];
      const tx = -scrollState.pointer.y * 0.12;
      const ty = m.rotY + scrollState.pointer.x * 0.18;
      child.rotation.x += (tx - child.rotation.x) * Math.min(1, dt * 4);
      child.rotation.y += (ty - child.rotation.y) * Math.min(1, dt * 4);
      materials[i].opacity = w * (palette.additive ? 0.85 : 0.95);
    });
  });

  const open = (slug: string) => (e: ThreeEvent<MouseEvent>) => {
    if (isInteractive(e.nativeEvent.target as Element)) return;
    if (useScrollStore.getState().activeSection !== "projects") return;
    e.stopPropagation();
    useScrollStore.getState().set({ modalSlug: slug });
  };

  return (
    <group ref={group}>
      {list.map((p, i) => {
        const m = MONITORS[i];
        return (
          <mesh
            key={p.slug}
            position={[m.pos[0], m.pos[1], m.pos[2] + 0.03]}
            rotation={[0, m.rotY, 0]}
            material={materials[i]}
            onClick={open(p.slug)}
            onPointerOver={() => (document.documentElement.dataset.hover3d = "open")}
            onPointerOut={() => delete document.documentElement.dataset.hover3d}
          >
            <planeGeometry args={[m.w, m.h]} />
          </mesh>
        );
      })}
    </group>
  );
}

export function ProjectPanels({ palette }: { palette: ScenePalette }) {
  return (
    <Suspense fallback={null}>
      <Panels palette={palette} />
    </Suspense>
  );
}
