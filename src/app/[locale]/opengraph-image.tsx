import { ogCard, ogSize } from "@/lib/og";
import en from "@/i18n/dictionaries/en.json";
import { locales } from "@/i18n/config";

export const alt = "Youssef Atia, full-stack developer";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function Image() {
  return ogCard({
    eyebrow: "github.com/YoussefAtia17",
    title: en.hero.name,
    text: en.hero.tagline,
    tags: ["Next.js", "SwiftUI", "Supabase", "Python", "Federated Learning"],
    colors: ["#6366f1", "#22d3ee"],
  });
}
