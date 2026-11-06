import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { OgMark, ogFonts } from "@/components/brand/ogMark";

export const alt = `${profile.name} — Recruiter brief`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The recruiter brief's preview: warm paper, a résumé sheet, the blue stamp. */
export default async function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#ffffff",
        backgroundImage: "linear-gradient(rgba(21,23,28,0.05) 1px, transparent 1px)",
        backgroundSize: "100% 44px",
        padding: 72,
        color: "#15171c",
        fontFamily: "Space Grotesk",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <OgMark size={64} />
          <span style={{ fontSize: 28, fontWeight: 600 }}>{profile.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{ fontSize: 24, letterSpacing: 4, color: "#6b7280", textTransform: "uppercase" }}
          >
            Recruiter brief
          </span>
          <span
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.02,
              marginTop: 14,
            }}
          >
            Full-stack developer
          </span>
          <span
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.02,
              color: "#2563eb",
            }}
          >
            who runs the servers.
          </span>
        </div>
        <span style={{ fontSize: 26, color: "#4b5563" }}>
          Experience · Skills · Résumé — on one page
        </span>
      </div>
      <div style={{ display: "flex", position: "relative", width: 300, alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: 280,
            padding: 28,
            background: "#fafafa",
            border: "1px solid #e6e6e6",
            borderRadius: 14,
            transform: "rotate(-4deg)",
            boxShadow: "0 30px 60px -30px rgba(21,23,28,0.5)",
          }}
        >
          <div style={{ width: 150, height: 14, borderRadius: 7, background: "#15171c" }} />
          <div style={{ width: 200, height: 9, borderRadius: 5, background: "#d1cdc4" }} />
          {[190, 220, 170, 210, 150, 200].map((w, i) => (
            <div key={i} style={{ width: w, height: 8, borderRadius: 4, background: "#e5e1d8" }} />
          ))}
          <div style={{ width: 120, height: 8, borderRadius: 4, background: "#93b4f5" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 250,
            display: "flex",
            padding: "8px 18px",
            border: "4px solid #2563eb",
            borderRadius: 8,
            color: "#2563eb",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            transform: "rotate(-14deg)",
            background: "rgba(251,250,246,0.9)",
          }}
        >
          HIRING? START HERE
        </div>
      </div>
    </div>,
    { ...size, fonts: await ogFonts() },
  );
}
