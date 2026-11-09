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
    <Section id="projects" index="02" title={dict.title} subtitle={dict.subtitle}>
      <div className="grid gap-6 md:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} locale={locale} dict={dict} wide={i === 0} />
        ))}
      </div>

      <div className="mt-20 overflow-hidden rounded-xl border border-border bg-surface">
        <p className="border-b border-border bg-surface-2/70 px-5 py-3 font-mono text-xs text-muted" dir="ltr">
          <span className="text-accent">➜</span> ~ ls archive/ <span className="text-muted/60"># {dict.earlier}</span>
        </p>
        <ul className="divide-y divide-border">
          {earlierProjects.map((p) => (
            <li key={p.slug} className="grid gap-2 px-5 py-4 sm:grid-cols-[16rem_1fr] sm:gap-6">
              <span className="font-medium">
                <span className="font-mono text-accent" dir="ltr">▸ </span>
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

function ProjectCard({ project: p, locale, dict, wide }: { project: Project; locale: Locale; dict: Dict; wide: boolean }) {
  const title = pick(p.title, locale);
  const href = `/${locale}/projects/${p.slug}`;
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_0_1px_var(--accent),0_20px_60px_-20px_color-mix(in_srgb,var(--accent)_45%,transparent)] ${
        wide ? "md:col-span-2 md:grid md:grid-cols-[1.35fr_1fr]" : ""
      }`}
    >
      <div className="flex flex-col">
        <div className="flex h-9 items-center gap-2 border-b border-border bg-surface-2/70 px-4" dir="ltr">
          <span className="size-2.5 rounded-full bg-border group-hover:bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-border group-hover:bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-border group-hover:bg-[#28c840]" />
          <span className="ms-3 truncate font-mono text-xs text-muted">~/projects/{p.slug}</span>
        </div>
        <Link href={href} tabIndex={-1} className={`relative block aspect-[16/9] flex-1 overflow-hidden bg-gradient-to-br ${p.cover}`}>
          {p.image ? (
            <Image
              quality={90}
              src={p.image}
              alt={title}
              fill
              sizes={wide ? "(min-width: 768px) 640px, 100vw" : "(min-width: 768px) 560px, 100vw"}
              className="object-cover object-top transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <span className="absolute inset-0 flex flex-col justify-center gap-1.5 bg-[#0b0f14]/85 px-8 font-mono text-xs leading-relaxed sm:text-sm" dir="ltr">
              <span className="text-white/40">{"// "}{p.slug}.config</span>
              <span>
                <span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">project</span>{" "}
                <span className="text-white/60">= {"{"}</span>
              </span>
              <span className="ps-4">
                <span className="text-white/60">name:</span> <span className="text-[#c3e88d]">&quot;{p.title.en}&quot;</span>,
              </span>
              <span className="ps-4">
                <span className="text-white/60">stack:</span>{" "}
                <span className="text-[#c3e88d]">[{p.stack.slice(0, 3).map((s) => `"${s}"`).join(", ")}]</span>,
              </span>
              <span className="text-white/60">{"};"}</span>
            </span>
          )}
        </Link>
      </div>

      <div className={`flex flex-1 flex-col p-6 ${wide ? "md:border-s md:border-border md:p-8" : ""}`}>
        {p.badge && (
          <p className="font-mono text-xs text-accent">
            <span dir="ltr">// </span>
            {pick(p.badge, locale)}
          </p>
        )}
        <h3 className={`mt-2 font-semibold tracking-tight ${wide ? "text-2xl sm:text-3xl" : "text-xl"}`}>
          <Link href={href} className="after:absolute after:inset-0 hover:text-accent">
            {title}
          </Link>
        </h3>
        <p className={`mt-3 flex-1 text-sm leading-relaxed text-muted ${wide ? "" : "line-clamp-4"}`}>{pick(p.summary, locale)}</p>
        {p.role && (
          <p className="mt-3 text-sm">
            <span className="font-medium">{dict.role}:</span> <span className="text-muted">{pick(p.role, locale)}</span>
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 font-mono text-xs">
          <Link href={href} className="inline-flex items-center gap-1 text-foreground hover:text-accent">
            {dict.details} <span className="inline-block rtl:rotate-180">→</span>
          </Link>
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-accent hover:underline">
              <ExternalIcon className="size-3.5" /> {dict.live}
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-foreground">
              <GithubIcon className="size-3.5" /> {dict.code}
            </a>
          )}
          {p.privateCode && (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <LockIcon className="size-3.5" /> {dict.privateCode}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
