import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { bio, skillGroups } from "@/content/profile";
import { pick } from "@/content/types";
import { Section, Tag } from "../Section";

export function About({ locale, dict }: { locale: Locale; dict: Dictionary["about"] }) {
  return (
    <Section id="about" title={dict.title}>
      <div className="grid gap-12 md:grid-cols-5">
        <p className="text-lg leading-relaxed text-muted md:col-span-2">{pick(bio, locale)}</p>
        <div className="md:col-span-3">
          <h3 className="mb-6 font-semibold">{dict.skills}</h3>
          <dl className="space-y-5">
            {skillGroups.map((g) => (
              <div key={g.title.en} className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:items-baseline">
                <dt className="text-sm font-medium">{pick(g.title, locale)}</dt>
                <dd className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
