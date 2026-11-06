import { DESKTOP_STATES, type CoreState } from "./CoreTargets";

/**
 * The Core's current placement, written every frame by the GSAP master
 * timeline in Core.tsx and read by CameraRig and the layer components.
 */
export const corePose: CoreState & { scene: number; skillsShift: number } = {
  ...DESKTOP_STATES[1],
  scene: 1,
  skillsShift: 0,
};
