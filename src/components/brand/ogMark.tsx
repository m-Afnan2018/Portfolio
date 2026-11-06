import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MARK_PATH } from "./BrandMark";

/** Space Grotesk (OFL) for generated images — static weights, Satori can't use variable fonts */
export async function ogFonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [medium, bold] = await Promise.all([
    readFile(join(dir, "SpaceGrotesk-Medium.ttf")),
    readFile(join(dir, "SpaceGrotesk-Bold.ttf")),
  ]);
  return [
    { name: "Space Grotesk", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Space Grotesk", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

/** The MA mark for generated social images (Satori: inline styles, plain SVG). */
export function OgMark({ size = 88 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        background: "linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32">
        <path
          d={MARK_PATH}
          fill="none"
          stroke="#fff"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
