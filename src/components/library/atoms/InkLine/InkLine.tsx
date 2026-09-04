import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { paintInkLine } from '@lib/library/brush';

import type { InkLineProps } from './InkLine.types';

import styles from './InkLine.module.scss';

/**
 * A hand-drawn ink divider, painted once into a small fixed-size canvas and
 * stretched by CSS. Stands in for the boxed 1px borders inside cards, the
 * same way a rule is drawn on a catalogue card. Decorative only.
 */
export function InkLine({
  seed = 0,
  className,
}: InkLineProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    paintInkLine(canvas, 7013 + seed * 104729);
    setPainted(true);
  }, [seed]);

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
