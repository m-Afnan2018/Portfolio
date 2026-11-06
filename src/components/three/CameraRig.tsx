"use client";

/**
 * CameraRig.tsx — the camera follows the Core's timeline (distance), adds
 * pointer parallax, and during Experience flies down along the git helix.
 */
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { corePose } from "./corePose";
import { sceneWeight } from "./CoreTargets";
import { scrollState } from "@/hooks/useScrollStore";

export function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const cur = useRef({ x: 0, y: 0, z: 8, ly: 0 });

  useFrame((_, dt) => {
    const d = Math.min(dt, 1 / 20);
    const c = cur.current;
    const expW = reduced ? 0 : sceneWeight(corePose.scene, 4, 0.9);
    const exp = scrollState.local.experience ?? 0;
    // fly from the newest commit (top) to the oldest (bottom)
    const flightY = THREE.MathUtils.lerp(2.3, -2.3, THREE.MathUtils.smoothstep(exp, 0.05, 0.95)) * expW;

    const par = reduced ? 0 : 0.35;
    const tx = scrollState.pointer.x * par;
    const ty = scrollState.pointer.y * par * 0.6 + flightY;
    const tz = reduced ? 8 : corePose.camZ - expW * 1.2;

    const k = Math.min(1, d * 3);
    c.x += (tx - c.x) * k;
    c.y += (ty - c.y) * k;
    c.z += (tz - c.z) * k;
    c.ly += (flightY * 0.9 - c.ly) * k;

    camera.position.set(c.x, c.y, c.z);
    look.set(expW * corePose.x * 0.25, c.ly, 0);
    camera.lookAt(look);
  });

  return null;
}
