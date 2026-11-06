"use client";

/**
 * AppShell — client root. Boots smooth scroll, GPU tiering and reduced-motion
 * sync, mounts the fixed 3D canvas behind everything, and the IDE chrome +
 * overlays (palette, terminal, cursor, modal…) above it.
 */
import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { useReducedMotionSync } from "@/hooks/useReducedMotion";
import { useGpuTier } from "@/hooks/useGpuTier";
import { useSmoothScroll } from "@/hooks/useLenis";
import { usePauseOffscreen } from "@/hooks/usePauseOffscreen";
import { useScrollStore, type Theme } from "@/hooks/useScrollStore";
import { skipScene } from "@/lib/loadProgress";
import { IdeTabs } from "@/components/ui/IdeTabs";
import { ActivityBar } from "@/components/ui/ActivityBar";
import { StatusBar } from "@/components/ui/StatusBar";
import { Minimap } from "@/components/ui/Minimap";
import { Cursor } from "@/components/ui/Cursor";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { HiddenTerminal } from "@/components/ui/HiddenTerminal";
import { MobileNav } from "@/components/ui/MobileNav";
import { CaseLauncher } from "@/components/case/CaseLauncher";
import { HoverPreview } from "@/components/ui/HoverPreview";
import { MatrixRain } from "@/components/ui/MatrixRain";
import { Toast } from "@/components/ui/Toast";
import { DevExtras } from "@/components/ui/DevExtras";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";
import { Loader } from "@/components/sections/Loader";
import { PersonaGate } from "@/components/ui/PersonaGate";
import { BranchSwitcher } from "@/components/ui/BranchSwitcher";

// The whole three.js / R3F bundle is code-split and client-only.
const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });

/** If WebGL is unavailable or the scene crashes, the DOM site carries on alone. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[scene] 3D disabled:", error);
    skipScene();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function AppShell({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionSync();
  useGpuTier();
  useSmoothScroll(reduced);
  usePauseOffscreen("#main section, #main footer");
  const set = useScrollStore((s) => s.set);
  const gpuReady = useScrollStore((s) => s.gpuTier) !== "unknown";

  // no WebGL (old phones, some privacy browsers): never mount the 3D bundle at all
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    set({ theme: (document.documentElement.dataset.theme as Theme) ?? "dark" });
    if (!hasWebGL()) {
      skipScene();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWebgl(false);
    }
  }, [set]);

  return (
    <div id="app-root" className="relative">
      <a
        href="#main"
        className="sr-only-focusable bg-primary text-bg fixed top-14 left-4 z-[100] rounded-[2px] px-4 py-2 font-mono text-sm"
      >
        skip to content
      </a>
      {gpuReady && webgl && (
        <SceneBoundary>
          <Scene />
        </SceneBoundary>
      )}
      <BlueprintGrid />
      <div aria-hidden className="grain" />
      <IdeTabs />
      <ActivityBar />
      <Minimap />
      <main id="main" className="relative z-10 pb-[26px]">
        {children}
      </main>
      <StatusBar />
      <MobileNav />
      <CommandPalette />
      <HiddenTerminal />
      <CaseLauncher />
      <HoverPreview />
      <MatrixRain />
      <Toast />
      <Cursor />
      <Loader />
      <PersonaGate />
      <BranchSwitcher />
      <DevExtras />
    </div>
  );
}
