import { ImageResponse } from "next/og";
import { OgMark } from "@/components/brand/ogMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon — the MA mark, full-bleed (iOS rounds the corners itself). */
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <OgMark size={180} square />
    </div>,
    size,
  );
}
