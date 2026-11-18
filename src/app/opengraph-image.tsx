import { ImageResponse } from "next/og";

import { brand } from "@/content/site";

export const dynamic = "force-static";
export const alt = `${brand.name}: ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card: black canvas, the wordmark, the tagline and one lime accent bar. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#000",
        color: "#fff",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, letterSpacing: -0.5, color: "#7b7878" }}
      >
        <span style={{ color: "#C6FF3D" }}>[</span> AI GAME MAKER <span style={{ color: "#C6FF3D" }}>]</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>{brand.wordmark}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 100, height: 10, background: "#C6FF3D" }} />
          <div style={{ fontSize: 40, textTransform: "uppercase", letterSpacing: -1 }}>{brand.tagline}</div>
        </div>
      </div>
      <div style={{ fontSize: 24, color: "rgba(255,255,255,0.7)" }}>Make · Play · Share</div>
    </div>,
    size,
  );
}
