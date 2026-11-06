"use client";

/**
 * Core.tsx — the single persistent 3D object of the site.
 *
 * A THREE.Points cloud whose particles morph between the shapes defined in
 * CoreTargets.ts. Scroll position → continuous scene index (useLenis.ts) →
 *   • a paused GSAP master timeline that tweens placement (position, scale,
 *     tilt, opacity, camera distance) between per-section states, and
 *   • the morph uniforms: floor(scene) is the shape we leave, ceil(scene) the
 *     shape we fly to, fract(scene) the morph progress.
 */
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import vertexShader from "@/shaders/core.vert.glsl";
import fragmentShader from "@/shaders/core.frag.glsl";
import { buildTargets, DESKTOP_STATES, MOBILE_STATES, sceneWeight } from "./CoreTargets";
import { corePose } from "./corePose";
import { scrollState } from "@/hooks/useScrollStore";
import { clamp, smoothstep } from "@/lib/utils";
import type { ScenePalette } from "./palette";
import { Layers } from "./Layers";
import { SkillSphere } from "./SkillSphere";
import { ProjectPanels } from "./ProjectPanels";
import { InfraRacks } from "./InfraRacks";

const LAST_SCENE = 8;
const TAU = Math.PI * 2;

interface CoreProps {
  count: number;
  palette: ScenePalette;
  isMobile: boolean;
  reduced: boolean;
  lowTier: boolean;
}

