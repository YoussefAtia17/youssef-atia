import type { ReactNode } from "react";

type Props = { id: string; title: string; subtitle?: string; children: ReactNode };

export function Section({ id, title, subtitle, children }: Props) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 max-w-2xl text-muted">{subtitle}</p>}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-muted" dir="ltr">
      {children}
    </span>
  );
}
