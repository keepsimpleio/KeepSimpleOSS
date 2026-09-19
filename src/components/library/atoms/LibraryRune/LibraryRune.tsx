import cn from 'classnames';

import styles from './LibraryRune.module.scss';

interface LibraryRuneProps {
  initial: string;
  isOwner?: boolean;
}

// Original angular monograms, not a historical runic alphabet.
// All letters share the same cap height and carved, straight-line strokes.
const glyphs: Record<string, string> = {
  A: 'M14 35 24 13 34 35 M18 27H30 M24 13V9',
  B: 'M16 13V35H26L33 29 24 23 31 18 26 13H16 M16 23H24',
  C: 'M33 17 26 12 15 19V29L26 36 33 31',
  D: 'M16 12V36L33 27V21Z M12 12H20 M12 36H20',
  E: 'M33 13H16V35H33 M16 24H29 M29 20V28',
  F: 'M16 36V13H33 M16 24H29 M29 20V28',
  G: 'M33 17 25 12 15 19V29L25 36 33 30V24H25',
  H: 'M15 12V36 M33 12V36 M15 24 24 20 33 24 M24 20V28',
  I: 'M17 13H31 M24 13V35 M17 35H31 M20 24 24 20 28 24 24 28Z',
  J: 'M18 13H33 M29 13V30L22 36 15 29V25',
  K: 'M16 12V36 M33 13 16 25 33 35 M24 19V12',
  L: 'M17 12V35H33 M13 12H21 M33 31V39',
  M: 'M13 36V13L24 24 35 13V36 M24 24V31',
  N: 'M15 36V13L33 35V12 M20 24H28',
  O: 'M24 11 34 19V29L24 37 14 29V19Z M24 11V16 M24 32V37',
  P: 'M16 36V13H26L33 20 26 27H16 M16 9V13',
  Q: 'M24 11 34 19V28L24 35 14 28V19Z M24 26 35 38',
  R: 'M16 36V13H26L33 20 26 26H16 M24 26 34 36',
  S: 'M33 17 25 12 15 19 33 29 23 36 15 31 M24 9V13 M24 35V39',
  T: 'M12 18V13H36V18 M24 13V36 M20 32 24 36 28 32',
  U: 'M15 12V29L24 36 33 29V12 M24 31V39',
  V: 'M13 12 24 36 35 12 M20 28H28 M24 36V40',
  W: 'M12 13 17 35 24 24 31 35 36 13 M24 24V15',
  X: 'M14 12 34 36 M34 12 14 36 M20 24H28',
  Y: 'M13 12 24 25 35 12 M24 25V36 M20 36H28',
  Z: 'M14 13H34L14 35H34 M20 24H28',
};

const LibraryRune = ({ initial, isOwner = false }: LibraryRuneProps) => {
  const letter = Array.from(initial.normalize('NFC').trim())[0] ?? '';
  const upper = letter.toUpperCase();
  const path = glyphs[upper];

  return (
    <span
      className={cn(styles.seal, { [styles.owner]: isOwner })}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" fill="none" focusable="false">
        <path
          className={styles.frame}
          d="M10 3H38L45 10V38L38 45H10L3 38V10Z"
        />
        <path
          className={styles.terminals}
          d="m24 1 2 2-2 2-2-2Zm0 42 2 2-2 2-2-2Z"
        />
        {path ? (
          <path className={styles.glyph} d={path} />
        ) : letter ? (
          <text className={styles.fallback} x="24" y="32" textAnchor="middle">
            {letter}
          </text>
        ) : (
          <path
            className={styles.glyph}
            d="M24 12 34 24 24 36 14 24Z M24 18V30"
          />
        )}
      </svg>
    </span>
  );
};

export default LibraryRune;
