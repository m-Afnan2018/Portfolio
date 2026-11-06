"use client";

/**
 * Layers.tsx — solid / wireframe companions that fade in around the particle
 * Core for specific sections, adding depth and detail the points alone can't.
 */
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { corePose } from "./corePose";
import { DISH_AXIS, DISH_CENTER, HELIX_NODES, LAPTOP, helixPoint, sceneWeight } from "./CoreTargets";
import { scrollState } from "@/hooks/useScrollStore";
import type { ScenePalette } from "./palette";

// ─── hero: wireframe icosahedron + inner glow ───────────────────────────────
function HeroShell({ palette }: { palette: ScenePalette }) {
  const wire = useRef<THREE.LineSegments>(null);
  const inner = useRef<THREE.Mesh>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.72, 1)), []);
  useFrame((state, dt) => {
    const w = sceneWeight(corePose.scene, 1, 0.6) * scrollState.intro;
    const blink = Math.floor(state.clock.elapsedTime / 0.53) % 2 === 0 ? 1 : 0.55;
    const m = wire.current!.material as THREE.LineBasicMaterial;
    m.opacity = w * 0.14 * blink;
    wire.current!.visible = w > 0.01;
    wire.current!.rotation.y -= dt * 0.08;
    const im = inner.current!.material as THREE.MeshBasicMaterial;
    im.opacity = w * (palette.additive ? 0.06 : 0.04) * (0.8 + blink * 0.2);
    inner.current!.visible = w > 0.01;
  });
  return (
    <group>
      <lineSegments ref={wire} geometry={edges}>
        <lineBasicMaterial color={palette.line} transparent depthWrite={false} />
      </lineSegments>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.7, 2]} />
        <meshBasicMaterial
          color={palette.a}
          transparent
          depthWrite={false}
          blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}

// ─── about: laptop screen with live-typing code (CanvasTexture) ─────────────
const SCREEN_CODE = [
  "const afnan: Developer = {",
  "  role: 'full-stack + devops',",
  "  stack: ['next', 'node', 'mongo'],",
  "  infra: ['docker', 'nginx', 'aws'],",
  "  sitesManaged: 20,",
  "  ships: () => 'to production',",
  "};",
  "",
  "await afnan.build(yourIdea);",
  "await afnan.deploy({ ssl: true });",
  "// ✓ live in 42s",
];

