import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { contact } from "@/content/profile";
import { earlierProjects, featuredProjects } from "@/content/projects";
import { Window } from "../Section";

const stack: [string, string[]][] = [
  ["web", ["Flask", "FastAPI", "Tailwind", "JS/TS"]],
  ["mobile", ["SwiftUI", "Flutter"]],
  ["data", ["Supabase", "PostgreSQL"]],
  ["ai", ["OCR", "Gemini API", "n8n"]],
];

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary["hero"] }) {
  const clients = featuredProjects.filter((p) => p.badge?.en.startsWith("Client")).length;
  const stats = [
    { value: `${featuredProjects.length + earlierProjects.length}+`, label: dict.stats.projects },
    { value: String(clients), label: dict.stats.clients },
    { value: "2", label: dict.stats.langs },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
      <div className="glow absolute -top-40 start-1/2 -z-10 size-[42rem] -translate-x-1/2 rtl:translate-x-1/2" aria-hidden />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_1fr]">
        <div className="rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {dict.status}
          </span>

          <p className="mt-8 font-mono text-sm text-muted">
            <span className="text-accent" dir="ltr">&gt;_ </span>
            {dict.greeting}
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-7xl">
            <span className="cursor cursor-bar">{dict.name}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">{dict.tagline}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-medium text-black transition hover:brightness-110"
            >
              {dict.ctaProjects} <span className="inline-block rtl:rotate-180">→</span>
            </a>
            <a
              href={contact.cv}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-5 py-3 font-medium backdrop-blur transition hover:border-accent/50"
            >
              <span className="font-mono text-accent" dir="ltr">↓</span> {dict.ctaCv}
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-mono text-2xl font-semibold text-foreground">{s.value}</dd>
                <dd className="mt-1 text-xs text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Window title="~/youssef-atia — zsh" className="rise [animation-delay:150ms]" bodyClassName="p-5 font-mono text-[13px] leading-relaxed">
          <div dir="ltr" className="text-start">
            <Prompt cmd="whoami" />
            <p className="text-foreground">Youssef Atia · full-stack developer · CS @ ECU</p>

            <Prompt cmd="cat stack.json" className="mt-4" />
            <p className="text-muted">{"{"}</p>
            {stack.map(([key, items], i) => (
              <p key={key} className="ps-4">
                <span className="text-accent-2">&quot;{key}&quot;</span>
                <span className="text-muted">: [</span>
                {items.map((s, j) => (
                  <span key={s}>
                    <span className="text-accent">&quot;{s}&quot;</span>
                    {j < items.length - 1 && <span className="text-muted">, </span>}
                  </span>
                ))}
                <span className="text-muted">]{i < stack.length - 1 ? "," : ""}</span>
              </p>
            ))}
            <p className="text-muted">{"}"}</p>

            <Prompt cmd="ls projects/" className="mt-4" />
            <p className="flex flex-wrap gap-x-4">
              {featuredProjects.map((p) => (
                <Link key={p.slug} href={`/${locale}/projects/${p.slug}`} className="text-accent-2 hover:underline">
                  {p.slug}/
                </Link>
              ))}
            </p>

            <p className="mt-4">
              <span className="text-accent">➜</span> <span className="text-accent-2">~</span> <span className="cursor" />
            </p>
          </div>
        </Window>
      </div>
    </section>
  );
}

function Prompt({ cmd, className = "" }: { cmd: string; className?: string }) {
  return (
    <p className={className}>
      <span className="text-accent">➜</span> <span className="text-accent-2">~</span>{" "}
      <span className="text-foreground">{cmd}</span>
    </p>
  );
}
