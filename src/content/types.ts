import type { Locale } from "@/i18n/config";

/** A string written in both languages. */
export type Localized = Record<Locale, string>;

export const pick = (value: Localized, locale: Locale) => value[locale];
