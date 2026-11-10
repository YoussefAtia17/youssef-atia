import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { earlierProjects, featuredProjects, type Project } from "@/content/projects";
import { pick } from "@/content/types";
import { Section, Tag } from "../Section";
import { ProjectFilter } from "../ProjectFilter";
import { Testimonials } from "../Testimonials";
import { testimonials } from "@/content/testimonials";
import { ExternalIcon, GithubIcon, LockIcon } from "../icons";

type Dict = Dictionary["projects"];

export function Projects({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <Section id="projects" index="02" title={dict.title} subtitle={dict.subtitle}>
      <StatsStrip dict={dict} />
      <ProjectFilter
        label={dict.filterLabel}
        filters={(["all", "mobile", "web", "client", "product"] as const).map((key) => ({ key, label: dict.filters[key] }))}
        items={featuredProjects.map((p, i) => ({
          slug: p.slug,
          kinds: p.kinds,
          card: <ProjectPanel project={p} n={i + 1} locale={locale} dict={dict} />,
        }))}
      />

      <Testimonials items={testimonials} locale={locale} title={dict.testimonials} />

      <div className="mt-20 overflow-hidden rounded-xl border border-border bg-surface">
        <p className="border-b border-border bg-surface-2/70 px-5 py-3 font-mono text-xs text-muted" dir="ltr">
          <span className="text-accent">➜</span> ~ ls archive/ <span className="text-muted/60"># {dict.earlier}</span>
        </p>
        <ul className="divide-y divide-border">
          {earlierProjects.map((p) => (
            <li key={p.slug} className="grid gap-2 px-5 py-4 sm:grid-cols-[16rem_1fr] sm:gap-6">
              <span className="font-medium">
                <span className="font-mono text-accent" dir="ltr">
                  ▸{" "}
                </span>
                {pick(p.title, locale)}
              </span>
              <div>
                <p className="text-sm text-muted">{pick(p.summary, locale)}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/** One project as a full-width panel. On wide screens the panels stick and stack as you scroll. */
function ProjectPanel({ project: p, n, locale, dict }: { project: Project; n: number; locale: Locale; dict: Dict }) {
  const title = pick(p.title, locale);
  const href = `/${locale}/projects/${p.slug}`;
  const side = (p.gallery ?? []).filter((g) => !g.includes("features")).slice(0, 2);

  return (
    <article className="stack-card group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.6)] transition-[border-color,transform,filter] duration-500 hover:border-accent/40">
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        aria-hidden
      />

      {/* Header: number, kind, title and actions */}
      <div className="flex flex-col gap-5 p-5 sm:p-7 md:flex-row md:items-center md:gap-8">
        <span
          className="stack-num shrink-0 font-mono text-6xl leading-none font-bold tracking-tighter sm:text-7xl md:text-8xl"
          dir="ltr"
          aria-hidden
        >
          {String(n).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap gap-x-3 font-mono text-xs text-accent" dir="ltr">
            {p.kinds.map((k) => (
              <span key={k}>--{dict.filters[k]}</span>
            ))}
            {p.badge && (
              <span className="text-muted" dir="auto">
                {"// "}
                {pick(p.badge, locale)}
              </span>
            )}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            <Link href={href} className="after:absolute after:inset-0 hover:text-accent">
              {title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-muted">{pick(p.summary, locale)}</p>
        </div>

        <div className="relative z-10 flex shrink-0 flex-wrap items-center gap-2 font-mono text-xs">
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-4 py-2 text-accent transition hover:bg-accent hover:text-black"
            >
              <ExternalIcon className="size-3.5" /> {dict.live}
            </a>
          )}
          <Link
            href={href}
            className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-foreground transition hover:border-accent/50 hover:text-accent"
          >
            {dict.details} <span className="inline-block rtl:rotate-180">→</span>
          </Link>
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`${dict.code}: ${title}`}
              className="grid size-9 place-items-center rounded-full border border-border text-muted transition hover:border-accent/50 hover:text-foreground"
            >
              <GithubIcon className="size-4" />
            </a>
          )}
          {p.privateCode && (
            <span title={dict.privateCode} className="grid size-9 place-items-center rounded-full border border-border text-muted">
              <LockIcon className="size-3.5" />
              <span className="sr-only">{dict.privateCode}</span>
            </span>
          )}
        </div>
      </div>

      {/* Media: the demo clip (or cover) large, two screens beside it */}
      <div className="grid gap-3 px-5 pb-5 sm:px-7 sm:pb-7 md:grid-cols-[2fr_1fr]">
        <div className={`relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-gradient-to-br ${p.cover}`}>
          {p.image && (
            <Image
              quality={90}
              src={p.image}
              alt={title}
              fill
              sizes="(min-width: 1152px) 720px, (min-width: 768px) 66vw, 100vw"
              className="object-cover object-top transition duration-700 group-hover:scale-[1.02]"
            />
          )}
          {p.video && (
            <>
              <video
                data-preview
                src={p.video}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden
                tabIndex={-1}
                className="peer absolute inset-0 size-full object-cover object-top opacity-0 transition-opacity duration-700 data-[playing]:opacity-100"
              />
              <span
                className="pointer-events-none absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/70 px-2 py-1 font-mono text-[10px] text-white/85 backdrop-blur transition peer-data-[playing]:opacity-0"
                dir="ltr"
              >
                <span className="size-1.5 rounded-full bg-accent" /> {dict.preview}
              </span>
            </>
          )}
        </div>

        {side.length === 0 && (
          <div className="hidden flex-col overflow-hidden rounded-xl border border-border bg-surface-2/40 md:flex">
            <p className="border-b border-border px-4 py-2.5 font-mono text-xs text-muted" dir="ltr">
              <span className="text-accent">➜</span> cat README.md
            </p>
            <p className="flex-1 overflow-hidden p-4 text-sm leading-relaxed text-muted">{pick(p.summary, locale)}</p>
          </div>
        )}
        {side.length > 0 && (
          <div className="hidden gap-3 sm:grid sm:grid-cols-2 md:grid-cols-1 md:grid-rows-2">
            {side.map((src, i) => (
              <div key={src} className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-surface-2 md:aspect-auto">
                <Image
                  quality={90}
                  src={src}
                  alt={`${title} (${i + 2})`}
                  fill
                  sizes="(min-width: 1152px) 360px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-border px-5 py-4 sm:px-7">
        {p.stack.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>
    </article>
  );
}

/** Quick proof points above the grid, all derived from the project data so they never drift. */
function StatsStrip({ dict }: { dict: Dict }) {
  const tech = new Set(featuredProjects.flatMap((p) => p.stack)).size;
  const stats = [
    {
      value: featuredProjects.filter((p) => p.live).length,
      label: dict.stats.demos,
    },
    {
      value: featuredProjects.filter((p) => p.kinds.includes("client")).length,
      label: dict.stats.clients,
    },
    { value: 3, label: dict.stats.platforms },
    { value: tech, label: dict.stats.tech },
  ];
  return (
    <dl className="mb-8 grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-border gap-px md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="group relative bg-surface p-5 transition hover:bg-surface-2/60 sm:p-6">
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-mono text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            <span className="text-accent">{s.value}</span>
            <span className="text-muted/50">+</span>
          </dd>
          <dd className="mt-2 text-xs leading-snug text-muted sm:text-sm">{s.label}</dd>
          <span className="absolute inset-x-0 top-0 h-px scale-x-0 bg-accent transition duration-500 group-hover:scale-x-100" aria-hidden />
        </div>
      ))}
    </dl>
  );
}
