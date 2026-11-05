import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Hex values for the Tailwind colors used in project covers (OG images can't read Tailwind classes). */
const palette: Record<string, string> = {
  "indigo-500": "#6366f1", "cyan-400": "#22d3ee", "amber-500": "#f59e0b", "rose-500": "#f43f5e",
  "yellow-500": "#eab308", "amber-700": "#b45309", "sky-500": "#0ea5e9", "blue-700": "#1d4ed8",
  "emerald-500": "#10b981", "teal-600": "#0d9488", "fuchsia-500": "#d946ef", "purple-700": "#7e22ce",
};

export function coverColors(cover: string): [string, string] {
  const from = cover.match(/from-([a-z]+-\d+)/)?.[1] ?? "";
  const to = cover.match(/to-([a-z]+-\d+)/)?.[1] ?? "";
  return [palette[from] ?? "#6366f1", palette[to] ?? "#22d3ee"];
}

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/**
 * Social preview card. Text is English on purpose: the image renderer can't shape Arabic script.
 */
export function ogCard({ eyebrow, title, text, tags = [], colors }: { eyebrow: string; title: string; text: string; tags?: string[]; colors: [string, string] }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0b0b12", color: "#f4f4f5", padding: 72, position: "relative" }}>
        <div style={{ position: "absolute", top: -220, right: -160, width: 640, height: 640, borderRadius: 9999, background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, opacity: 0.45, filter: "blur(90px)" }} />
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700 }}>
          YA<span style={{ color: colors[1] }}>.</span>
          <span style={{ marginLeft: 24, fontSize: 26, fontWeight: 400, color: "#a1a1aa" }}>{eyebrow}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div style={{ fontSize: title.length > 28 ? 64 : 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{clip(title, 48)}</div>
          <div style={{ marginTop: 24, fontSize: 30, lineHeight: 1.4, color: "#d4d4d8", maxWidth: 1000 }}>{clip(text, 150)}</div>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              {tags.slice(0, 5).map((tag) => (
                <div key={tag} style={{ display: "flex", fontSize: 22, padding: "8px 18px", borderRadius: 9999, border: "1px solid #3f3f46", color: "#e4e4e7" }}>
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 10, background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }} />
      </div>
    ),
    ogSize,
  );
}
