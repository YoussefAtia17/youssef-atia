import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { contact, whatsappUrl } from "@/content/profile";
import { WhatsAppIcon } from "../icons";
import { earlierProjects, featuredProjects } from "@/content/projects";
import { Window } from "../Section";
import { HeroBadge } from "../HeroBadge";

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
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#25d366]/40 bg-[#25d366]/10 px-5 py-3 font-medium text-[#25d366] transition hover:bg-[#25d366]/20"
              >
                <WhatsAppIcon className="size-4" /> {dict.whatsapp}
              </a>
            )}
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

        <HeroBadge
          hint={dict.badge.hint}
          flipLabel={dict.badge.flip}
          front={<BadgeFront dict={dict} />}
          back={
            <Window title="~/youssef-atia — zsh" className="flex size-full flex-col !shadow-none" bodyClassName="flex-1 p-4 font-mono text-[10.5px] leading-relaxed">
              <div dir="ltr" className="text-start">
                <Prompt cmd="whoami" />
                <p className="text-foreground">Youssef Atia · full-stack developer</p>

                <Prompt cmd="cat stack.json" className="mt-3" />
                <p className="text-muted">{"{"}</p>
                {stack.map(([key, items], i) => (
                  <p key={key} className="ps-3">
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

                <Prompt cmd="ls projects/" className="mt-3" />
                <p className="flex flex-wrap gap-x-3">
                  {featuredProjects.map((p) => (
                    <Link key={p.slug} href={`/${locale}/projects/${p.slug}`} className="text-accent-2 hover:underline">
                      {p.slug}/
                    </Link>
                  ))}
                </p>

                <p className="mt-3">
                  <span className="text-accent">➜</span> <span className="text-accent-2">~</span> <span className="cursor" />
                </p>
              </div>
            </Window>
          }
        />
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

/** Front of the hanging ID card. */
function BadgeFront({ dict }: { dict: Dictionary["hero"] }) {
  const b = dict.badge;
  const fields = [
    [b.location, b.locationValue],
    [b.focus, "Backend · iOS · Web"],
    [b.stack, "Supabase · SwiftUI"],
    [b.status, b.statusValue],
  ];
  // Fixed bar pattern so the barcode looks the same on every render.
  const bars = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2];

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]">
      <div className="badge-band relative h-28 shrink-0">
        <span className="absolute start-1/2 top-3 h-2 w-14 -translate-x-1/2 rounded-full border border-border bg-background/80 rtl:translate-x-1/2" />
        <p className="absolute start-4 bottom-3 font-mono text-[10px] tracking-widest text-white/80" dir="ltr">
          DEV ID · 2026
        </p>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5">
        <Image
          src="/youssef-avatar.jpg"
          alt={dict.name}
          width={176}
          height={176}
          quality={90}
          draggable={false}
          className="relative -mt-11 size-[5.5rem] rounded-2xl bg-surface-2 object-cover ring-4 ring-surface"
        />
        <p className="mt-3 text-xl font-bold tracking-tight">{dict.name}</p>
        <p className="font-mono text-xs text-accent">{b.role}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
          {fields.map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[9px] tracking-widest text-muted uppercase">{k}</dt>
              <dd className="mt-0.5 text-[12px] leading-snug font-medium">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4" dir="ltr">
          <div className="flex h-9 items-stretch gap-[2px]" aria-hidden>
            {bars.map((w, i) => (
              <span key={i} className="bg-foreground/80" style={{ width: w }} />
            ))}
          </div>
          <span className="font-mono text-[10px] text-muted">@YoussefAtia17</span>
        </div>
      </div>
    </div>
  );
}
