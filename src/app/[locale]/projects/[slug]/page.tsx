import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { featuredProjects } from "@/content/projects";
import { pick } from "@/content/types";
import { Tag, Window } from "@/components/Section";
import { ogLocale } from "@/lib/site";
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
  const title = `${pick(project.title, lang)} | ${dict.hero.name}`;
  const description = pick(project.summary, lang);
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/projects/${slug}`,
      languages: { en: `/en/projects/${slug}`, ar: `/ar/projects/${slug}`, "x-default": `/en/projects/${slug}` },
    },
    openGraph: { type: "article", siteName: dict.hero.name, title, description, url: `/${lang}/projects/${slug}`, locale: ogLocale[lang] },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Params are awaited inside <Suspense> so navigation stays instant (Partial Prefetching).
export default function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-screen max-w-6xl px-6 py-12" />}>
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
    <article className="relative isolate">
      <div className="bg-grid absolute inset-x-0 top-0 -z-10 h-[36rem]" aria-hidden />
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <p className="font-mono text-xs text-muted" dir="ltr">
          <Link href={`/${locale}#projects`} className="text-accent hover:underline">
            ~/projects
          </Link>
          /{p.slug}
        </p>
        <Link href={`/${locale}#projects`} className="mt-3 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <span className="inline-block rtl:rotate-180">←</span> {t.back}
        </Link>

        <header className="mt-8 max-w-3xl">
          {p.badge && (
            <p className="font-mono text-xs text-accent">
              <span dir="ltr">// </span>
              {pick(p.badge, locale)}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{pick(p.summary, locale)}</p>
        </header>

        <Window title={`${p.slug} — preview`} className="mt-10">
          {p.image ? (
            <Image src={p.image} alt={title} width={1600} height={900} priority sizes="(min-width: 1152px) 1104px, 100vw" className="h-auto w-full" />
          ) : (
            <div className={`grid aspect-[16/9] place-items-center bg-gradient-to-br ${p.cover}`}>
              <span className="px-6 text-center text-3xl font-bold text-white drop-shadow">{title}</span>
            </div>
          )}
        </Window>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div className="min-w-0">
            {p.privateCode && (
              <p className="flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-muted">
                <LockIcon className="mt-0.5 size-4 shrink-0 text-accent" /> {t.confidential}
              </p>
            )}

            {p.details.highlights && (
              <Block title={t.results}>
                <dl className="grid gap-4 sm:grid-cols-3">
                  {p.details.highlights.map((h) => (
                    <div key={h.label.en} className="rounded-lg border border-border bg-surface p-5">
                      <dt className="text-sm text-muted">{pick(h.label, locale)}</dt>
                      <dd className="mt-2 font-mono text-3xl font-bold text-accent" dir="ltr">
                        {h.value}
                      </dd>
                      {h.baseline && <dd className="mt-1 text-xs text-muted">{pick(h.baseline, locale)}</dd>}
                    </div>
                  ))}
                </dl>
              </Block>
            )}

            <Block title={t.context}>
              <p className="leading-relaxed text-muted">{pick(p.details.context, locale)}</p>
            </Block>
            <Block title={t.overview}>
              <p className="leading-relaxed text-muted">{pick(p.details.overview, locale)}</p>
            </Block>

            <Block title={t.modules}>
              <div className="grid gap-4 sm:grid-cols-2">
                {p.details.modules.map((m, i) => (
                  <div key={m.title.en} className="rounded-lg border border-border bg-surface p-5 transition hover:border-accent/40">
                    <p className="font-mono text-xs text-accent" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-semibold">{pick(m.title, locale)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{pick(m.body, locale)}</p>
                  </div>
                ))}
              </div>
            </Block>

            <Block title={t.engineering}>
              <ul className="space-y-3">
                {p.details.engineering.map((f) => (
                  <li key={f.en} className="flex gap-3">
                    <span className="font-mono text-accent" dir="ltr" aria-hidden>
                      ▸
                    </span>
                    <span className="leading-relaxed text-muted">{pick(f, locale)}</span>
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Window title="project.json" bodyClassName="space-y-5 p-5">
              <div>
                <p className="font-mono text-xs text-muted">{t.stack}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </div>
              {p.role && (
                <div>
                  <p className="font-mono text-xs text-muted">{t.role}</p>
                  <p className="mt-1 text-sm">{pick(p.role, locale)}</p>
                </div>
              )}
              <div className="flex flex-col gap-2 border-t border-border pt-5 text-sm font-medium">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-black hover:brightness-110">
                    <ExternalIcon className="size-4" /> {t.live}
                  </a>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 hover:border-accent/50">
                    <GithubIcon className="size-4" /> {t.code}
                  </a>
                )}
                {p.privateCode && (
                  <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-muted">
                    <LockIcon className="size-4" /> {t.privateCode}
                  </span>
                )}
              </div>
            </Window>
          </aside>
        </div>

        {p.gallery && p.gallery.length > 0 && (
          <Block title={t.gallery}>
            <div className="grid gap-5 sm:grid-cols-2">
              {p.gallery.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  title={t.openImage}
                  className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent/50"
                >
                  <Image
                    src={src}
                    alt={`${title} (${i + 1})`}
                    width={1600}
                    height={900}
                    sizes="(min-width: 640px) 560px, 100vw"
                    className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
                  />
                </a>
              ))}
            </div>
          </Block>
        )}
      </div>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="flex items-center gap-3 text-2xl font-semibold">
        <span className="font-mono text-base text-accent" dir="ltr">
          ##
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
