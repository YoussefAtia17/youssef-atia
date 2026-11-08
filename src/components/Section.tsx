import type { ReactNode } from "react";

type Props = { id: string; index: string; title: string; subtitle?: string; children: ReactNode };

export function Section({ id, index, title, subtitle, children }: Props) {
  return (
    <section id={id} className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-accent" dir="ltr">
            {index}.
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent rtl:bg-gradient-to-l" aria-hidden />
        </div>
        {subtitle && <p className="mt-3 max-w-2xl text-muted">{subtitle}</p>}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-md border border-border bg-surface-2/60 px-2 py-0.5 font-mono text-[11px] text-muted"
      dir="ltr"
    >
      {children}
    </span>
  );
}

/** A terminal / editor style window: three dots and a title in the bar. */
export function Window({
  title,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/20 ${className}`}>
      <div className="flex h-9 items-center gap-2 border-b border-border bg-surface-2/70 px-4" dir="ltr">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        {title && <span className="ms-3 truncate font-mono text-xs text-muted">{title}</span>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
