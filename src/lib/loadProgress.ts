"use client";

/**
 * Real asset-loading progress for the boot loader. Tasks register a weight
 * and report completion; textures report through THREE's loading manager.
 */
type Listener = (p: number) => void;

const tasks: Record<string, { weight: number; done: number }> = {
  fonts: { weight: 1, done: 0 },
  page: { weight: 1, done: 0 },
  scene: { weight: 2, done: 0 },
  textures: { weight: 1, done: 0 },
};
const listeners = new Set<Listener>();

function total() {
  let w = 0;
  let d = 0;
  for (const t of Object.values(tasks)) {
    w += t.weight;
    d += t.weight * t.done;
  }
  return w ? d / w : 1;
}

export function reportProgress(task: keyof typeof tasks, done: number) {
  tasks[task].done = Math.max(tasks[task].done, Math.min(1, done));
  const p = total();
  listeners.forEach((l) => l(p));
}

export function onProgress(l: Listener) {
  listeners.add(l);
  l(total());
  return () => void listeners.delete(l);
}

/** Without WebGL (or with the 3D disabled) the scene + textures count as done. */
export function skipScene() {
  reportProgress("scene", 1);
  reportProgress("textures", 1);
}
