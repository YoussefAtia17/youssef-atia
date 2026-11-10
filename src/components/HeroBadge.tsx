"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A developer ID card hanging from a lanyard. It drops in with a swing, sways when the pointer
 * moves past it, can be grabbed and thrown, and flips over on click to show the terminal side.
 * The swing is a small damped spring run in requestAnimationFrame; nothing moves for people who
 * prefer reduced motion.
 */
export function HeroBadge({ front, back, hint, flipLabel }: { front: ReactNode; back: ReactNode; hint: string; flipLabel: string }) {
  const pendulum = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const state = useRef({ angle: 28, vel: 0, dragging: false, moved: 0, lastX: 0 });
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = pendulum.current;
    if (!el) return;
    const s = state.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      s.angle = 0;
      el.style.transform = "rotate(0deg)";
      return;
    }

    let raf = 0;
    let last = performance.now();
    let resting = false;
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      if (!s.dragging) {
        // Damped spring back to hanging straight down.
        s.vel += (-38 * s.angle - 2.4 * s.vel) * dt;
        s.angle += s.vel * dt;
      }
      el.style.transform = `rotate(${s.angle.toFixed(3)}deg)`;
      resting = !s.dragging && Math.abs(s.angle) < 0.02 && Math.abs(s.vel) < 0.02;
      raf = resting ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    wake();

    // A passing pointer gives the card a light push.
    const hero = el.closest("section");
    const onMove = (e: PointerEvent) => {
      if (s.dragging || e.pointerType !== "mouse") return;
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      if (Math.abs(dx) > 40) return;
      s.vel = Math.max(-90, Math.min(90, s.vel - dx * 0.35));
      wake();
    };
    hero?.addEventListener("pointermove", onMove);
    wakeRef.current = wake;
    return () => {
      cancelAnimationFrame(raf);
      hero?.removeEventListener("pointermove", onMove);
    };
  }, []);

  const angleAt = (x: number, y: number) => {
    const el = pendulum.current!;
    const r = el.parentElement!.getBoundingClientRect();
    const px = r.left + r.width / 2;
    const py = r.top + el.offsetTop;
    // Pivot sits at the top of the strap; the card points from it toward the pointer.
    const deg = (-Math.atan2(x - px, Math.max(40, y - py)) * 180) / Math.PI;
    return Math.max(-65, Math.min(65, deg));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    const s = state.current;
    s.dragging = true;
    s.moved = 0;
    s.vel = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    wakeRef.current();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging) return;
    s.moved += Math.abs(e.movementX) + Math.abs(e.movementY);
    if (s.moved < 6) return;
    const next = angleAt(e.clientX, e.clientY);
    s.vel = (next - s.angle) * 30;
    s.angle = next;
  };
  const onPointerUp = () => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    if (s.moved < 6) {
      s.vel += flipped ? -40 : 40;
      setFlipped((f) => !f);
    }
    wakeRef.current();
  };

  return (
    <div className="badge-stage relative mx-auto flex min-h-[37rem] w-full max-w-sm justify-center self-stretch lg:min-h-[40rem]">
      <div ref={pendulum} className="badge-drop absolute top-0 flex origin-top flex-col items-center lg:-top-44" style={{ transform: "rotate(28deg)" }}>
        {/* Lanyard strap and clip */}
        <div className="badge-strap h-20 w-7 lg:h-72" aria-hidden />
        <div className="relative -mt-1 h-7 w-10 rounded-md border border-white/20 bg-gradient-to-b from-zinc-300 to-zinc-500 shadow-md" aria-hidden>
          <span className="absolute inset-x-2.5 bottom-1 h-2 rounded-full border-2 border-zinc-700/60" />
        </div>
        <div className="-mt-1 h-4 w-1.5 rounded-b bg-zinc-400" aria-hidden />

        <div
          className="badge-card relative h-[27.5rem] w-[18.5rem] cursor-grab touch-none select-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className={`badge-inner relative size-full ${flipped ? "is-flipped" : ""}`}>
            <div className="badge-face" aria-hidden={flipped}>
              {front}
            </div>
            <div className="badge-face badge-back" aria-hidden={!flipped}>
              {back}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipLabel}
            aria-pressed={flipped}
            className="absolute end-3 top-3 z-10 grid size-7 place-items-center rounded-full border border-border bg-surface/80 font-mono text-sm text-muted backdrop-blur transition hover:border-accent hover:text-accent"
          >
            ⟲
          </button>
        </div>
        <p className="mt-4 font-mono text-[11px] text-muted/70" dir="ltr">
          {hint}
        </p>
      </div>
    </div>
  );
}
