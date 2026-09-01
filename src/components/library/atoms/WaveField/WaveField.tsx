import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { mulberry32 } from '@lib/library/brush';

import type { WaveFieldProps } from './WaveField.types';

import styles from './WaveField.module.scss';

/**
 * Calm water drawn in ink: thin composite-sine lines drifting across the
 * paper, the animated counterpart of InkLine. Runs a rAF loop at low cost
 * (a dozen strokes per frame); under prefers-reduced-motion it paints a
 * single still frame instead. Decorative only.
 */

interface WaveLine {
  yFrac: number;
  amp: number;
  freq: [number, number, number];
  speed: [number, number, number];
  phase: [number, number, number];
  width: number;
  rgb: string;
  alpha: number;
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

function buildLines(height: number, seed: number): WaveLine[] {
  const rng = mulberry32(seed);
  const count = Math.max(8, Math.min(18, Math.round(height / 56)));
  const taupe = cssRgb('--taupe');
  const brown = cssRgb('--brown');
  const ink = cssRgb('--black-rich');
  const lines: WaveLine[] = [];
  for (let i = 0; i < count; i++) {
    const yFrac = (i + 0.5) / count + (rng() - 0.5) * 0.03;
    // Swells deepen toward the bottom of the sheet, like water gaining body
    // away from the horizon.
    const depth = 0.6 + 0.8 * yFrac;
    const accent = i % 5 === 2;
    const deep = i % 7 === 4;
    lines.push({
      yFrac,
      amp: (8 + rng() * 12) * depth,
      freq: [
        (Math.PI * 2) / (420 + rng() * 480),
        (Math.PI * 2) / (180 + rng() * 220),
        (Math.PI * 2) / (60 + rng() * 90),
      ],
      speed: [0.08 + rng() * 0.1, 0.05 + rng() * 0.08, 0.03 + rng() * 0.05],
      phase: [rng() * Math.PI * 2, rng() * Math.PI * 2, rng() * Math.PI * 2],
      width: 1 + rng() * 0.6,
      rgb: deep ? ink : accent ? brown : taupe,
      alpha: deep ? 0.1 : accent ? 0.2 : 0.24 + rng() * 0.16,
    });
  }
  return lines;
}

export function WaveField({ className }: WaveFieldProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let lines: WaveLine[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const draw = (tMs: number) => {
      const t = tMs / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const line of lines) {
        // Breathe the swell as a whole so the surface never looks looped.
        const amp = line.amp * (1 + 0.18 * Math.sin(t * 0.07 + line.phase[0]));
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `rgba(${line.rgb},0)`);
        grad.addColorStop(0.12, `rgba(${line.rgb},${line.alpha})`);
        grad.addColorStop(0.88, `rgba(${line.rgb},${line.alpha})`);
        grad.addColorStop(1, `rgba(${line.rgb},0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = line.width;
        ctx.beginPath();
        for (let x = 0; x <= w + 8; x += 8) {
          const y =
            line.yFrac * h +
            amp *
              Math.sin(x * line.freq[0] + t * line.speed[0] + line.phase[0]) +
            amp *
              0.45 *
              Math.sin(x * line.freq[1] - t * line.speed[1] + line.phase[1]) +
            amp *
              0.22 *
              Math.sin(x * line.freq[2] + t * line.speed[2] + line.phase[2]);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
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
      lines = buildLines(h, 7013);
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
      <div className={styles.clearing} />
    </div>
  );
}
