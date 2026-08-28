import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { paintAmbientWashes, renderPaperTile } from '@lib/library/brush';

import type { BrushPaperProps } from './BrushPaper.types';

import styles from './BrushPaper.module.scss';

/**
 * Watercolour-paper backdrop for a section: a repeating paper tile under a
 * once-painted canvas of faint ambient washes, with a CSS vignette on top.
 * Purely decorative (aria-hidden), renders client-side only, repaints on
 * resize through a debounced ResizeObserver. No animation loop.
 */
export function BrushPaper({ className }: BrushPaperProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tile, setTile] = useState<string | null>(null);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    setTile(renderPaperTile());
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastW = 0;
    let lastH = 0;

    const paint = () => {
      const { width, height } = root.getBoundingClientRect();
      if (!width || !height) return;
      // Card-grid reflows nudge the section height by fractions; only a real
      // size change is worth repainting for.
      if (Math.abs(width - lastW) < 2 && Math.abs(height - lastH) < 2) return;
      lastW = width;
      lastH = height;
      paintAmbientWashes(canvas, width, height);
      setPainted(true);
    };

    paint();

    const observer = new ResizeObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(paint, 150);
    });
    observer.observe(root);

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(styles.paper, className)}
      aria-hidden="true"
      style={tile ? { backgroundImage: `url(${tile})` } : undefined}
    >
      <canvas
        ref={canvasRef}
        className={cn(styles.washes, { [styles.painted]: painted })}
      />
      <div className={styles.vignette} />
    </div>
  );
}
