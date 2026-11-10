"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Item = { slug: string; kinds: string[]; card: ReactNode };

/**
 * Terminal-style filter over the project panels, and the controller for the stacked scroll.
 * Panels are rendered on the server and passed in. On wide screens each panel sticks a little
 * lower than the one before, so they pile up as you scroll. Only the panel on top plays its
 * demo clip; the ones underneath pause and dim.
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
  const list = useRef<HTMLDivElement>(null);
  const visible = active === "all" ? items : items.filter((i) => i.kinds.includes(active));
  const count = (key: string) => (key === "all" ? items.length : items.filter((i) => i.kinds.includes(key)).length);

  useEffect(() => {
    const root = list.current;
    if (!root) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const autoplay = !reduce && !saveData;
    let frame = 0;
    let current = -2;

    const update = () => {
      frame = 0;
      const cards = [...root.querySelectorAll<HTMLElement>("[data-stack]")];
      const vh = innerHeight;
      // The card on top is the last one whose top has passed the middle of the screen.
      let top = -1;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        if (r.top < vh * 0.55 && r.bottom > vh * 0.25) top = i;
      });
      if (top === current) return;
      current = top;
      cards.forEach((c, i) => {
        c.toggleAttribute("data-covered", top > -1 && i < top);
        const video = c.querySelector<HTMLVideoElement>("video[data-preview]");
        if (!video) return;
        if (i === top && autoplay) {
          video
            .play()
            .then(() => video.setAttribute("data-playing", ""))
            .catch(() => {});
        } else {
          video.pause();
          video.removeAttribute("data-playing");
        }
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [active]);

  return (
    <>
      <div className="mb-10 overflow-hidden rounded-xl border border-border bg-surface">
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

      <div ref={list} key={active} className="stack-list space-y-8 md:space-y-16">
        {visible.map((item, i) => (
          <div
            key={item.slug}
            data-stack
            className="filter-in"
            style={{ animationDelay: `${Math.min(i, 3) * 60}ms`, top: `calc(5rem + ${i * 14}px)` }}
          >
            {item.card}
          </div>
        ))}
      </div>
    </>
  );
}
