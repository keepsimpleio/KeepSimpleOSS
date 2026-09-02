import type React from 'react';

export interface ShelfGhostRowProps {
  // Stable per shelf (its id): the same shelf always deals the same props.
  seed: number;
  // Free width on the board, in px, to the right of the real objects.
  availableWidth: number;
  className?: string;
  // Positions the row on the board, to the right of the real objects.
  style?: React.CSSProperties;
}
