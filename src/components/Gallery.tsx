"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Labels = { open: string; close: string; next: string; prev: string };

const fileName = (src: string) => src.split("/").pop() ?? src;

/**
 * Screenshot grid that opens an in-page viewer (native <dialog>, so focus and Esc come for free).
 * Arrow keys follow reading direction, and touch users can swipe.
 */
export function Gallery({
  images,
  title,
  slug,
  rtl,
  labels,
}: {
  images: string[];
  title: string;
  slug: string;
  rtl: boolean;
  labels: Labels;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const count = images.length;

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const go = useCallback((step: number) => setIndex((i) => (i === null ? i : (i + step + count) % count)), [count]);

  // Lock page scroll while the viewer is open.
  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [isOpen]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    if (index === null) return;
    strip.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const forward = e.key === (rtl ? "ArrowLeft" : "ArrowRight");
    go(forward ? 1 : -1);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    // Swiping toward the reading start moves forward, like turning a page.
    const forward = rtl ? dx > 0 : dx < 0;
    go(forward ? 1 : -1);
  };

  const current = index === null ? null : images[index];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => open(i)}
            aria-label={`${labels.open}: ${title} (${i + 1})`}
            className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-border bg-surface text-start transition hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Image
              quality={90}
              src={src}
              alt={`${title} (${i + 1})`}
              width={1600}
              height={900}
              sizes="(min-width: 640px) 560px, 100vw"
              className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
            />
            <span
              className="absolute bottom-3 end-3 rounded-md border border-white/10 bg-black/70 px-2 py-1 font-mono text-[11px] text-white/80 opacity-0 backdrop-blur transition group-hover:opacity-100"
              dir="ltr"
            >
              ⤢ {pad(i + 1)}/{pad(count)}
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={onKey}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
        aria-label={title}
        className="lightbox m-auto max-h-none max-w-none bg-transparent p-3 text-foreground backdrop:bg-black/80 backdrop:backdrop-blur-md sm:p-6"
      >
        {current !== null && index !== null && (
          <div className="flex h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-7xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl sm:h-[calc(100dvh-3rem)] sm:w-[calc(100vw-3rem)]">
            {/* Window bar */}
            <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-surface-2/70 px-4" dir="ltr">
              <button type="button" onClick={close} aria-label={labels.close} className="size-3 rounded-full bg-[#ff5f57] hover:brightness-110" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ms-3 min-w-0 truncate font-mono text-xs text-muted">
                ~/projects/{slug}/<span className="text-foreground">{fileName(current)}</span>
              </span>
              <span className="ms-auto shrink-0 whitespace-nowrap font-mono text-xs text-muted">
                <span className="text-accent">{pad(index + 1)}</span> / {pad(count)}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={labels.close}
                className="ms-3 grid size-7 place-items-center rounded-md text-muted transition hover:bg-border/60 hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Image stage */}
            <div className="relative min-h-0 flex-1 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_70%)]">
              <Image
                key={current}
                src={current}
                alt={`${title} (${index + 1})`}
                fill
                quality={90}
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="lightbox-img object-contain p-2 sm:p-6"
              />
              {count > 1 && (
                <>
                  <NavButton side="start" label={labels.prev} onClick={() => go(-1)} />
                  <NavButton side="end" label={labels.next} onClick={() => go(1)} />
                </>
              )}
            </div>

            {/* Thumbnails */}
            {count > 1 && (
              <div ref={strip} className="flex shrink-0 gap-2 overflow-x-auto border-t border-border bg-surface-2/50 p-3">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    data-i={i}
                    onClick={() => setIndex(i)}
                    aria-label={`${title} (${i + 1})`}
                    aria-current={i === index}
                    className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-md border transition sm:w-28 ${
                      i === index ? "border-accent ring-1 ring-accent" : "border-border opacity-55 hover:opacity-100"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="112px" className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

function NavButton({ side, label, onClick }: { side: "start" | "end"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 grid size-9 -translate-y-1/2 sm:size-11 place-items-center rounded-full border border-border bg-surface/80 text-lg text-foreground shadow-lg backdrop-blur transition hover:border-accent hover:text-accent ${
        side === "start" ? "start-3" : "end-3"
      }`}
    >
      {/* Arrows flip in RTL so they always point the way they move. */}
      <span className="inline-block rtl:rotate-180">{side === "start" ? "←" : "→"}</span>
    </button>
  );
}
