import { featuredProjects } from "@/content/projects";
import { coverColors, ogCard, ogSize } from "@/lib/og";

export const alt = "Project by Youssef Atia";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = featuredProjects.find((x) => x.slug === slug) ?? featuredProjects[0];
  return ogCard({
    eyebrow: p.badge ? `Youssef Atia · ${p.badge.en}` : "Youssef Atia · Project",
    title: p.title.en,
    text: p.summary.en,
    tags: p.stack,
    colors: coverColors(p.cover),
  });
}
