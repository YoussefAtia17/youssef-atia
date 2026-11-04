import { locale as getLocaleParam } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

/** Current locale from the [locale] root segment (server only). */
export async function getLocale(): Promise<Locale> {
  const value = await getLocaleParam();
  if (!isLocale(value)) notFound();
  return value;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}
