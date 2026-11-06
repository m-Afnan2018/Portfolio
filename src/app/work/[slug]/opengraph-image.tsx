import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { OgMark, ogFonts } from "@/components/brand/ogMark";

const size = { width: 1200, height: 630 };
const contentType = "image/png";

/** per-project alt text (a static `alt` export can't see the slug) */
export async function generateImageMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return [
    {
      id: "card",
      size,
      contentType,
      alt: p
        ? `${p.title} — ${p.tagline} A case study by ${profile.name}.`
        : `Case study by ${profile.name}`,
    },
  ];
}

/**
 * The project's real screenshot as a PNG data URL (Satori can't decode webp).
 * File IO must be cached under Cache Components for the route to prerender.
 */
async function screenshot(src: string) {
  "use cache";
  try {
    const file = await readFile(join(process.cwd(), "public", src));
    const png = await sharp(file)
      .resize(640, 400, { fit: "cover", position: "top" })
      .png()
      .toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

/** fonts go through the cache as base64 strings (cache values must be serializable) */
async function cachedFonts() {
  "use cache";
  const fonts = await ogFonts();
  return fonts.map((f) => ({ ...f, data: Buffer.from(f.data).toString("base64") }));
}

/** Per-project share card: title + stack on the left, the real screenshot on the right. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug) ?? projects[0];
  const shot = await screenshot(p.image);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#05070D",
        backgroundImage:
          "radial-gradient(circle at 85% 30%, rgba(34,211,238,0.16), transparent 50%), linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        padding: 56,
        fontFamily: "Space Grotesk",
        color: "#E5E7EB",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 470,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#94A3B8" }}
        >
          <OgMark size={48} />
          <span>~/work/{p.slug}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 22, color: "#22C55E" }}>case study · {String(p.year)}</span>
          <span
            style={{
              fontSize: p.title.length > 16 ? 58 : 72,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.02,
              marginTop: 12,
            }}
          >
            {p.title}
          </span>
          <span style={{ fontSize: 24, color: "#94A3B8", marginTop: 18, lineHeight: 1.35 }}>
            {p.tagline}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {p.stack.slice(0, 5).map((s) => (
            <span
              key={s}
              style={{
                fontSize: 18,
                color: "#22D3EE",
                border: "1px solid rgba(34,211,238,0.35)",
                borderRadius: 8,
                padding: "6px 12px",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginLeft: 44,
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: 14,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "#0B1020",
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px" }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#F87171" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#F59E0B" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#22C55E" }} />
          </div>
          {shot ? (
            <img src={shot} width={576} height={360} alt="" style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ width: 576, height: 360, display: "flex", background: "#111827" }} />
          )}
        </div>
        <span style={{ fontSize: 20, color: "#64748B", marginTop: 18, alignSelf: "flex-end" }}>
          {profile.name}
        </span>
      </div>
    </div>,
    {
      ...size,
      fonts: (await cachedFonts()).map((f) => ({ ...f, data: Buffer.from(f.data, "base64") })),
    },
  );
}
