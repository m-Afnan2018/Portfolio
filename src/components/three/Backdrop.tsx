"use client";

/** Full-screen gradient + the restrained synthwave grid floor (hero only). */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gridVert from "@/shaders/grid.vert.glsl";
import gridFrag from "@/shaders/grid.frag.glsl";
import { corePose } from "./corePose";
import { scrollState } from "@/hooks/useScrollStore";
import type { ScenePalette } from "./palette";

export function Backdrop({ palette }: { palette: ScenePalette }) {
  const grid = useRef<THREE.Mesh>(null);
  const gridMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: gridVert,
        fragmentShader: gridFrag,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color() }, uOpacity: { value: 0 }, uTime: { value: 0 } },
      }),
    [],
  );
  const bgMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        depthTest: false,
        uniforms: { uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uGlow: { value: new THREE.Color() } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }`,
        fragmentShader: `
          varying vec2 vUv; uniform vec3 uA; uniform vec3 uB; uniform vec3 uGlow;
          void main(){
            vec3 c = mix(uB, uA, smoothstep(0.0, 1.0, vUv.y));
            float g = smoothstep(0.9, 0.0, distance(vUv, vec2(0.72, 0.55)));
            c += uGlow * g * 0.06;
            gl_FragColor = vec4(c, 1.0);
          }`,
      }),
    [],
  );

  gridMat.uniforms.uColor.value.copy(palette.line);
  bgMat.uniforms.uA.value.copy(palette.bg);
  bgMat.uniforms.uB.value.copy(palette.bg2);
  bgMat.uniforms.uGlow.value.copy(palette.a);

  useFrame((_, dt) => {
    gridMat.uniforms.uTime.value += dt;
    // visible during boot + hero, fades out as soon as the journey begins
    const heroOnly = THREE.MathUtils.clamp(1 - (corePose.scene - 1) * 2.5, 0, 1);
    gridMat.uniforms.uOpacity.value = heroOnly * (palette.additive ? 0.18 : 0.14) * Math.max(0.3, scrollState.intro);
    grid.current!.visible = heroOnly > 0.001;
  });

  return (
    <>
      <mesh renderOrder={-10} frustumCulled={false} material={bgMat}>
        <planeGeometry args={[2, 2]} />
      </mesh>
      <mesh ref={grid} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} material={gridMat}>
        <planeGeometry args={[60, 60]} />
      </mesh>
    </>
  );
}
