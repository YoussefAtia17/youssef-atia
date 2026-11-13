import type { CSSProperties } from "react";

// Grid line index (44px apart), travel time and start offset for each pulse.
const pulses: { axis: "h" | "v"; line: number; dur: number; delay: number }[] = [
  { axis: "h", line: 3, dur: 11, delay: 0 },
  { axis: "v", line: 6, dur: 13, delay: 2.5 },
  { axis: "h", line: 9, dur: 14, delay: 5 },
  { axis: "v", line: 22, dur: 12, delay: 7.5 },
  { axis: "h", line: 14, dur: 12, delay: 9 },
  { axis: "v", line: 15, dur: 15, delay: 4 },
  { axis: "h", line: 18, dur: 13, delay: 11 },
  { axis: "v", line: 29, dur: 14, delay: 0.8 },
];

/**
 * Site-wide backdrop: a fixed circuit grid with soft corner lighting, and a few light pulses
 * running along its lines like signals. Pure CSS, no listeners; see `.ambient` in globals.css.
 */
export function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden>
      {pulses.map((p, i) => (
        <span
          key={i}
          className={`pulse pulse-${p.axis}`}
          style={{ "--line": p.line, "--dur": `${p.dur}s`, "--delay": `${p.delay}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}
