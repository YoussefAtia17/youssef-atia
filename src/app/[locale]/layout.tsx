import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { locales, dirOf } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

// Saved choice wins; otherwise follow the OS. Runs before first paint.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { languages: { en: "/en", ar: "/ar" } },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      data-theme="light"
      suppressHydrationWarning
      className={`${inter.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar locale={locale} nav={dict.nav} />
        <main className="flex-1">{children}</main>
        <Footer name={dict.hero.name} dict={dict.footer} />
      </body>
    </html>
  );
}
