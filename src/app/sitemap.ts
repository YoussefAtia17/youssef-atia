import type { MetadataRoute } from "next";
import { featuredProjects } from "@/content/projects";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

const abs = (path: string) => new URL(path, siteUrl).href;

/** Every page in both languages, each listing its other-language version. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...featuredProjects.map((p) => `/projects/${p.slug}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: abs(`/${locale}${path}`),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, abs(`/${l}${path}`)])) },
    })),
  );
}
