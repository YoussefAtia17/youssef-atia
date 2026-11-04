import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { earlierProjects, featuredProjects, type Project } from "@/content/projects";
import { pick } from "@/content/types";
import { Section, Tag } from "../Section";
import { ExternalIcon, GithubIcon, LockIcon } from "../icons";

type Dict = Dictionary["projects"];

export function Projects({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <Section id="projects" title={dict.title} subtitle={dict.subtitle}>
      <div className="grid gap-6 sm:grid-cols-2">
        {featuredProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} locale={locale} dict={dict} />
        ))}
      </div>

      <h3 className="mt-20 mb-6 text-xl font-semibold">{dict.earlier}</h3>
      <ul className="divide-y divide-border rounded-2xl border border-border">
        {earlierProjects.map((p) => (
          <li key={p.slug} className="grid gap-2 p-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
            <span className="font-medium">{pick(p.title, locale)}</span>
            <div>
              <p className="text-sm text-muted">{pick(p.summary, locale)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ProjectCard({ project: p, locale, dict }: { project: Project; locale: Locale; dict: Dict }) {
  const title = pick(p.title, locale);
  const href = `/${locale}/projects/${p.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/40 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
      <Link href={href} className={`relative block aspect-[16/10] overflow-hidden bg-gradient-to-br ${p.cover}`} tabIndex={-1}>
        {p.image ? (
          <Image
            src={p.image}
            alt={title}
            fill
            sizes="(min-width: 640px) 480px, 100vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center px-6 text-center text-2xl font-bold text-white/95 drop-shadow">
            {title}
          </span>
        )}
        {p.badge && (
          <span className="absolute top-3 start-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {pick(p.badge, locale)}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold">
          <Link href={href} className="hover:text-accent">
            {title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{pick(p.summary, locale)}</p>
        {p.role && (
          <p className="mt-3 text-sm">
            <span className="font-medium">{dict.role}:</span> <span className="text-muted">{pick(p.role, locale)}</span>
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link href={href} className="inline-flex items-center gap-1 hover:text-accent">
            {dict.details} <span className="inline-block rtl:rotate-180">→</span>
          </Link>
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-accent hover:underline">
              <ExternalIcon className="size-4" /> {dict.live}
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
              <GithubIcon className="size-4" /> {dict.code}
            </a>
          )}
          {p.privateCode && (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <LockIcon className="size-4" /> {dict.privateCode}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
