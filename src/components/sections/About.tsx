import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { bio, lead, pillars, skillGroups } from "@/content/profile";
import { pick } from "@/content/types";
import { Section, Tag, Window } from "../Section";

const pillarIcons: Record<(typeof pillars)[number]["key"], React.ReactNode> = {
  backend: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  mobile: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M11 18h2" />
    </>
  ),
  ai: <path d="M12 3l1.8 4.9L19 9.7l-5.2 1.8L12 16.5l-1.8-5L5 9.7l5.2-1.8L12 3zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />,
};

export function About({ locale, dict }: { locale: Locale; dict: Dictionary["about"] }) {
  const [before, accent, after] = lead[locale];
  return (
    <Section id="about" index="01" title={dict.title}>
      <div className="grid gap-10 lg:grid-cols-[19rem_1fr] lg:gap-14">
        {/* Portrait with a soft accent glow, pinned while the text scrolls past. */}
        <figure className="relative mx-auto w-full max-w-sm lg:sticky lg:top-24 lg:self-start">
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/25 via-transparent to-accent-2/25 blur-2xl" aria-hidden />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface-2 lg:aspect-[3/4.4]">
            <Image
              src="/youssef.jpg"
              alt={dict.photoAlt}
              fill
              quality={90}
              sizes="(min-width: 1024px) 19rem, 24rem"
              className="object-cover object-[50%_30%]"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
            <figcaption className="absolute bottom-4 start-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-white/90 backdrop-blur" dir="ltr">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" /> youssef_atia
            </figcaption>
          </div>
        </figure>

        <div className="min-w-0">
          <p className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.6rem]">
            {before}
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">{accent}</span>
            {after}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{pick(bio, locale)}</p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {pillars.map((p, i) => (
              <li
                key={p.key}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-accent/40"
              >
                <span className="absolute -end-6 -top-6 size-20 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/25" aria-hidden />
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {pillarIcons[p.key]}
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-muted/60" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{pick(p.title, locale)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{pick(p.text, locale)}</p>
              </li>
            ))}
          </ul>

          <Window title="skills.config" className="mt-10" bodyClassName="divide-y divide-border">
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
      </div>
    </Section>
  );
}
