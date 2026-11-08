import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { bio, skillGroups } from "@/content/profile";
import { pick } from "@/content/types";
import { Section, Tag, Window } from "../Section";

export function About({ locale, dict }: { locale: Locale; dict: Dictionary["about"] }) {
  return (
    <Section id="about" index="01" title={dict.title}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <Window title="README.md" bodyClassName="p-6 sm:p-8">
          <p className="font-mono text-sm text-accent" dir="ltr">
            # hello, world
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">{pick(bio, locale)}</p>
        </Window>

        <Window title="skills.config" bodyClassName="divide-y divide-border">
          <p className="sr-only">{dict.skills}</p>
          {skillGroups.map((g, i) => (
            <div key={g.title.en} className="grid gap-3 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:items-center">
              <p className="flex items-center gap-3 text-sm font-medium">
                <span className="font-mono text-xs text-muted/60" dir="ltr">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {pick(g.title, locale)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </div>
          ))}
        </Window>
      </div>
    </Section>
  );
}
