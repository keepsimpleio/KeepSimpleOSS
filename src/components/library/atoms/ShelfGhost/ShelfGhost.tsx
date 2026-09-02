import cn from 'classnames';
import React from 'react';

import type { GhostKind, ShelfGhostProps } from './ShelfGhost.types';

import styles from './ShelfGhost.module.scss';

// Intrinsic size each drawing is authored on: every cover sits on a viewBox of
// exactly these numbers, seated on its bottom edge.
const GHOST_ART: Record<GhostKind, { w: number; h: number }> = {
  upright: { w: 34, h: 150 },
  tall: { w: 28, h: 172 },
  thick: { w: 54, h: 158 },
  thin: { w: 18, h: 128 },
  leaning: { w: 52, h: 148 },
  pair: { w: 66, h: 142 },
  stack: { w: 92, h: 52 },
  flat: { w: 96, h: 26 },
};

// A real book on this shelf is 208px tall. The standing covers are scaled up
// uniformly (art untouched, so nothing stretches or skews) until the tallest
// of them stand level with an actual object and the rest fall in under it, the
// way formats vary on a shelf someone filled. The two lying kinds keep their
// authored size: a stack gets its height from what is piled on it.
const GHOST_SCALE: Record<GhostKind, number> = {
  upright: 1.33,
  tall: 1.21,
  thick: 1.2,
  thin: 1.25,
  leaning: 1.26,
  pair: 1.25,
  stack: 1,
  flat: 1,
};

// Rendered size, in the px scale the cards use. This is what the row packs to.
export const GHOST_SIZE: Record<GhostKind, { w: number; h: number }> =
  Object.fromEntries(
    (Object.keys(GHOST_ART) as GhostKind[]).map(kind => [
      kind,
      {
        w: Math.round(GHOST_ART[kind].w * GHOST_SCALE[kind]),
        h: Math.round(GHOST_ART[kind].h * GHOST_SCALE[kind]),
      },
    ]),
  ) as Record<GhostKind, { w: number; h: number }>;

// One vocabulary for all eight: a cover block, a darker spine, a lighter page
// edge, and at most two hairlines standing in for a title. No object is ever
// drawn — the shelf reads as books without illustrating one.
const DRAW: Record<GhostKind, React.JSX.Element> = {
  upright: (
    <g>
      <rect x="24" y="5" width="8" height="143" rx="1" className="gLight" />
      <rect x="2" y="2" width="24" height="146" rx="1.5" className="gSolid" />
      <rect x="2" y="2" width="6" height="146" rx="1.5" className="gDeep" />
      <path d="M12 42 H22 M12 50 H22" className="gEdge" />
    </g>
  ),

  tall: (
    <g>
      <rect x="19" y="6" width="7" height="164" rx="1" className="gDeep" />
      <rect x="2" y="2" width="18" height="168" rx="1.5" className="gLight" />
      <rect x="2" y="2" width="5" height="168" rx="1.5" className="gSolid" />
      <path d="M10 52 H17" className="gEdge" />
    </g>
  ),

  thick: (
    <g>
      <rect x="38" y="6" width="14" height="150" rx="1" className="gLight" />
      <rect x="2" y="2" width="38" height="154" rx="2" className="gDeep" />
      <rect x="2" y="2" width="8" height="154" rx="2" className="gSolid" />
      <path
        d="M2 58 H40 M2 104 H40"
        className="gEdge"
        strokeOpacity="0.3"
        strokeWidth="1.6"
      />
    </g>
  ),

  thin: (
    <g>
      <rect x="12" y="4" width="4" height="122" rx="1" className="gLight" />
      <rect x="2" y="2" width="11" height="124" rx="1" className="gSolid" />
      <path d="M5 44 H10" className="gEdge" />
    </g>
  ),

  leaning: (
    <g transform="rotate(-11 46 146)">
      <rect x="26" y="6" width="9" height="138" rx="1" className="gLight" />
      <rect x="6" y="3" width="21" height="142" rx="1.5" className="gSolid" />
      <rect x="6" y="3" width="6" height="142" rx="1.5" className="gDeep" />
      <path d="M15 46 H24 M15 54 H24" className="gEdge" />
    </g>
  ),

  pair: (
    <g>
      <g transform="rotate(7 26 138)">
        <rect x="20" y="8" width="7" height="130" rx="1" className="gLight" />
        <rect x="4" y="5" width="17" height="133" rx="1.5" className="gDeep" />
        <path d="M9 50 H17" className="gEdge" strokeOpacity="0.3" />
      </g>
      <g transform="rotate(-8 44 138)">
        <rect x="52" y="12" width="8" height="126" rx="1" className="gDeep" />
        <rect
          x="36"
          y="9"
          width="17"
          height="129"
          rx="1.5"
          className="gLight"
        />
        <rect x="36" y="9" width="5" height="129" rx="1.5" className="gSolid" />
        <path d="M44 54 H51" className="gEdge" />
      </g>
    </g>
  ),

  stack: (
    <g>
      <rect x="2" y="36" width="88" height="15" rx="2" className="gDeep" />
      <path d="M8 43.5 H84" className="gEdge" strokeOpacity="0.28" />
      <rect x="7" y="21" width="78" height="14" rx="2" className="gSolid" />
      <path d="M13 28 H79" className="gEdge" strokeOpacity="0.28" />
      <rect x="14" y="6" width="66" height="14" rx="2" className="gLight" />
      <path d="M20 13 H74" className="gEdge" strokeOpacity="0.28" />
    </g>
  ),

  flat: (
    <g>
      <rect x="2" y="6" width="92" height="5" rx="2" className="gLight" />
      <rect x="2" y="9" width="92" height="15" rx="2" className="gSolid" />
      <rect x="2" y="9" width="7" height="15" rx="2" className="gDeep" />
      <path d="M16 16 H74" className="gEdge" strokeOpacity="0.26" />
    </g>
  ),
};

/**
 * One book standing in a slot nobody has filled yet: a cover block in the
 * shelf board's own tones, cast with the same soft shadow a real object on
 * that board would have. Decorative and inert; the row that places them
 * (ShelfGhostRow) owns their count and their fade.
 */
export function ShelfGhost({
  kind,
  className,
}: ShelfGhostProps): React.JSX.Element {
  const art = GHOST_ART[kind];
  const { w, h } = GHOST_SIZE[kind];

  return (
    <svg
      viewBox={`0 0 ${art.w} ${art.h}`}
      width={w}
      height={h}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={cn(styles.ghost, className)}
    >
      {DRAW[kind]}
    </svg>
  );
}
