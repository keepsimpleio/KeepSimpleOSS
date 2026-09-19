import cn from 'classnames';
import React, { useMemo } from 'react';

import {
  GHOST_SIZE,
  type GhostKind,
  ShelfGhost,
} from '@components/library/atoms/ShelfGhost';

import type { ShelfGhostRowProps } from './ShelfGhostRow.types';

import styles from './ShelfGhostRow.module.scss';

// Books stand close on a real shelf, so the placeholders do too.
const GAP = 12;

// The order covers are dealt in. Heights and thicknesses alternate so any
// window into the sequence has the rhythm of a shelf someone actually filled.
const DECK: GhostKind[] = [
  'upright',
  'thin',
  'thick',
  'leaning',
  'tall',
  'stack',
  'pair',
  'flat',
];

// Deterministic per shelf: the same shelf deals the same covers every render,
// so a re-render (or adding an object) never reshuffles what already stands
// there. Plain LCG — the values only need to be stable and spread out.
function dealt(seed: number): GhostKind[] {
  const cards = [...DECK];
  let state = (Math.abs(seed) % 2147483647) + 1;
  for (let i = cards.length - 1; i > 0; i -= 1) {
    state = (state * 48271) % 2147483647;
    const j = state % (i + 1);
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/**
 * The props standing in the part of a shelf nobody has filled yet. The row is
 * dealt to the free width it is given, so every object the owner adds pushes it
 * right and quietly retires the ghost that no longer fits — a full shelf ends
 * with none of them left.
 */
export function ShelfGhostRow({
  seed,
  availableWidth,
  className,
  style,
}: ShelfGhostRowProps): React.JSX.Element | null {
  const kinds = useMemo(() => {
    if (availableWidth <= 0) return [];
    const deck = dealt(seed);
    const picked: GhostKind[] = [];
    let used = 0;
    // Deal round the deck until the next cover would hang off the end of the
    // board. Covers repeat on a wide shelf, the way copies of the same format
    // repeat on a real one, but never twice in a row.
    for (let i = 0; i < deck.length * 4; i += 1) {
      const kind = deck[i % deck.length];
      if (kind === picked[picked.length - 1]) continue;
      const next = used + (picked.length ? GAP : 0) + GHOST_SIZE[kind].w;
      if (next > availableWidth) continue;
      picked.push(kind);
      used = next;
    }
    return picked;
  }, [seed, availableWidth]);

  if (kinds.length === 0) return null;

  return (
    <div className={cn(styles.row, className)} style={style} aria-hidden="true">
      {kinds.map((kind, index) => (
        <span
          key={`${kind}-${index}`}
          className={styles.slot}
          // Staggered so the row settles onto the board left to right instead
          // of the whole set blinking in at once.
          style={{ animationDelay: `${Math.min(index * 70, 700)}ms` }}
        >
          <ShelfGhost kind={kind} />
        </span>
      ))}
    </div>
  );
}
