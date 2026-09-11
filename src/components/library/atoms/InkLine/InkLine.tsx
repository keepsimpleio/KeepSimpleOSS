import cn from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { Pigment } from '@lib/library/brush';
import { INK_LINE, INK_LINE_NIGHT, paintInkLine } from '@lib/library/brush';

import type { InkLineProps } from './InkLine.types';

import styles from './InkLine.module.scss';

/**
 * A hand-drawn ink divider, painted once into a small fixed-size canvas and
 * stretched by CSS. Stands in for the boxed 1px borders inside cards, the
 * same way a rule is drawn on a catalogue card. Decorative only.
 *
 * The nib takes its pigment from `--ink-line`, so night paper gets a light
 * rule instead of a dark one nobody can see (Wolf, 2026-09-11). A canvas
 * cannot follow a CSS variable on its own, so the line is repainted when the
 * site's theme class changes on the body.
 */

/** One observer for the whole page, however many rules are drawn on it. */
const watchers = new Set<() => void>();
let themeObserver: MutationObserver | null = null;

const watchTheme = (onChange: () => void): (() => void) => {
  watchers.add(onChange);
  if (!themeObserver && typeof document !== 'undefined') {
    themeObserver = new MutationObserver(() => {
      watchers.forEach(fn => fn());
    });
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
  return () => {
    watchers.delete(onChange);
    if (watchers.size === 0 && themeObserver) {
      themeObserver.disconnect();
      themeObserver = null;
    }
  };
};

/**
 * `--ink-line` holds three numbers. A rule drawn outside the `.library` scope
 * never sees the token, so the body's own theme class is the fallback rather
 * than paper ink, which would be invisible at night.
 */
const inkOf = (element: HTMLElement): Pigment => {
  const raw = getComputedStyle(element).getPropertyValue('--ink-line');
  const parts = raw
    .split(',')
    .map(part => Number(part.trim()))
    .filter(part => Number.isFinite(part));
  if (parts.length === 3) return parts as Pigment;
  return document.body.classList.contains('darkTheme')
    ? INK_LINE_NIGHT
    : INK_LINE;
};

export function InkLine({
  seed = 0,
  className,
}: InkLineProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState(false);
  const [theme, setTheme] = useState(0);

  const repaint = useCallback(() => setTheme(n => n + 1), []);

  useEffect(() => watchTheme(repaint), [repaint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    paintInkLine(canvas, 7013 + seed * 104729, 0.62, inkOf(canvas));
    setPainted(true);
  }, [seed, theme]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={10}
      aria-hidden="true"
      className={cn(styles.line, { [styles.painted]: painted }, className)}
    />
  );
}
