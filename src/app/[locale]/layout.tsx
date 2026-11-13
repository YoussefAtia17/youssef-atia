import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import { locales, dirOf } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ogLocale, siteUrl } from "@/lib/site";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono-jb", subsets: ["latin"] });
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

// Saved choice wins; otherwise dark (the site is designed dark-first). Runs before first paint.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t="dark";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary();
  return {
    metadataBase: siteUrl,
    title: dict.meta.title,
    description: dict.meta.description,
    authors: [{ name: "Youssef Atia", url: siteUrl.href }],
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: dict.hero.name,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${locale}`,
      locale: ogLocale[locale],
      alternateLocale: locale === "en" ? ogLocale.ar : ogLocale.en,
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${plexArabic.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <AmbientBackground />
        <div className="scroll-progress" aria-hidden />
        <Navbar locale={locale} nav={dict.nav} />
        <main className="flex-1">{children}</main>
        <Footer name={dict.hero.name} dict={dict.footer} />
      </body>
    </html>
  );
}
