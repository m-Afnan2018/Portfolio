import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { OgMark, ogFonts } from "@/components/brand/ogMark";
import { clientsPage } from "@/data/clients";

export const alt = `Work with ${profile.name} — websites, stores & web apps`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The client page's preview: deep blue, the promise, an availability chip. */
export default async function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #0b1120 0%, #1e3a8a 55%, #2563eb 100%)",
        padding: 72,
        color: "#fff",
        fontFamily: "Space Grotesk",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <OgMark size={64} />
          <span style={{ fontSize: 28, fontWeight: 600 }}>{profile.name}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 22px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            fontSize: 22,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#4ade80" }} />
          {clientsPage.availability}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
          {clientsPage.headline}
        </span>
        <span
          style={{
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1.05,
            color: "#7dd3fc",
          }}
        >
          {clientsPage.headlineAccent} running.
        </span>
      </div>
      <span style={{ fontSize: 28, color: "rgba(255,255,255,0.75)" }}>
        Web apps · Online stores · Business sites — built, hosted and looked after
      </span>
    </div>,
    { ...size, fonts: await ogFonts() },
  );
}