function LaptopScreen({ palette }: { palette: ScenePalette }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { canvas, ctx, texture } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 390;
    const ctx = canvas.getContext("2d")!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return { canvas, ctx, texture };
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  const typed = useRef({ chars: 0, acc: 0 });

  useFrame((state, dt) => {
    const w = sceneWeight(corePose.scene, 2, 0.55);
    mesh.current!.visible = w > 0.01;
    (mesh.current!.material as THREE.MeshBasicMaterial).opacity = w;
    if (w < 0.01) return;
    const t = typed.current;
    t.acc += dt;
    if (t.acc < 0.045) return;
    t.acc = 0;
    const total = SCREEN_CODE.join("\n").length;
    t.chars = t.chars >= total + 40 ? 0 : t.chars + 1;

    const dark = palette.additive;
    ctx.fillStyle = dark ? "#070b17" : "#f8f5ee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // title bar
    ctx.fillStyle = dark ? "#0e1528" : "#e9e3d4";
    ctx.fillRect(0, 0, canvas.width, 30);
    ["#f87171", "#f59e0b", "#22c55e"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(18 + i * 18, 15, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = "13px ui-monospace, monospace";
    ctx.fillStyle = dark ? "#94a3b8" : "#3c4a6b";
    ctx.fillText("afnan.ts — ~/portfolio", 82, 19);

    ctx.font = "17px ui-monospace, monospace";
    let remaining = t.chars;
    SCREEN_CODE.forEach((line, i) => {
      const y = 62 + i * 29;
      ctx.fillStyle = dark ? "#475569" : "#8a93a8";
      ctx.fillText(String(i + 1).padStart(2, " "), 14, y);
      const shown = line.slice(0, Math.max(0, remaining));
      remaining -= line.length + 1;
      ctx.fillStyle = line.trim().startsWith("//")
        ? dark ? "#5b6b85" : "#6b7898"
        : line.includes("'")
          ? dark ? "#22c55e" : "#15803d"
          : dark ? "#e5e7eb" : "#0f1d3d";
      if (/^(const|await)/.test(line.trim())) ctx.fillStyle = dark ? "#a78bfa" : "#6d28d9";
      ctx.fillText(shown, 52, y);
      if (remaining < 0 && remaining > -line.length - 2 && Math.floor(state.clock.elapsedTime * 2) % 2 === 0) {
        const cw = ctx.measureText(shown).width;
        ctx.fillStyle = dark ? "#22d3ee" : "#1d4ed8";
        ctx.fillRect(54 + cw, y - 15, 9, 19);
      }
    });
    texture.needsUpdate = true;
  });

  const { base, lid, screen, offsetY } = LAPTOP;
  return (
    <group position={[0, offsetY, -base.d / 2]} rotation={[lid.tilt, 0, 0]}>
      <mesh ref={mesh} position={[0, lid.h / 2, lid.d / 2 + 0.006]}>
        <planeGeometry args={[screen.w, screen.h]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ─── experience: commit nodes that light up as the camera flies past ───────
function ExperienceNodes({ palette }: { palette: ScenePalette }) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const nodes = useMemo(() => HELIX_NODES.map((y) => helixPoint(y, 0).clone()), []);
  const wp = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const w = sceneWeight(corePose.scene, 4, 0.6);
    group.current!.visible = w > 0.01;
    if (w < 0.01) return;
    group.current!.children.forEach((child, i) => {
      child.getWorldPosition(wp);
      const near = THREE.MathUtils.smoothstep(1.4 - Math.abs(wp.y - camera.position.y), 0, 1.4);
      const passed = (scrollState.local.experience ?? 0) > (i + 0.5) / nodes.length ? 0.35 : 0;
      const lit = Math.max(near, passed);
      const mesh = child as THREE.Mesh;
      (mesh.material as THREE.MeshBasicMaterial).opacity = w * (0.25 + lit * 0.75);
      mesh.scale.setScalar(0.6 + lit * 0.8);
    });
  });
  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshBasicMaterial
            color={i === 0 ? palette.c : palette.a}
            transparent
            depthWrite={false}
            toneMapped={false}
            blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── achievements: wireframe torus knot ─────────────────────────────────────
function TrophyWire({ palette }: { palette: ScenePalette }) {
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => new THREE.WireframeGeometry(new THREE.TorusKnotGeometry(1.25, 0.36, 90, 8)), []);
  useFrame((_, dt) => {
    const w = sceneWeight(corePose.scene, 7, 0.6);
    ref.current!.visible = w > 0.01;
    (ref.current!.material as THREE.LineBasicMaterial).opacity = w * 0.07 * (1 + scrollState.burst * 3);
    ref.current!.rotation.z += dt * 0.1;
  });
  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color={palette.b} transparent depthWrite={false} />
    </lineSegments>
  );
}

// ─── contact: antenna signal rings ──────────────────────────────────────────
function AntennaPulse({ palette }: { palette: ScenePalette }) {
  const group = useRef<THREE.Group>(null);
  const pose = useMemo(() => {
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), DISH_AXIS);
    const p = DISH_CENTER.clone().addScaledVector(DISH_AXIS, 0.5);
    return { q, p };
  }, []);
  useFrame((state) => {
    const w = sceneWeight(corePose.scene, 8, 0.6);
    group.current!.visible = w > 0.01;
    if (w < 0.01) return;
    const t = state.clock.elapsedTime;
    group.current!.children.forEach((child, i) => {
      // idle ping every ~2.4 s, plus a big burst when the form sends
      const phase = ((t * 0.42 + i / 3) % 1 + 1) % 1;
      const burst = scrollState.pulse;
      const mesh = child as THREE.Mesh;
      mesh.scale.setScalar(0.3 + phase * (1.8 + burst * 4));
      (mesh.material as THREE.MeshBasicMaterial).opacity = w * (1 - phase) * (0.35 + burst * 0.65);
    });
  });
  return (
    <group ref={group} position={pose.p} quaternion={pose.q}>
      {[0, 1, 2].map((i) => (
        <mesh key={i}>
          <ringGeometry args={[0.48, 0.5, 64]} />
          <meshBasicMaterial
            color={palette.c}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
            blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Layers({ palette }: { palette: ScenePalette }) {
  return (
    <>
      <HeroShell palette={palette} />
      <LaptopScreen palette={palette} />
      <ExperienceNodes palette={palette} />
      <TrophyWire palette={palette} />
      <AntennaPulse palette={palette} />
    </>
  );
}
