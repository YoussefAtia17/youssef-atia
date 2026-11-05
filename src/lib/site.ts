import { contact } from "@/content/profile";

/**
 * Absolute site URL for canonical links, sitemap and social previews.
 * Set NEXT_PUBLIC_SITE_URL once you have a domain; on Vercel the production URL is used automatically.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
);

export const ogLocale = { en: "en_US", ar: "ar_EG" } as const;

export const person = {
  name: "Youssef Atia",
  email: contact.email,
  github: contact.github,
};
