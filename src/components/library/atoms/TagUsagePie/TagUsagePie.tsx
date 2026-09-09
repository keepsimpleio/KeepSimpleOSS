import classNames from 'classnames';
import React, { JSX, useMemo, useState } from 'react';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Tooltip } from '@components/library/atoms/Tooltip';

import type { TagUsagePieProps, TagUsageRow } from './TagUsagePie.types';

import styles from './TagUsagePie.module.scss';

// The ring, in the 120-unit box it is drawn in. Radius and width are chosen so
// the stroke's outer edge (53) stays inside the box whatever the slice count.
const RADIUS = 44;
const STROKE = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// A hairline of paper between neighbouring slices, in circumference units.
const GAP = 1.2;
// The thinnest a shelf is ever drawn: below this a slice reads as a scratch.
const MIN_SLICE = 0.6;
// How many books a hint names before it says how many more there are. The
// tooltip has no scrolling surface, so the list has to end somewhere.
const HINT_ROWS = 10;

interface Slice {
  shelf: string;
  items: TagUsageRow[];
  percent: number;
  /** Where the slice starts, in circumference units. */
  offset: number;
  length: number;
  opacity: number;
}

const books = (count: number) => `${count} ${count === 1 ? 'book' : 'books'}`;

// A share too small to round to a whole percent is still a share: it says so
// rather than reading as nothing. One reading, drawn and spoken alike.
const share = (percent: number) => (percent === 0 ? '<1%' : `${percent}%`);

/**
 * Shelves in the order they will be drawn: the biggest share first, so the
 * ring reads from strongest colour to lightest. Percentages are handed out by
 * largest remainder, so they add up to a hundred rather than to 99 or 101.
 */
function sliceLibrary(rows: TagUsageRow[]): Slice[] {
  const byShelf: Record<string, TagUsageRow[]> = {};
  const entries: { shelf: string; items: TagUsageRow[] }[] = [];
  for (const row of rows) {
    const held = byShelf[row.shelf];
    if (held) {
      held.push(row);
    } else {
      byShelf[row.shelf] = [row];
      entries.push({ shelf: row.shelf, items: byShelf[row.shelf] });
    }
  }

  entries.sort(
    (a, b) => b.items.length - a.items.length || a.shelf.localeCompare(b.shelf),
  );

  const total = rows.length;
  const exact = entries.map(entry => (entry.items.length * 100) / total);
  const percents = exact.map(Math.floor);
  let spare = 100 - percents.reduce((sum, value) => sum + value, 0);
  const byRemainder = exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder);
  for (const { index } of byRemainder) {
    if (spare <= 0) break;
    percents[index] += 1;
    spare -= 1;
  }

  // The ring, less the paper between the slices, is what there is to divide.
  // A shelf too thin to be seen is drawn at MIN_SLICE and the width for it
  // comes off the shelves that have width to spare, so the slices always sit
  // side by side and always fill the ring exactly.
  const gap = entries.length > 1 ? GAP : 0;
  const room = CIRCUMFERENCE - entries.length * gap;
  const lengths = entries.map(entry =>
    Math.max((entry.items.length / total) * room, MIN_SLICE),
  );
  const over = lengths.reduce((sum, value) => sum + value, 0) - room;
  if (over > 0) {
    const spareRoom = lengths.map(value => Math.max(0, value - MIN_SLICE));
    const spareTotal = spareRoom.reduce((sum, value) => sum + value, 0);
    if (spareTotal > 0) {
      lengths.forEach((value, index) => {
        lengths[index] = value - (over * spareRoom[index]) / spareTotal;
      });
    }
  }

  let offset = 0;
  return entries.map((entry, index) => {
    const slice: Slice = {
      ...entry,
      percent: percents[index],
      offset,
      length: lengths[index],
      opacity: Math.max(0.35, 1 - index * 0.13),
    };
    offset += lengths[index] + gap;
    return slice;
  });
}

/**
 * Where a tag is used, as a ring: one slice per shelf, drawn in the tag's own
 * colour at falling strength, each naming the books it stands for on hover and
 * on keyboard focus.
 */
export function TagUsagePie({
  rows,
  color,
  className,
}: TagUsagePieProps): JSX.Element {
  const slices = useMemo(() => sliceLibrary(rows), [rows]);
  const [active, setActive] = useState<string | null>(null);

  const hint = (slice: Slice) => {
    const rest = slice.items.length - HINT_ROWS;
    return (
      <span className={styles.hint}>
        <span className={styles.hintTitle}>
          {slice.shelf} · {books(slice.items.length)}
        </span>
        {slice.items.slice(0, HINT_ROWS).map(item => (
          <span key={item.id} className={styles.hintRow}>
            <span className={styles.hintOrder}>#{item.order}</span>
            <span className={styles.hintName}>{item.title}</span>
          </span>
        ))}
        {rest > 0 && (
          <span className={styles.hintMore}>+{rest} more on this shelf</span>
        )}
      </span>
    );
  };

  // A slice and its legend row are one control in two places: whichever the
  // pointer rests on, both light up and the rest of the ring steps back.
  const watch = (shelf: string) => ({
    onMouseEnter: () => setActive(shelf),
    onMouseLeave: () =>
      setActive(current => (current === shelf ? null : current)),
    onFocus: () => setActive(shelf),
    onBlur: () => setActive(current => (current === shelf ? null : current)),
  });

  return (
    <div className={classNames(styles.chart, className)}>
      <div className={styles.ringWrap}>
        <svg
          className={styles.ring}
          viewBox="0 0 120 120"
          role="presentation"
          // The legend below carries every figure this ring draws, so the
          // drawing itself is not read out twice.
          aria-hidden="true"
        >
          <g transform="rotate(-90 60 60)">
            {slices.map(slice => (
              <Tooltip key={slice.shelf} asChild tooltipContent={hint(slice)}>
                <circle
                  className={styles.slice}
                  cx="60"
                  cy="60"
                  r={RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${slice.length} ${CIRCUMFERENCE - slice.length}`}
                  strokeDashoffset={-slice.offset}
                  strokeOpacity={
                    slice.opacity *
                    (active && active !== slice.shelf ? 0.35 : 1)
                  }
                  {...watch(slice.shelf)}
                />
              </Tooltip>
            ))}
          </g>
        </svg>
        <span className={styles.total}>
          <span className={styles.totalCount}>{rows.length}</span>
          <span className={styles.totalLabel}>
            {rows.length === 1 ? 'book' : 'books'}
          </span>
        </span>
      </div>

      <ul className={styles.legend}>
        {slices.map(slice => (
          <li key={slice.shelf}>
            <Tooltip asChild tooltipContent={hint(slice)}>
              <span
                className={classNames(styles.row, {
                  [styles.rowMuted]: !!active && active !== slice.shelf,
                })}
                tabIndex={0}
                aria-label={`${slice.shelf}: ${books(slice.items.length)}, ${share(slice.percent)}`}
                {...watch(slice.shelf)}
              >
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: color, opacity: slice.opacity }}
                  aria-hidden="true"
                />
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.shelf}
                >
                  {slice.shelf}
                </Text>
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.percent}
                >
                  {share(slice.percent)}
                </Text>
              </span>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
}
