"use client";

/**
 * InfraRacks.tsx — pipeline nodes above the Core's server-rack form, joined
 * by a line that data packets travel along. Packet position is driven by the
 * same scroll progress as the DOM pipeline diagram, so the 3D and the HTML
 * tick green together: GitHub → Actions → Docker → Deploy → Nginx → Live.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pipeline } from "@/data/infra";
import { corePose } from "./corePose";
import { RACKS, sceneWeight } from "./CoreTargets";
import { scrollState } from "@/hooks/useScrollStore";
import { pipelineProgress } from "@/lib/pipeline";
import type { ScenePalette } from "./palette";

const PACKETS = 5;

export function InfraRacks({ palette }: { palette: ScenePalette }) {
  const group = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Group>(null);
  const packetsRef = useRef<THREE.Group>(null);
  const ledsRef = useRef<THREE.InstancedMesh>(null);

  const { points, curve, line } = useMemo(() => {
    const n = pipeline.length;
    const pts = pipeline.map((_, i) => {
      const t = i / (n - 1);
      const x = -1.6 + t * 3.2;
      return new THREE.Vector3(x, 1.4 + Math.sin(t * Math.PI) * 0.15, 0.65);
    });
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(120));
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ transparent: true, depthWrite: false }));
    return { points: pts, curve, line };
  }, []);
  (line.material as THREE.LineBasicMaterial).color.copy(palette.a);

  // blinking server LEDs on each rack slot
  const leds = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (const r of RACKS)
      for (let s = 0; s < 9; s++) arr.push(new THREE.Vector3(r.x + r.w / 2 - 0.14, -r.h / 2 + 0.2 + s * 0.23 + 0.06, r.d / 2 + 0.02));
    return arr;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorOn = useMemo(() => palette.c.clone(), [palette]);
  const colorOff = useMemo(() => palette.a.clone().multiplyScalar(0.25), [palette]);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const w = sceneWeight(corePose.scene, 6, 0.6) * corePose.opacity;
    const g = group.current!;
    g.visible = w > 0.01;
    if (!g.visible) return;
    const p = pipelineProgress(scrollState.local.infra ?? 0); // 0 … stages-1
    const t = state.clock.elapsedTime;

    nodesRef.current!.children.forEach((child, i) => {
      const lit = p >= i - 0.02 ? 1 : 0;
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.color.copy(lit ? palette.c : palette.a);
      mat.opacity = w * (lit ? 0.9 : 0.2);
      mesh.rotation.y = t * 0.6 + i;
      mesh.rotation.x = t * 0.4;
      const s = lit ? 1 + Math.max(0, 1 - Math.abs(p - i) * 3) * 0.3 : 0.8;
      mesh.scale.setScalar(s);
    });

    const head = p / (pipeline.length - 1);
    packetsRef.current!.children.forEach((child, i) => {
      // packets trail behind the head; once Live, they loop the whole line
      const live = p >= pipeline.length - 1.02;
      const u = live ? (t * 0.25 + i / PACKETS) % 1 : Math.max(0, head - i * 0.035);
      child.position.copy(curve.getPointAt(Math.min(0.999, u)));
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = w * (head > 0.001 || live ? 1 - i / (PACKETS + 1) : 0);
    });

    const inst = ledsRef.current!;
    leds.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      const on = Math.sin(t * (2 + (i % 5)) + i * 1.7) > 0.2 - p * 0.15;
      inst.setColorAt(i, tmpColor.copy(on ? colorOn : colorOff));
    });
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    (inst.material as THREE.MeshBasicMaterial).opacity = w;
    (line.material as THREE.LineBasicMaterial).opacity = w * 0.3;
  });
  const blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <group ref={group}>
      <primitive object={line} />
      <group ref={nodesRef}>
        {points.map((pt, i) => (
          <mesh key={i} position={pt}>
            <boxGeometry args={[0.14, 0.14, 0.14]} />
            <meshBasicMaterial transparent depthWrite={false} toneMapped={false} wireframe={i % 2 === 1} blending={blending} />
          </mesh>
        ))}
      </group>
      <group ref={packetsRef}>
        {Array.from({ length: PACKETS }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.055 - i * 0.006, 12, 12]} />
            <meshBasicMaterial color={palette.c} transparent depthWrite={false} toneMapped={false} blending={blending} />
          </mesh>
        ))}
      </group>
      <instancedMesh ref={ledsRef} args={[undefined, undefined, leds.length]}>
        <boxGeometry args={[0.07, 0.035, 0.01]} />
        <meshBasicMaterial transparent depthWrite={false} toneMapped={false} blending={blending} />
      </instancedMesh>
    </group>
  );
}
