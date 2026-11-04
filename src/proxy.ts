import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const lang = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(lang)) return lang;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return;

  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, CV PDFs, favicon…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
