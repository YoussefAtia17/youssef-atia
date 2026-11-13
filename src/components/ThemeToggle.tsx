"use client";

import { useRef } from "react";

const BAND_MS = 460;
const STAGGER_MS = 34;
let registered = false;

/**
 * The new theme is "redrawn" over the old one line by line, like a terminal repainting the
 * screen: the page is cut into horizontal bands and each band wipes in from the toggle's side,
 * top to bottom with a small stagger. Runs on the View Transitions API (the browser snapshots
 * the old page, so nothing is re-rendered); browsers without it, and people who prefer reduced
 * motion, get the instant switch.
 */
export function ThemeToggle({ label }: { label: string }) {
  const button = useRef<HTMLButtonElement>(null);

  function apply() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  function toggle() {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce || !("registerProperty" in CSS)) {
      apply();
      return;
    }

    const vh = innerHeight;
    const bands = Math.min(18, Math.max(9, Math.round(vh / 52)));
    const h = vh / bands;
    // Bands open from whichever side the toggle sits on (the end side, so it follows RTL too).
    const r = button.current?.getBoundingClientRect();
    const fromRight = !r || r.left + r.width / 2 > innerWidth / 2;

    if (!registered) {
      registered = true;
      for (let i = 0; i < 18; i++) {
        try {
          CSS.registerProperty({ name: `--tb${i}`, syntax: "<percentage>", inherits: false, initialValue: "0%" });
        } catch {}
      }
    }

    // One mask layer per band; each layer's edge is driven by its own animated property.
    const dir = fromRight ? "to left" : "to right";
    const layers = Array.from({ length: bands }, (_, i) => `linear-gradient(${dir}, #000 calc(var(--tb${i}) - 3%), transparent var(--tb${i}))`);
    const style = document.createElement("style");
    style.textContent = `::view-transition-new(root){
      mask-image:${layers.join(",")};
      mask-size:100% ${Math.ceil(h) + 1}px;
      mask-position:${layers.map((_, i) => `0 ${Math.floor(i * h)}px`).join(",")};
      mask-repeat:no-repeat;
    }`;
    document.head.appendChild(style);

    const vt = document.startViewTransition(apply);
    vt.ready
      .then(() => {
        for (let i = 0; i < bands; i++) {
          document.documentElement.animate(
            { [`--tb${i}`]: ["0%", "103%"] },
            {
              duration: BAND_MS,
              delay: i * STAGGER_MS,
              easing: "cubic-bezier(.65,0,.25,1)",
              fill: "both",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        }
      })
      .catch(() => {});
    vt.finished.finally(() => style.remove());
  }

  // Icons switch via CSS (dark: variant), so server and client markup always match.
  return (
    <button
      ref={button}
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center overflow-hidden rounded-lg border border-border transition hover:bg-surface"
    >
      <svg className="theme-icon size-4 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg className="theme-icon hidden size-4 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
