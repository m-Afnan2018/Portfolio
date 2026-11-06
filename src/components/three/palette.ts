import * as THREE from "three";
import type { Theme } from "@/hooks/useScrollStore";

/** Scene colours per theme — mirrors the CSS tokens in styles/globals.css. */
export function scenePalette(theme: Theme) {
  return theme === "light"
    ? {
        bg: new THREE.Color("#f1ece1"),
        bg2: new THREE.Color("#e4ddcc"),
        a: new THREE.Color("#1d4ed8"),
        b: new THREE.Color("#5b21b6"),
        c: new THREE.Color("#15803d"),
        line: new THREE.Color("#1d4ed8"),
        additive: false,
      }
    : {
        bg: new THREE.Color("#05070d"),
        bg2: new THREE.Color("#0b1020"),
        a: new THREE.Color("#22d3ee"),
        b: new THREE.Color("#8b5cf6"),
        c: new THREE.Color("#22c55e"),
        line: new THREE.Color("#22d3ee"),
        additive: true,
      };
}
export type ScenePalette = ReturnType<typeof scenePalette>;