export function Core({ count, palette, isMobile, reduced, lowTier }: CoreProps) {
  const outer = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { camera, size } = useThree();

  // Sample every shape once (≈ 30–60 ms for 12k points × 9 shapes).
  const targets = useMemo(() => buildTargets(count), [count]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const rand = new Float32Array(count * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
    g.setAttribute("position", new THREE.BufferAttribute(targets[1].slice(), 3));
    g.setAttribute("aFrom", new THREE.BufferAttribute(targets[1].slice(), 3));
    g.setAttribute("aTo", new THREE.BufferAttribute(targets[2].slice(), 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(targets[0], 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
    return g;
  }, [count, targets]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uIntro: { value: 0 },
          uVelocity: { value: 0 },
          uBurst: { value: 0 },
          uSize: { value: 1 },
          uPixelRatio: { value: 1 },
          uPulse: { value: 0 },
          uSwarm: { value: 0.6 },
          uPointer: { value: new THREE.Vector3(99, 99, 99) },
          uColorA: { value: new THREE.Color() },
          uColorB: { value: new THREE.Color() },
          uColorC: { value: new THREE.Color() },
          uOpacity: { value: 1 },
          uAdditive: { value: 1 },
        },
      }),
    [],
  );

  // theme → uniforms & blending
  useEffect(() => {
    const u = material.uniforms;
    u.uColorA.value.copy(palette.a);
    u.uColorB.value.copy(palette.b);
    u.uColorC.value.copy(palette.c);
    u.uAdditive.value = palette.additive ? 1 : 0;
    material.blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.needsUpdate = true;
  }, [material, palette]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  // GSAP master timeline: one tween per section → section transition.
  const timeline = useMemo(() => {
    const states = isMobile ? MOBILE_STATES : DESKTOP_STATES;
    Object.assign(corePose, states[1]);
    const tl = gsap.timeline({ paused: true });
    for (let i = 1; i < LAST_SCENE; i++) {
      tl.to(corePose, { ...states[i + 1], duration: 1, ease: "power2.inOut" }, i - 1);
    }
    return tl;
  }, [isMobile]);
  useEffect(() => () => void timeline.kill(), [timeline]);

  const st = useRef({ scene: 1, from: 1, to: 2, angle: 0, follow: new THREE.Vector2(), pulse: 0 });
  const tmp = useMemo(
    () => ({ ray: new THREE.Raycaster(), plane: new THREE.Plane(), v: new THREE.Vector3(), n: new THREE.Vector3() }),
    [],
  );

  const swapTargets = (from: number, to: number) => {
    const aFrom = geometry.getAttribute("aFrom") as THREE.BufferAttribute;
    const aTo = geometry.getAttribute("aTo") as THREE.BufferAttribute;
    (aFrom.array as Float32Array).set(targets[from]);
    (aTo.array as Float32Array).set(targets[to]);
    aFrom.needsUpdate = true;
    aTo.needsUpdate = true;
  };

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 20); // for motion that should not jump
    const dReal = Math.min(dt, 0.25); // for convergence: frame-rate independent
    const s = st.current;
    const u = material.uniforms;

    // smoothed scene index (reduced motion → stay on the hero core)
    const target = reduced ? 1 : clamp(scrollState.scene, 1, LAST_SCENE);
    s.scene += (target - s.scene) * (1 - Math.exp(-dReal * 4));
    if (Math.abs(target - s.scene) < 0.0005) s.scene = target;
    corePose.scene = s.scene;

    const from = Math.min(Math.floor(s.scene), LAST_SCENE - 1);
    const to = from + 1;
    if (from !== s.from || to !== s.to) {
      swapTargets(from, to);
      s.from = from;
      s.to = to;
    }

    // placement from the GSAP timeline
    timeline.seek(s.scene - 1, false);

    // skills: sphere slides right while the package.json panel scrolls in
    const skillsW = sceneWeight(s.scene, 3, 0.5);
    const shift = isMobile ? 0 : smoothstep(0.12, 0.4, scrollState.local.skills ?? 0) * skillsW;
    corePose.skillsShift = shift;

    const g = outer.current!;
    const fadeReduced = reduced ? 1 - smoothstep(0, 0.12, scrollState.progress) * 0.65 : 1;
    g.position.set(corePose.x + shift * 2.5, corePose.y, corePose.z);
    g.scale.setScalar(corePose.scale * (1 - shift * 0.3));

    // hero: follow the mouse with a lerp; everywhere: a gentle parallax
    const heroW = sceneWeight(s.scene, 1, 1);
    s.follow.x += (scrollState.pointer.x - s.follow.x) * Math.min(1, d * 3);
    s.follow.y += (scrollState.pointer.y - s.follow.y) * Math.min(1, d * 3);
    const followAmt = 0.12 + heroW * 0.3;
    g.rotation.set(-s.follow.y * followAmt + corePose.tilt, s.follow.x * followAmt, 0);

    // auto-spin; when a section wants a fixed pose (spin 0) ease back to front
    const spin = reduced ? 0.06 : corePose.spin;
    s.angle += spin * d;
    if (spin < 0.02) {
      const nearest = Math.round(s.angle / TAU) * TAU;
      s.angle += (nearest - s.angle) * Math.min(1, d * 2.5);
    }
    spinner.current!.rotation.y = corePose.yaw + s.angle;

    // caret-blink pulse (1.06 s period, matches the CSS caret)
    const blink = Math.floor(state.clock.elapsedTime / 0.53) % 2 === 0 ? 1 : 0;
    s.pulse += (blink * heroW - s.pulse) * Math.min(1, d * 10);

    // pointer → Core-local space (for repulsion)
    tmp.ray.setFromCamera(new THREE.Vector2(scrollState.pointer.x, scrollState.pointer.y), camera);
    tmp.plane.setFromNormalAndCoplanarPoint(tmp.n.set(0, 0, 1), g.position);
    if (tmp.ray.ray.intersectPlane(tmp.plane, tmp.v)) {
      pointsRef.current!.worldToLocal(u.uPointer.value.copy(tmp.v));
    }

    const vel = clamp(scrollState.velocity / 45, -1, 1);
    u.uTime.value += d;
    u.uMorph.value = s.scene - from;
    u.uIntro.value = reduced ? 1 : scrollState.intro;
    u.uVelocity.value = reduced ? 0 : vel;
    u.uBurst.value = scrollState.burst;
    u.uPulse.value = s.pulse;
    u.uPixelRatio.value = state.viewport.dpr;
    u.uSize.value = (lowTier ? 2.6 : 2.0) * (size.width < 768 ? 0.9 : 1);
    u.uOpacity.value = corePose.opacity * fadeReduced;
  });

  return (
    <group ref={outer}>
      <group ref={spinner}>
        <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
        <Layers palette={palette} />
        <SkillSphere palette={palette} />
        <ProjectPanels palette={palette} />
        <InfraRacks palette={palette} />
      </group>
    </group>
  );
}
