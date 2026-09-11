import cn from 'classnames';
import React, { CSSProperties, JSX } from 'react';

import styles from './SpellSlot.module.scss';

interface SpellSlotProps {
  /** Its place in the row: picks the mark and staggers the light. */
  index: number;
  /** True while the engine is stocking the shelf. */
  working?: boolean;
  className?: string;
}

// Carved marks in the same hand as the library's rune seals: straight
// strokes, one cap height, no curve anywhere. Eight of them, so a row of
// thirteen empty places never reads as one drawing repeated.
const MARKS = [
  'M24 10 34 24 24 38 14 24Z M24 16V32',
  'M14 14H34 M24 14V34 M18 28 24 34 30 28',
  'M14 34 24 12 34 34 M18 26H30',
  'M16 12V36 M32 12V36 M16 24H32 M24 18V30',
  'M24 12 36 24 24 36 12 24Z M17 24H31',
  'M14 18 24 12 34 18V30L24 36 14 30Z M24 20V28',
  'M15 15 33 33 M33 15 15 33 M24 11V37',
  'M16 34V14L32 34V14 M20 24H28',
];

/**
 * A place on the AI shelf that has no book on it yet: the seal of one, cut
 * into the board. A bevelled face the size of a cover, a rune at its heart,
 * two rules where a title will be, and a light behind it that breathes.
 *
 * While the engine works the row lights in order, each place a beat after
 * the one before it, so the wait reads as a spell running along the shelf
 * rather than as nothing happening. Reduced motion holds it all still.
 */
export default function SpellSlot({
  index,
  working = false,
  className,
}: SpellSlotProps): JSX.Element {
  return (
    <span
      className={cn(styles.slot, className, { [styles.working]: working })}
      style={{ '--slot': index } as CSSProperties}
      aria-hidden="true"
    >
      <span className={styles.glow} />
      <svg
        className={styles.art}
        viewBox="0 0 180 208"
        fill="none"
        focusable="false"
      >
        <path className={styles.face} d="M34 3H168L177 12V196L168 205H34Z" />
        <path className={styles.spine} d="M7 6V202 M27 4V204" />
        <path
          className={styles.frame}
          d="M34 3H168L177 12V196L168 205H34Z M34 3V205"
        />
        <path
          className={styles.star}
          d="M105 34 108 42 116 45 108 48 105 56 102 48 94 45 102 42Z"
        />
        <g className={styles.mark} transform="translate(81,66)">
          <path
            d={MARKS[((index % MARKS.length) + MARKS.length) % MARKS.length]}
          />
        </g>
        <path className={styles.rules} d="M79 146H131 M89 158H121" />
      </svg>
    </span>
  );
}
