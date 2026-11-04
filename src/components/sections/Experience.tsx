import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { certifications, education, experience, type TimelineItem } from "@/content/profile";
import { pick } from "@/content/types";
import { Section } from "../Section";

export function Experience({ locale, dict }: { locale: Locale; dict: Dictionary["experience"] }) {
  return (
    <Section id="experience" title={dict.title}>
      <ol className="relative space-y-10 border-s border-border ps-8">
        {experience.map((item) => (
          <TimelineEntry key={item.title.en} item={item} locale={locale} />
        ))}
      </ol>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border p-6">
          <h3 className="mb-4 font-semibold">{dict.education}</h3>
          <p className="font-medium">{pick(education.title, locale)}</p>
          <p className="text-sm text-muted">{pick(education.place, locale)}</p>
          <p className="mt-1 text-sm text-accent">{pick(education.date, locale)}</p>
        </div>
        <div className="rounded-2xl border border-border p-6">
          <h3 className="mb-4 font-semibold">{dict.certifications}</h3>
          <ul className="space-y-2 text-sm">
            {certifications.map((c) => (
              <li key={c.name} className="flex justify-between gap-4">
                <span>{c.name}</span>
                <span className="text-muted">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function TimelineEntry({ item, locale }: { item: TimelineItem; locale: Locale }) {
  return (
    <li className="relative">
      <span className="absolute -start-[2.4rem] top-1.5 size-3 rounded-full border-2 border-background bg-accent ring-4 ring-accent/20" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-lg font-semibold">{pick(item.title, locale)}</h3>
        <span className="text-sm text-muted">{pick(item.date, locale)}</span>
      </div>
      <p className="text-sm text-accent">{pick(item.place, locale)}</p>
      {item.text && <p className="mt-2 max-w-2xl text-muted">{pick(item.text, locale)}</p>}
    </li>
  );
}
