/**
 * BrandMark — the one signature shared by every version of the site: an "MA"
 * ligature where the M's last stroke becomes the A, on a cyan → blue tile
 * (the developer site's cyan meeting the recruiter / client blue).
 *
 * `draw` traces the strokes in on mount; hovering a parent `.group` re-draws.
 * The tile is a CSS gradient (not an SVG <linearGradient>) so repeated or
 * hidden copies never lose their fill.
 */
export const MARK_PATH =
  "M7.25 23.5V8.5l6 8.5 6-8.5M19.25 8.5l-5.5 15M19.25 8.5l5.5 15M15.95 18h6.6";

const strokes = (color: string) =>
  `<svg width="100%" height="100%" viewBox="0 0 32 32" aria-hidden="true"><path class="bm-stroke" pathLength="1" d="${MARK_PATH}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** the mark as an HTML string — for imperative DOM (page hand-off) */
export function markHtml(size: number) {
  return `<span class="bm bm-tile bm-draw" style="width:${size}px;height:${size}px">${strokes("#fff")}</span>`;
}

export function BrandMark({
  size = 32,
  tile = true,
  draw = false,
  className = "",
  title,
}: {
  size?: number;
  /** gradient tile behind white strokes; false = strokes in currentColor */
  tile?: boolean;
  draw?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`bm ${tile ? "bm-tile" : ""} ${draw ? "bm-draw" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width="100%" height="100%" viewBox="0 0 32 32" aria-hidden>
        <path
          className="bm-stroke"
          pathLength={1}
          d={MARK_PATH}
          fill="none"
          stroke={tile ? "#fff" : "currentColor"}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
