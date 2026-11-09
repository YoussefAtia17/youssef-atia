"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A short muted demo clip layered over a card's cover image.
 * Mouse users: plays while the card is hovered or focused. Touch users: plays while the card is
 * mostly on screen. Nothing downloads until the first play, and it never autoplays for people who
 * prefer reduced motion or have Data Saver on.
 */
export function HoverVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    const card = video?.closest("article");
    if (!video || !card) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;

    const play = () => {
      video.play().then(() => setPlaying(true)).catch(() => {});
    };
    const stop = () => {
      video.pause();
      setPlaying(false);
    };

    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const leave = () => {
        stop();
        video.currentTime = 0;
      };
      card.addEventListener("mouseenter", play);
      card.addEventListener("mouseleave", leave);
      card.addEventListener("focusin", play);
      card.addEventListener("focusout", leave);
      return () => {
        card.removeEventListener("mouseenter", play);
        card.removeEventListener("mouseleave", leave);
        card.removeEventListener("focusin", play);
        card.removeEventListener("focusout", leave);
      };
    }

    const io = new IntersectionObserver(([e]) => (e.intersectionRatio >= 0.6 ? play() : stop()), { threshold: [0, 0.6, 1] });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
        className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
      />
      <span
        className={`pointer-events-none absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/70 px-2 py-1 font-mono text-[10px] text-white/85 backdrop-blur transition ${
          playing ? "opacity-0" : "opacity-100"
        }`}
        dir="ltr"
      >
        <span className="size-1.5 rounded-full bg-accent" /> {label}
      </span>
    </>
  );
}
