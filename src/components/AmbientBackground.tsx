"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide backdrop that sits behind every section: slow aurora blobs that also travel as you
 * scroll (so each section is lit a little differently), a faint dot grid, a flashlight that
 * lights up the dots around the mouse, and a touch of film grain. Only transforms and two CSS
 * variables change, so it stays on the compositor. Reduced motion keeps it still.
 */
export function AmbientBackground() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let mx = -1000;
    let my = -1000;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      el.style.setProperty("--sp", max > 0 ? (scrollY / max).toFixed(4) : "0");
      el.style.setProperty("--mx", `${mx}px`);
      el.style.setProperty("--my", `${my}px`);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      el.setAttribute("data-spot", "");
      request();
    };
    const onLeave = () => el.removeAttribute("data-spot");

    update();
    if (reduce) return;
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={root} className="ambient" aria-hidden>
      <div className="amb-blob amb-a" />
      <div className="amb-blob amb-b" />
      <div className="amb-blob amb-c" />
      <div className="amb-dots" />
      <div className="amb-spot" />
      <div className="amb-grain" />
    </div>
  );
}
