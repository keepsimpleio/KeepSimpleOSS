import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { mulberry32 } from '@lib/library/brush';

import type { WaveFieldProps } from './WaveField.types';

import styles from './WaveField.module.scss';

/**
 * Layered water in the bottom third of the sheet: a few smooth translucent
 * silhouettes drifting past each other at different speeds, paper-cutout
 * style. Long wavelengths only, so the surface stays calm and composed —
 * never a tangle of strokes. Under prefers-reduced-motion it paints a single
 * still frame. Decorative only.
 */

interface WaveLayer {
  /** Resting height of the crest, as a fraction of canvas height. */
  baseFrac: number;
  amp: number;
  /** Spatial frequencies (rad/px) of the two sine components. */
  freq: [number, number];
  /** Phase speeds (rad/s) — horizontal drift of each component. */
  speed: [number, number];
  phase: [number, number];
  /** Vertical bob: tiny, slow rise and fall of the whole layer. */
  bobPhase: number;
  fill: string;
  crest: string | null;
}

const FALLBACKS: Record<string, string> = {
  '--taupe': '#c0b6ae',
  '--brown': '#af6a34',
  '--black-rich': '#23221c',
};

function cssRgb(name: string): string {
  const raw =
    (typeof window !== 'undefined' &&
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim()) ||
    FALLBACKS[name];
  const hex = /^#([0-9a-f]{6})$/i.exec(raw)?.[1] ?? FALLBACKS[name].slice(1);
  const n = parseInt(hex, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function buildLayers(seed: number): WaveLayer[] {
  const rng = mulberry32(seed);
  const taupe = cssRgb('--taupe');
  const brown = cssRgb('--brown');
  const ink = cssRgb('--black-rich');
  // Far to near: each layer sits lower, reads a touch deeper and moves a
  // touch faster, which is all the parallax the scene needs.
  const depths = [
    { baseFrac: 0.7, amp: 12, alpha: 0.1, drift: 3 },
    { baseFrac: 0.78, amp: 16, alpha: 0.14, drift: 5 },
    { baseFrac: 0.86, amp: 19, alpha: 0.18, drift: 7 },
    { baseFrac: 0.94, amp: 22, alpha: 0.24, drift: 10 },
  ];
  return depths.map((d, i) => {
    // Long wavelengths relative to the amplitude keep every crest smooth.
    const l1 = 900 + rng() * 500;
    const l2 = 420 + rng() * 240;
    const k1 = (Math.PI * 2) / l1;
    const k2 = (Math.PI * 2) / l2;
    return {
      baseFrac: d.baseFrac,
      amp: d.amp,
      freq: [k1, k2],
      // Components share the layer's drift speed so the shape holds while it
      // travels, with a slight split so it still evolves over minutes.
      speed: [k1 * d.drift, k2 * d.drift * 0.8],
      phase: [rng() * Math.PI * 2, rng() * Math.PI * 2],
      bobPhase: rng() * Math.PI * 2,
      fill: `rgba(${taupe},${d.alpha})`,
      // One brown accent on the nearest crest, faint ink on the rest.
      crest:
        i === depths.length - 1 ? `rgba(${brown},0.3)` : `rgba(${ink},0.08)`,
    };
  });
}

export function WaveField({ className }: WaveFieldProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const layers = buildLayers(7013);
    let w = 0;
    let h = 0;
    let raf = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const crestY = (layer: WaveLayer, x: number, t: number): number => {
      return (
        layer.baseFrac * h +
        3 * Math.sin(t * 0.05 + layer.bobPhase) +
        layer.amp *
          Math.sin(x * layer.freq[0] + t * layer.speed[0] + layer.phase[0]) +
        layer.amp *
          0.35 *
          Math.sin(x * layer.freq[1] - t * layer.speed[1] + layer.phase[1])
      );
    };

    const draw = (tMs: number) => {
      const t = tMs / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const layer of layers) {
        ctx.beginPath();
        for (let x = 0; x <= w + 8; x += 8) {
          const y = crestY(layer, x, t);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        if (layer.crest) {
          ctx.strokeStyle = layer.crest;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.lineTo(w + 8, h + 4);
        ctx.lineTo(0, h + 4);
        ctx.closePath();
        ctx.fillStyle = layer.fill;
        ctx.fill();
      }
    };

    const loop = (tMs: number) => {
      draw(tMs);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduceMotion.matches) draw(0);
      else raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion.matches) draw(0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    start();
    setReady(true);
    reduceMotion.addEventListener('change', start);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      reduceMotion.removeEventListener('change', start);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(styles.field, { [styles.ready]: ready }, className)}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
