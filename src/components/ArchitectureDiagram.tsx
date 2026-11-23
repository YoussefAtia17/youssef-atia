import type { Locale } from "@/i18n/config";
import type { Architecture } from "@/content/architecture";
import { pick } from "@/content/types";

const NW = 164; // node width
const NH = 56; // node height
const CP = 216; // column pitch
const RP = 80; // row pitch
const PAD = 12;

/**
 * A project's architecture as an SVG: boxes on a grid, curved connections, and small light
 * pulses travelling along each connection (SMIL animateMotion, so no JavaScript). Columns flip
 * for Arabic so the flow reads right to left. Pulses are hidden for reduced motion.
 */
export function ArchitectureDiagram({ arch, locale }: { arch: Architecture; locale: Locale }) {
  const rtl = locale === "ar";
  const maxCol = Math.max(...arch.nodes.map((n) => n.col));
  const maxRow = Math.max(...arch.nodes.map((n) => n.row));
  const W = maxCol * CP + NW + PAD * 2;
  const H = maxRow * RP + NH + PAD * 2;

  const pos = new Map(
    arch.nodes.map((n) => [n.id, { x: PAD + (rtl ? maxCol - n.col : n.col) * CP, y: PAD + n.row * RP }]),
  );

  const paths = arch.edges.map((e) => {
    const a = pos.get(e.from)!;
    const b = pos.get(e.to)!;
    const forward = b.x > a.x;
    const sx = forward ? a.x + NW : a.x;
    const ex = forward ? b.x : b.x + NW;
    const sy = a.y + NH / 2;
    const ey = b.y + NH / 2;
    const dx = (ex - sx) / 2;
    return { ...e, d: `M${sx} ${sy} C${sx + dx} ${sy} ${ex - dx} ${ey} ${ex} ${ey}` };
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface/60 p-3 sm:p-4" dir={rtl ? "rtl" : "ltr"}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="arch mx-auto block h-auto w-full min-w-[600px]"
        style={{ maxWidth: W }}
        role="img"
        aria-label={arch.nodes.map((n) => pick(n.label, locale)).join(" → ")}
      >
        {paths.map((p) => (
          <path key={`${p.from}-${p.to}`} d={p.d} className="arch-edge" fill="none" />
        ))}

        {paths.map((p, i) => {
          const dur = 2.2 + (i % 3) * 0.45;
          // Negative start times: every pulse is already mid-flight on first paint, none parked at 0,0.
          const begin = -((i * 0.55) % dur);
          return (
            <g key={`pulse-${p.from}-${p.to}`} className="arch-pulse">
              <circle r="3.2">
                <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={p.d} />
              </circle>
              {p.both && (
                <circle r="2.6" className="arch-pulse-back">
                  <animateMotion
                    dur={`${dur}s`}
                    begin={`${begin - dur / 2}s`}
                    repeatCount="indefinite"
                    path={p.d}
                    keyPoints="1;0"
                    keyTimes="0;1"
                    calcMode="linear"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {arch.nodes.map((n) => {
          const { x, y } = pos.get(n.id)!;
          const cx = x + NW / 2;
          return (
            <g key={n.id} className={n.col === 0 ? "arch-node arch-entry" : "arch-node"}>
              <rect x={x} y={y} width={NW} height={NH} rx={10} />
              <text x={cx} y={n.sub ? y + 23 : y + NH / 2 + 4.5} textAnchor="middle" className="arch-label" direction={rtl ? "rtl" : "ltr"}>
                {pick(n.label, locale)}
              </text>
              {n.sub && (
                <text x={cx} y={y + 41} textAnchor="middle" className="arch-sub" direction={rtl ? "rtl" : "ltr"}>
                  {pick(n.sub, locale)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
