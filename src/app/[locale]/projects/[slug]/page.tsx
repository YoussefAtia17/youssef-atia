import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { featuredProjects } from "@/content/projects";
import { pick } from "@/content/types";
import { Tag } from "@/components/Section";
import { ExternalIcon, GithubIcon, LockIcon } from "@/components/icons";

const findProject = (slug: string) => featuredProjects.find((p) => p.slug === slug);

export function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  const lang = locale === "ar" ? "ar" : "en";
  const dict = await getDictionary();
  return {
    title: `${pick(project.title, lang)} | ${dict.hero.name}`,
    description: pick(project.summary, lang),
    alternates: { languages: { en: `/en/projects/${slug}`, ar: `/ar/projects/${slug}` } },
  };
}

// Params are awaited inside <Suspense> so navigation stays instant (Partial Prefetching).
export default function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-screen max-w-4xl px-6 py-12" />}>
      <ProjectDetails params={params} />
    </Suspense>
  );
}

async function ProjectDetails({ params }: { params: PageProps<"/[locale]/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const locale = await getLocale();
  const { projects: t } = await getDictionary();
  const p = project;
  const title = pick(p.title, locale);

  return (
    <article className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <Link href={`/${locale}#projects`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <span className="inline-block rtl:rotate-180">←</span> {t.back}
      </Link>

      <header className="mt-8">
        {p.badge && (
          <span className={`inline-block rounded-full bg-gradient-to-r ${p.cover} px-3 py-1 text-xs font-medium text-white`}>
            {pick(p.badge, locale)}
          </span>
        )}
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted">{pick(p.summary, locale)}</p>
        {p.role && (
          <p className="mt-3">
            <span className="font-medium">{t.role}:</span> <span className="text-muted">{pick(p.role, locale)}</span>
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-medium">
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-white hover:opacity-90">
              <ExternalIcon className="size-4" /> {t.live}
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 hover:bg-surface">
              <GithubIcon className="size-4" /> {t.code}
            </a>
          )}
          {p.privateCode && (
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-muted">
              <LockIcon className="size-4" /> {t.privateCode}
            </span>
          )}
        </div>
      </header>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border">
        {p.image ? (
          <Image src={p.image} alt={title} width={1440} height={900} priority className="h-auto w-full" />
        ) : (
          <div className={`grid aspect-[16/9] place-items-center bg-gradient-to-br ${p.cover}`}>
            <span className="px-6 text-center text-3xl font-bold text-white drop-shadow">{title}</span>
          </div>
        )}
      </div>

      {p.details.highlights && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">{t.results}</h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {p.details.highlights.map((h) => (
              <div key={h.label.en} className="rounded-2xl border border-border bg-surface/50 p-5">
                <dt className="text-sm text-muted">{pick(h.label, locale)}</dt>
                <dd className="mt-2 text-3xl font-bold text-accent" dir="ltr">{h.value}</dd>
                {h.baseline && <dd className="mt-1 text-xs text-muted">{pick(h.baseline, locale)}</dd>}
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">{t.overview}</h2>
        <p className="mt-4 leading-relaxed text-muted">{pick(p.details.overview, locale)}</p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">{t.features}</h2>
        <ul className="mt-4 space-y-3">
          {p.details.features.map((f) => (
            <li key={f.en} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span className="text-muted">{pick(f, locale)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">{t.stack}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </section>
    </article>
  );
}
