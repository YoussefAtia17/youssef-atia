"use client";

import { useState, type ReactNode } from "react";

type Item = { slug: string; kinds: string[]; card: ReactNode; wideCard?: ReactNode };

/**
 * Terminal-style filter over the project cards. Cards are rendered on the server and passed in,
 * so this only decides which ones show. The first card is wide only in the unfiltered view.
 */
export function ProjectFilter({
  items,
  filters,
  label,
}: {
  items: Item[];
  filters: { key: string; label: string }[];
  label: string;
}) {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? items : items.filter((i) => i.kinds.includes(active));
  const count = (key: string) => (key === "all" ? items.length : items.filter((i) => i.kinds.includes(key)).length);

  return (
    <>
      <div className="mb-8 overflow-hidden rounded-xl border border-border bg-surface">
        <p className="border-b border-border bg-surface-2/70 px-4 py-2.5 font-mono text-xs text-muted" dir="ltr">
          <span className="text-accent">➜</span> <span className="text-accent-2">~</span> ls projects/
          {active !== "all" && <span className="text-foreground"> --{active}</span>}
          <span className="cursor" />
        </p>
        <div role="group" aria-label={label} className="flex gap-2 overflow-x-auto p-3">
          {filters.map((f) => {
            const on = f.key === active;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(f.key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
                  on
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                <span>
                  <span dir="ltr">{f.key === "all" ? "*" : "--"}</span>
                  {f.label}
                </span>
                <span className={`rounded px-1.5 text-[10px] ${on ? "bg-accent text-black" : "bg-surface-2 text-muted"}`}>{count(f.key)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div key={active} className="grid gap-6 md:grid-cols-2">
        {visible.map((item, i) => (
          <div
            key={item.slug}
            className={`filter-in flex ${active === "all" && i === 0 && item.wideCard ? "md:col-span-2" : ""}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {active === "all" && i === 0 && item.wideCard ? item.wideCard : item.card}
          </div>
        ))}
      </div>
    </>
  );
}
