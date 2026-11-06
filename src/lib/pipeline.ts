import { pipeline } from "@/data/infra";
import { clamp } from "./utils";

/**
 * Maps the Infra section's local scroll progress (0–1) to pipeline progress
 * (0 … stages − 1). Shared by the DOM diagram and the 3D packets so both
 * stay in lock-step.
 */
export function pipelineProgress(local: number) {
  return clamp((local - 0.18) / 0.55) * (pipeline.length - 1);
}
