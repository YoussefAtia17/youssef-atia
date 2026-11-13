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
import { Gallery } from "@/components/Gallery";
import { CopyButton } from "@/components/CopyButton";
import { Testimonials } from "@/components/Testimonials";
import { testimonials } from "@/content/testimonials";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Project } from "@/content/projects";

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
              <span dir="ltr">{"// "}</span>
              {pick(p.badge, locale)}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{pick(p.summary, locale)}</p>
        </header>

        <Window title={`${p.slug} — preview`} className="mt-10">
          {p.image ? (
            <Image src={p.image} alt={title} width={1600} height={900} quality={90} priority sizes="(min-width: 1152px) 1104px, 100vw" className="h-auto w-full" />
          ) : (
            <div className={`grid aspect-[16/9] place-items-center bg-gradient-to-br ${p.cover}`}>
              <span className="px-6 text-center text-3xl font-bold text-white drop-shadow">{title}</span>
            </div>
          )}
        </Window>

        {p.live && <DemoPanel project={p} locale={locale} t={t} />}

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
            <Gallery
              images={p.gallery}
              title={title}
              slug={p.slug}
              rtl={locale === "ar"}
              labels={{ open: t.openImage, close: t.close, next: t.next, prev: t.prev }}
            />
          </Block>
        )}

        <Testimonials items={testimonials.filter((x) => x.project === p.slug)} locale={locale} title={t.testimonials} />

        <ProjectNav current={p.slug} locale={locale} t={t} />
      </div>
    </article>
  );
}

type T = Dictionary["projects"];

/** Big "try it" call to action, with copyable sample logins when the demo has a sign-in screen. */
function DemoPanel({ project: p, locale, t }: { project: Project; locale: Locale; t: T }) {
  const local = p.live!.startsWith("/demos/");
  return (
    <section className="relative mt-8 overflow-hidden rounded-xl border border-accent/30 bg-surface shadow-[0_20px_60px_-30px_color-mix(in_srgb,var(--accent)_60%,transparent)]">
      <div className="absolute inset-y-0 start-0 w-1 bg-accent" aria-hidden />
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-mono text-xs text-accent" dir="ltr">
            <span className="text-muted">$</span> open {local ? `./demos/${p.slug}` : new URL(p.live!).host}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{t.demo.title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{local ? t.demo.local : t.demo.remote}</p>

          {p.demoLogins && (
            <div className="mt-5 max-w-md rounded-lg border border-border bg-background/60 font-mono text-xs">
              <p className="border-b border-border px-4 py-2 text-muted">
                <span dir="ltr">{"// "}</span>
                {t.demo.logins}
              </p>
              {p.demoLogins.map((l) => (
                <dl key={l.user} className="divide-y divide-border">
                  <Cred label={`${t.demo.user} · ${pick(l.role, locale)}`} value={l.user} t={t} />
                  <Cred label={t.demo.pass} value={l.pass} t={t} />
                </dl>
              ))}
            </div>
          )}
          {p.demoNote && <p className="mt-3 text-xs text-muted">{pick(p.demoNote, locale)}</p>}
        </div>

        <a
          href={p.live}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 font-medium text-black transition hover:brightness-110"
        >
          <ExternalIcon className="size-4" /> {t.demo.cta}
          <span className="inline-block transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
        </a>
      </div>
    </section>
  );
}

function Cred({ label, value, t }: { label: string; value: string; t: T }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <dt className="w-28 shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 truncate text-foreground" dir="ltr">
        {value}
      </dd>
      <CopyButton value={value} label={t.demo.copy} done={t.demo.copied} />
    </div>
  );
}

/** Previous / next project, wrapping around, so visitors can keep browsing without going back home. */
function ProjectNav({ current, locale, t }: { current: string; locale: Locale; t: T }) {
  const i = featuredProjects.findIndex((x) => x.slug === current);
  const n = featuredProjects.length;
  const items = [
    { p: featuredProjects[(i - 1 + n) % n], label: t.prevProject, dir: "prev" as const },
    { p: featuredProjects[(i + 1) % n], label: t.nextProject, dir: "next" as const },
  ];
  return (
    <nav aria-label={t.nav} className="mt-20 border-t border-border pt-10">
      <p className="font-mono text-xs text-muted">
        <span className="text-accent" dir="ltr">
          ➜{" "}
        </span>
        {t.nav}
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map(({ p, label, dir }) => (
          <Link
            key={dir}
            href={`/${locale}/projects/${p.slug}`}
            className={`group flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-surface p-3 transition hover:-translate-y-0.5 hover:border-accent/50 ${
              dir === "next" ? "sm:flex-row-reverse sm:text-end" : ""
            }`}
          >
            <span className={`relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br sm:w-32 ${p.cover}`}>
              {p.image && (
                <Image src={p.image} alt="" fill sizes="128px" className="object-cover object-top transition duration-500 group-hover:scale-105" />
              )}
            </span>
            <span className="min-w-0">
              <span className="font-mono text-xs text-muted group-hover:text-accent">
                {dir === "prev" ? <span className="inline-block rtl:rotate-180">←</span> : null} {label}{" "}
                {dir === "next" ? <span className="inline-block rtl:rotate-180">→</span> : null}
              </span>
              <span className="mt-1 block truncate font-semibold">{pick(p.title, locale)}</span>
              {p.badge && <span className="mt-0.5 block truncate text-xs text-muted">{pick(p.badge, locale)}</span>}
            </span>
          </Link>
        ))}
      </div>
    </nav>
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
