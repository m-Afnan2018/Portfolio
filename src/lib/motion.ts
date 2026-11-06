/**
 * motion.ts — the motion design system. Every GSAP / Framer Motion animation
 * pulls its easing, duration and stagger from here so the whole site moves
 * with one voice.
 */

export const ease = {
  /** reveals: fast start, long settle */
  out: "expo.out",
  /** section / camera transitions */
  inOut: "power3.inOut",
  /** small UI responses */
  soft: "power2.out",
  /** cubic-bezier twin of expo.out for CSS / Framer Motion */
  outBezier: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOutBezier: [0.65, 0, 0.35, 1] as [number, number, number, number],
} as const;

export const duration = {
  micro: 0.6,
  reveal: 1.2,
  section: 1.8,
} as const;

export const stagger = {
  char: 0.025,
  word: 0.06,
  line: 0.1,
  item: 0.08,
} as const;

/** ScrollTrigger start offsets used for every reveal. */
export const reveal = {
  start: "top 82%",
  startLate: "top 65%",
} as const;

export const cssEase = `cubic-bezier(${ease.outBezier.join(",")})`;
