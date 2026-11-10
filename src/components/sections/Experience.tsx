import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { certifications, education, experience, type TimelineItem } from "@/content/profile";
import { pick } from "@/content/types";
import { Section, Tag, Window } from "../Section";
import { TimelineProgress } from "../TimelineProgress";

/** Stable fake commit hash so each entry reads like a git log line. */
function shortHash(text: string) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

export function Experience({ locale, dict }: { locale: Locale; dict: Dictionary["experience"] }) {
  return (
    <Section id="experience" index="03" title={dict.title}>
      <Window title="git log --oneline --graph" bodyClassName="p-5 sm:p-8">
        <TimelineProgress>
          <ol className="relative space-y-10 border-s border-dashed border-border ps-7">
            {experience.map((item, i) => (
              <TimelineEntry key={item.title.en} item={item} locale={locale} head={i === 0} />
            ))}
          </ol>
        </TimelineProgress>
      </Window>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Window title="education.md" bodyClassName="p-6">
          <p className="font-mono text-xs text-accent">{dict.education}</p>
          <p className="mt-3 text-lg font-semibold">{pick(education.title, locale)}</p>
          <p className="text-sm text-muted">{pick(education.place, locale)}</p>
          <p className="mt-3 inline-block rounded-md bg-accent/10 px-2 py-1 font-mono text-xs text-accent">
            {pick(education.date, locale)}
          </p>
        </Window>
        <Window title="certifications.json" bodyClassName="p-6">
          <p className="font-mono text-xs text-accent">{dict.certifications}</p>
          <ul className="mt-3 divide-y divide-border text-sm">
            {certifications.map((c) => (
              <li key={c.name} className="flex justify-between gap-4 py-2">
                <span>{c.name}</span>
                <span className="font-mono text-xs text-muted">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </Window>
      </div>
    </Section>
  );
}

function TimelineEntry({ item, locale, head }: { item: TimelineItem; locale: Locale; head: boolean }) {
  return (
    <li data-exp className="exp-item relative">
      <span className="exp-dot absolute -start-[2.15rem] top-1.5 size-3 rounded-full border-2 border-muted bg-background" />
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs" dir="ltr">
        <span className="text-[#e3b341]">{shortHash(item.title.en)}</span>
        {head && <span className="text-accent-2">(HEAD -&gt; main)</span>}
        <span className="text-muted" dir="auto">
          {pick(item.date, locale)}
        </span>
      </p>
      <h3 className="mt-2 text-lg font-semibold">{pick(item.title, locale)}</h3>
      <p className="text-sm text-accent">{pick(item.place, locale)}</p>
      {item.text && <p className="mt-2 max-w-2xl text-muted">{pick(item.text, locale)}</p>}
      {item.points && (
        <ul className="mt-4 max-w-3xl space-y-2.5">
          {item.points.map((pt) => {
            const text = pick(pt, locale);
            const cut = text.indexOf(":");
            return (
              <li key={pt.en} className="relative ps-5 text-sm leading-relaxed text-muted">
                <span className="absolute start-0 top-0 font-mono text-accent" aria-hidden>
                  ▸
                </span>
                <span className="font-medium text-foreground">{text.slice(0, cut + 1)}</span>
                {text.slice(cut + 1)}
              </li>
            );
          })}
        </ul>
      )}
      {item.tags && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
    </li>
  );
}
