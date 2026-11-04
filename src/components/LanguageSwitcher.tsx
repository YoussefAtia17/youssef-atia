"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const target: Locale = locale === "en" ? "ar" : "en";
  const rest = pathname.split("/").slice(2).join("/");
  const href = `/${target}${rest ? `/${rest}` : ""}`;

  // Plain <a>: switching locale swaps the root layout (lang/dir/fonts), so do a full load.
  return (
    <a
      href={href}
      lang={target}
      className="rounded-full border border-border px-3 py-1.5 text-sm transition hover:bg-surface"
    >
      {label}
    </a>
  );
}
