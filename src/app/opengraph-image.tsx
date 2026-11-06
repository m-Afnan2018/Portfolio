import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { OgMark, ogFonts } from "@/components/brand/ogMark";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated OG image in the site's terminal style. */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#05070D",
          backgroundImage:
            "radial-gradient(circle at 78% 40%, rgba(34,211,238,0.18), transparent 45%), linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
          padding: 64,
          fontFamily: "Space Grotesk",
          color: "#E5E7EB",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, color: "#94A3B8" }}>
          <OgMark size={56} />
          <div style={{ width: 20 }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#F87171" }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#F59E0B" }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#22C55E" }} />
          <span style={{ marginLeft: 16 }}>~/afnan — home.tsx</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 28, color: "#22C55E" }}>$ whoami</span>
          <span style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 1, marginTop: 16 }}>MOHAMMAD</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 1, color: "#22D3EE" }}>AFNAN</span>
            <div style={{ width: 52, height: 92, background: "#22D3EE", marginLeft: 18 }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#94A3B8" }}>
          <span>Full Stack Developer · DevOps Engineer</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12, color: "#22C55E" }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#22C55E" }} />
            available for work
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
