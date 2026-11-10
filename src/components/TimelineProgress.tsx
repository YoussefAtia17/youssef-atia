"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Drives the experience timeline while you scroll: the glowing line grows down to the middle of
 * the screen, and each entry lights up and slides in once the line reaches it. Done in JS so it
 * behaves the same in every browser.
 */
export function TimelineProgress({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      el.querySelectorAll("[data-exp]").forEach((e) => e.setAttribute("data-active", ""));
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const line = innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      el.style.setProperty("--p", p.toFixed(4));
      el.querySelectorAll<HTMLElement>("[data-exp]").forEach((item) => {
        item.toggleAttribute("data-active", item.getBoundingClientRect().top + 12 < line);
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
  }, []);

  return (
    <div ref={root} className="exp-track relative">
      <span className="exp-line absolute inset-y-0 start-0 w-0.5 -translate-x-1/2 rtl:translate-x-1/2" aria-hidden />
      {children}
    </div>
  );
}
