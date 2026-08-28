import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { hashSeed, paintLibraryTree } from '@lib/library/brush';

import type { LibraryTreeProps } from './LibraryTree.types';

import styles from './LibraryTree.module.scss';

// The strip of page the tree occupies along the left edge.
const TREE_WIDTH = 140;

// A shelf's board top sits 86px above the shelf wrapper's bottom edge
// (16px wrapper padding + 44px seating line + 26px board height — see
// Shelf.module.scss); the limbs aim just under that.
const BOARD_OFFSET = 86;

/**
 * The library's limb of the landing cover's great tree: a gnarled trunk
 * growing up the left edge, one branch reaching under each shelf, foliage
 * thickening as the shelf fills. Decorative only (aria-hidden), painted once
 * per data/layout change — no animation loop. The only motion is the one-off
 * "dry in" opacity fade in LibraryTree.module.scss, which honours
 * prefers-reduced-motion there (transition: none — the tree simply appears).
 */
export function LibraryTree({
  nodes,
  seedKey,
  className,
}: LibraryTreeProps): React.JSX.Element {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState(false);

  // Stable dependency: repaint only when the visible shelves or their counts
  // actually change, not on every parent render.
  const nodesKey = nodes.map(n => `${n.id}:${n.count}`).join(',');

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const host = wrap?.parentElement;
    if (!wrap || !canvas || !host) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const paint = () => {
      const hostRect = host.getBoundingClientRect();
      if (!hostRect.height) return;
      const measured = nodes
        .map(n => {
          const el = document.getElementById(`shelf-${n.id}`);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            y: rect.bottom - hostRect.top - BOARD_OFFSET,
            count: n.count,
          };
        })
        .filter((n): n is { y: number; count: number } => n !== null);
      paintLibraryTree(
        canvas,
        TREE_WIDTH,
        hostRect.height,
        measured,
        hashSeed(seedKey),
      );
      setPainted(true);
    };

    paint();

    // Shelf heights shift with wrapping and viewport width; the debounce keeps
    // repaints to one per settle, same policy as BrushPaper.
    const observer = new ResizeObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(paint, 150);
    });
    observer.observe(host);

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [nodesKey, seedKey, nodes]);

  return (
    <div
      ref={wrapRef}
      className={cn(styles.tree, className)}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={cn(styles.canvas, { [styles.painted]: painted })}
      />
    </div>
  );
}
