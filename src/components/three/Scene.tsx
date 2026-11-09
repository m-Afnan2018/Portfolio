"use client";

/**
 * Scene.tsx — the one <Canvas>. Fixed behind the DOM (pointer-events: none),
 * but R3F listens on the app root via `eventSource`, so 3D objects can still
 * be hovered / clicked through empty page space.
 */
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Core } from "./Core";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { Backdrop } from "./Backdrop";
import { scenePalette } from "./palette";
import { useScrollStore, useReducedMotionFlag } from "@/hooks/useScrollStore";
import { reportProgress } from "@/lib/loadProgress";

function ReadyReporter() {
  let frames = 0;
  useFrame(() => {
    frames++;
    if (frames === 3) reportProgress("scene", 1);
  });
  return null;
}

/** Below lg the page stacks into one column — there is no free side for the Core. */
const STACKED_MQ = "(max-width: 1023px)";
const subscribeStacked = (cb: () => void) => {
  const mq = window.matchMedia(STACKED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getStacked = () => window.matchMedia(STACKED_MQ).matches;

export default function Scene() {
  const theme = useScrollStore((s) => s.theme);
  const gpuTier = useScrollStore((s) => s.gpuTier);
  const isMobile = useScrollStore((s) => s.isMobile);
  const reduced = useReducedMotionFlag();
  // a version switch is playing over the canvas: stop rendering, free the GPU for it
  const leaving = useScrollStore((s) => s.checkout !== null);
  const stacked = useSyncExternalStore(subscribeStacked, getStacked, () => false);
  const [visible, setVisible] = useState(true);
  // Scene is client-only (next/dynamic, ssr:false) and mounts after #app-root exists.
  const [eventSource] = useState<HTMLElement | undefined>(() => document.getElementById("app-root") ?? undefined);

  const lowTier = gpuTier === "low";
  const count = lowTier ? 4200 : 12000;
  const palette = useMemo(() => scenePalette(theme), [theme]);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    // texture progress → loader
    const mgr = THREE.DefaultLoadingManager;
    mgr.onProgress = (_url, loaded, total) => reportProgress("textures", total ? loaded / total : 1);
    mgr.onLoad = () => reportProgress("textures", 1);
    const t = setTimeout(() => reportProgress("textures", 1), 6000); // never block the loader on a slow image
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      clearTimeout(t);
    };
  }, []);

  if (gpuTier === "unknown" || !eventSource) return null;

  return (
    <Canvas
      aria-hidden
      eventSource={eventSource}
      eventPrefix="client"
      frameloop={visible && !leaving ? "always" : "never"}
      dpr={[1, lowTier ? 1.25 : 1.75]}
      camera={{ position: [0, 0, 8], fov: 40, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <color attach="background" args={[palette.bg]} />
      <Backdrop palette={palette} />
      <Core count={count} palette={palette} isMobile={isMobile || stacked} reduced={reduced} lowTier={lowTier} />
      <CameraRig reduced={reduced} />
      {!lowTier && <Effects dark={palette.additive} />}
      <ReadyReporter />
    </Canvas>
  );
}
