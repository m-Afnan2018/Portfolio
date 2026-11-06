"use client";

/**
 * Effects.tsx — post-processing: bloom on bright (emissive) particles,
 * a hint of chromatic aberration during fast scroll, and a vignette
 * (film grain is a single static CSS layer — see .grain in globals.css). Disabled entirely on low-tier GPUs.
 */
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction, type ChromaticAberrationEffect } from "postprocessing";
import * as THREE from "three";
import { scrollState } from "@/hooks/useScrollStore";

export function Effects({ dark }: { dark: boolean }) {
  const ca = useRef<ChromaticAberrationEffect>(null);
  const offset = useRef(new THREE.Vector2(0, 0));

  useFrame(() => {
    const v = Math.min(1, Math.abs(scrollState.velocity) / 60);
    const target = v * 0.0015;
    offset.current.x += (target - offset.current.x) * 0.15;
    offset.current.y = offset.current.x * 0.6;
    if (ca.current) ca.current.offset.copy(offset.current);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={dark ? 0.6 : 0.2}
        luminanceThreshold={dark ? 0.5 : 0.9}
        luminanceSmoothing={0.2}
        radius={0.6}
      />
      <ChromaticAberration
        ref={ca}
        offset={offset.current}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette offset={0.32} darkness={dark ? 0.72 : 0.35} />
    </EffectComposer>
  );
}
