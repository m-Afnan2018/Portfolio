import { ImageResponse } from "next/og";
import { OgMark } from "@/components/brand/ogMark";

/** 512px maskable PNG for the web manifest (Android / desktop installs). */
export function GET() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <OgMark size={512} square />
    </div>,
    { width: 512, height: 512 },
  );
}
