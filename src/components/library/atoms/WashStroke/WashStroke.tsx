import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { paintStroke, pigmentFor } from '@lib/library/brush';

import type { WashStrokeProps } from './WashStroke.types';

import styles from './WashStroke.module.scss';

/**
 * One horizontal watercolour stroke, painted once into a small fixed-size
 * canvas and stretched by CSS. Sits behind a heading as a pigment accent.
 * Decorative only; the pigment cycles by `accent` index so sibling headings
 * differ without anyone choosing colours by hand.
 */
export function WashStroke({
  accent = 0,
  alpha,
  className,
}: WashStrokeProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    paintStroke(canvas, pigmentFor(accent), 4099 + accent * 7919, alpha);
    setPainted(true);
  }, [accent, alpha]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={64}
      aria-hidden="true"
      className={cn(styles.stroke, { [styles.painted]: painted }, className)}
    />
  );
}
