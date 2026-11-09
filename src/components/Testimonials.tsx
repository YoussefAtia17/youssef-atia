import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { featuredProjects } from "@/content/projects";
import type { Testimonial } from "@/content/testimonials";
import { pick } from "@/content/types";

/** Client quotes. Renders nothing until there is at least one real quote. */
export function Testimonials({ items, locale, title }: { items: Testimonial[]; locale: Locale; title: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-label={title} className="mt-16">
      <p className="font-mono text-xs text-muted">
        <span className="text-accent" dir="ltr">
          {"// "}
        </span>
        {title}
      </p>
      <div className={`mt-5 grid gap-6 ${items.length > 1 ? "md:grid-cols-2" : ""}`}>
        {items.map((t) => {
          const project = featuredProjects.find((p) => p.slug === t.project);
          const name = pick(t.name, locale);
          return (
            <figure
              key={name}
              className="relative overflow-hidden rounded-xl border border-border bg-surface p-6 sm:p-8"
            >
              <span className="pointer-events-none absolute -top-6 end-4 font-mono text-[9rem] leading-none text-accent/10" aria-hidden>
                &rdquo;
              </span>
              <blockquote className="relative text-lg leading-relaxed sm:text-xl">{pick(t.quote, locale)}</blockquote>
              <figcaption className="relative mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/15 font-semibold text-accent">
                  {name.trim().charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium">{name}</span>
                  <span className="block truncate text-sm text-muted">
                    {pick(t.role, locale)}
                    {project && (
                      <>
                        {" · "}
                        <Link href={`/${locale}/projects/${project.slug}`} className="text-accent hover:underline">
                          {pick(project.title, locale)}
                        </Link>
                      </>
                    )}
                  </span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
