import {
  siArduino,
  siCplusplus,
  siDart,
  siDocker,
  siFastapi,
  siFirebase,
  siFlask,
  siFlutter,
  siGit,
  siGithub,
  siGooglegemini,
  siJavascript,
  siMysql,
  siN8n,
  siNextdotjs,
  siPostgresql,
  siPython,
  siRaspberrypi,
  siSupabase,
  siSwift,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

const tech: [SimpleIcon, string?][] = [
  [siSwift, "Swift / SwiftUI"],
  [siSupabase],
  [siPostgresql],
  [siFlutter],
  [siDart],
  [siPython],
  [siFlask],
  [siFastapi],
  [siTypescript],
  [siJavascript],
  [siTailwindcss],
  [siNextdotjs],
  [siFirebase],
  [siMysql],
  [siGooglegemini, "Gemini API"],
  [siN8n],
  [siDocker],
  [siGit],
  [siGithub],
  [siVercel],
  [siRaspberrypi],
  [siArduino],
  [siCplusplus],
];

/** Endless strip of the tools I ship with. Logos stay quiet and take their brand color on hover. */
export function TechMarquee({ label }: { label: string }) {
  const row = (hidden: boolean) => (
    <ul className="marquee-track flex shrink-0 items-center gap-3 pe-3" aria-hidden={hidden || undefined}>
      {tech.map(([icon, name]) => {
        // Black logos would vanish on the dark theme, so those keep the text color.
        const dark = parseInt(icon.hex, 16) < 0x333333;
        return (
          <li
            key={icon.slug}
            className="group/t inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-2 font-mono text-xs text-muted transition hover:border-accent/40 hover:text-foreground"
            style={{ "--brand": dark ? "var(--foreground)" : `#${icon.hex}` } as React.CSSProperties}
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current transition group-hover/t:fill-[var(--brand)]" aria-hidden>
              <path d={icon.path} />
            </svg>
            {name ?? icon.title}
          </li>
        );
      })}
    </ul>
  );

  return (
    <section aria-label={label} className="marquee relative overflow-hidden border-y border-border bg-surface-2/30 py-5" dir="ltr">
      <div className="flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
