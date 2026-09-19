import classNames from 'classnames';
import React, { JSX, useEffect, useRef } from 'react';

import type { PixelShelfBoardProps } from './PixelShelfBoard.types';

import styles from './PixelShelfBoard.module.scss';

// One drawn pixel is a 4×4 square on screen; the canvas is drawn at cell
// resolution and scaled up with `image-rendering: pixelated`, so every edge
// stays hard.
export const BOARD_CELL = 4;
// Six cells of air above the plank for the sparks to rise into, then the
// plank, then its shadow. 31 cells: 124px on screen.
export const BOARD_ROWS = 31;
export const BOARD_HEIGHT = BOARD_ROWS * BOARD_CELL;
// Where the plank's top face begins, in cells from the top of the canvas.
// The cards seat on this line.
export const BOARD_PLANK_TOP = 6;

const TOP_ROWS = 4;
const FRONT_ROWS = 11;
const TICK_MS = 100;
const MAX_SPARKS = 6;
const MAX_MOTES = 10;
const SCAN_PERIOD_MS = 7000;

interface Palette {
  air: string;
  topLight: string;
  top: string;
  front: string;
  frontDark: string;
  edge: string;
  spark: string;
  sparkSoft: string;
}

// The plank is painted in the palette's own purples and papers, read from
// the tokens at mount so a retuned token repaints the wood.
function readPalette(el: HTMLElement): Palette {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) =>
    cs.getPropertyValue(name).trim() || fallback;
  return {
    air: v('--purple-400', '#c7a5ff'),
    topLight: v('--purple-400', '#c7a5ff'),
    top: v('--purple-300', '#a171ef'),
    front: v('--purple-200', '#8654d9'),
    frontDark: v('--purple-100', '#6b3fb3'),
    edge: v('--black-rich', '#23221c'),
    spark: v('--white-200', '#fffcf7'),
    sparkSoft: v('--cream', '#f8f1e5'),
  };
}

// Plain LCG: the grain only has to be stable per seed and spread out.
function rng(seed: number) {
  let state = (Math.abs(seed) % 2147483647) + 1;
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
}

interface Spark {
  x: number;
  y: number;
  age: number;
}

interface Mote {
  x: number;
  y: number;
  age: number;
}

// A spark blooms from a dot to a four-point star and back over seven ticks.
const SPARK_LIFE = 7;

function paintPlank(
  ctx: CanvasRenderingContext2D,
  cols: number,
  seed: number,
  p: Palette,
) {
  const rand = rng(seed);
  const px = (x: number, y: number, color: string, alpha = 1) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  };
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, cols, BOARD_ROWS);

  // The top face, seen from slightly above: each row up steps in one cell,
  // so the plank reads as a slab and not a stripe. Its far edge is lit.
  for (let r = 0; r < TOP_ROWS; r += 1) {
    const y = BOARD_PLANK_TOP + r;
    const inset = TOP_ROWS - 1 - r;
    for (let x = inset; x < cols - inset; x += 1) {
      const lit = r === 0 || (r === 1 && (x + r) % 3 === 0);
      px(x, y, lit ? p.topLight : p.top);
    }
  }

  // The lip between the faces.
  const lipY = BOARD_PLANK_TOP + TOP_ROWS;
  for (let x = 0; x < cols; x += 1) px(x, lipY, p.frontDark);

  // The front face, with grain: runs of the darker purple laid along each
  // row, longer and sparser toward the middle, and a lit hairline under the
  // lip.
  const frontTop = lipY + 1;
  for (let r = 0; r < FRONT_ROWS; r += 1) {
    const y = frontTop + r;
    for (let x = 0; x < cols; x += 1) px(x, y, p.front);
    if (r === 0) {
      for (let x = 0; x < cols; x += 1) {
        if (x % 2 === 0) px(x, y, p.top);
      }
      continue;
    }
    let x = Math.floor(rand() * 10);
    while (x < cols) {
      const run = 3 + Math.floor(rand() * 12);
      const gap = 6 + Math.floor(rand() * 22);
      for (let i = 0; i < run && x + i < cols; i += 1) {
        px(x + i, y, p.frontDark, 0.75);
      }
      x += run + gap;
    }
  }

  // The bottom edge in ink, then a shadow dithering out beneath the plank.
  const bottomY = frontTop + FRONT_ROWS;
  for (let x = 0; x < cols; x += 1) px(x, bottomY, p.edge, 0.85);
  for (let x = 0; x < cols; x += 1) {
    if ((x + 1) % 2 === 0) px(x, bottomY + 1, p.edge, 0.35);
    if (x % 3 === 0) px(x, bottomY + 2, p.edge, 0.18);
  }
  // The plank's ends: a dark cell each side down the front face.
  for (let y = frontTop; y < bottomY; y += 1) {
    px(0, y, p.frontDark);
    px(cols - 1, y, p.frontDark);
  }
  ctx.globalAlpha = 1;
}

function paintSpark(
  ctx: CanvasRenderingContext2D,
  s: Spark,
  p: Palette,
  alpha = 1,
) {
  const px = (x: number, y: number, color: string, a: number) => {
    ctx.globalAlpha = a;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  };
  const stage = s.age <= 3 ? s.age : SPARK_LIFE - 1 - s.age;
  px(s.x, s.y, p.spark, alpha);
  if (stage >= 1) {
    px(s.x - 1, s.y, p.spark, alpha);
    px(s.x + 1, s.y, p.spark, alpha);
    px(s.x, s.y - 1, p.spark, alpha);
    px(s.x, s.y + 1, p.spark, alpha);
  }
  if (stage >= 2) {
    px(s.x - 2, s.y, p.sparkSoft, alpha * 0.8);
    px(s.x + 2, s.y, p.sparkSoft, alpha * 0.8);
    px(s.x, s.y - 2, p.sparkSoft, alpha * 0.8);
    px(s.x, s.y + 2, p.sparkSoft, alpha * 0.8);
  }
  if (stage >= 3) {
    px(s.x - 1, s.y - 1, p.sparkSoft, alpha * 0.5);
    px(s.x + 1, s.y - 1, p.sparkSoft, alpha * 0.5);
    px(s.x - 1, s.y + 1, p.sparkSoft, alpha * 0.5);
    px(s.x + 1, s.y + 1, p.sparkSoft, alpha * 0.5);
  }
  ctx.globalAlpha = 1;
}

/**
 * The AI shelf's plank, drawn in pixels: a lilac slab with grain in its
 * front, a lit far edge, and an ink shadow beneath. It is alive at ten
 * frames a second: sparks bloom on the top face and die, motes lift off it
 * into the air above, and a soft light passes along the front every few
 * seconds. Under `prefers-reduced-motion: reduce` the plank is painted once,
 * with a few sparks held at full bloom, and nothing moves. The loop also
 * rests while the board is off screen.
 */
export function PixelShelfBoard({
  className,
  seed = 0,
}: PixelShelfBoardProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const palette = readPalette(canvas);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let cols = 0;
    let plank: HTMLCanvasElement | null = null;
    let sparks: Spark[] = [];
    let motes: Mote[] = [];
    let raf = 0;
    let lastTick = 0;
    let visible = true;
    let scanStart = performance.now();

    const layPlank = () => {
      const width = canvas.parentElement?.clientWidth ?? canvas.clientWidth;
      cols = Math.max(8, Math.ceil(width / BOARD_CELL));
      canvas.width = cols;
      canvas.height = BOARD_ROWS;
      canvas.style.width = `${cols * BOARD_CELL}px`;
      canvas.style.height = `${BOARD_HEIGHT}px`;
      plank = document.createElement('canvas');
      plank.width = cols;
      plank.height = BOARD_ROWS;
      const pctx = plank.getContext('2d');
      if (pctx) paintPlank(pctx, cols, seed, palette);
      sparks = sparks.filter(s => s.x < cols - 2);
      motes = motes.filter(m => m.x < cols - 1);
    };

    const frame = (now: number) => {
      if (!plank) return;
      ctx.clearRect(0, 0, cols, BOARD_ROWS);
      ctx.globalAlpha = 1;
      ctx.drawImage(plank, 0, 0);

      // The passing light: a diagonal band crossing the front face.
      const progress = ((now - scanStart) % SCAN_PERIOD_MS) / SCAN_PERIOD_MS;
      const frontTop = BOARD_PLANK_TOP + TOP_ROWS + 1;
      const head = Math.floor(progress * (cols + FRONT_ROWS + 24)) - 12;
      for (let r = 0; r < FRONT_ROWS; r += 1) {
        const y = frontTop + r;
        const cx = head - r;
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = palette.topLight;
        ctx.fillRect(cx - 1, y, 3, 1);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = palette.sparkSoft;
        ctx.fillRect(cx, y, 1, 1);
      }
      ctx.globalAlpha = 1;

      motes.forEach(m => {
        ctx.globalAlpha = Math.max(0, 1 - m.age / 12) * 0.9;
        ctx.fillStyle = palette.sparkSoft;
        ctx.fillRect(m.x, m.y, 1, 1);
      });
      ctx.globalAlpha = 1;

      sparks.forEach(s => paintSpark(ctx, s, palette));
    };

    const tick = () => {
      sparks = sparks
        .map(s => ({ ...s, age: s.age + 1 }))
        .filter(s => s.age < SPARK_LIFE);
      if (sparks.length < MAX_SPARKS && Math.random() < 0.22) {
        sparks.push({
          x: 3 + Math.floor(Math.random() * (cols - 6)),
          y: BOARD_PLANK_TOP - 1 + Math.floor(Math.random() * (TOP_ROWS + 1)),
          age: 0,
        });
      }
      motes = motes
        .map(m => ({
          ...m,
          age: m.age + 1,
          y: m.age % 2 === 0 ? m.y - 1 : m.y,
        }))
        .filter(m => m.age < 12 && m.y >= 0);
      if (motes.length < MAX_MOTES && Math.random() < 0.3) {
        motes.push({
          x: 2 + Math.floor(Math.random() * (cols - 4)),
          y: BOARD_PLANK_TOP + Math.floor(Math.random() * TOP_ROWS),
          age: 0,
        });
      }
    };

    const loop = (now: number) => {
      if (now - lastTick >= TICK_MS) {
        lastTick = now;
        tick();
      }
      frame(now);
      raf = window.requestAnimationFrame(loop);
    };

    // The still: the plank with a few sparks held at full bloom.
    const paintStill = () => {
      if (!plank) return;
      ctx.clearRect(0, 0, cols, BOARD_ROWS);
      ctx.drawImage(plank, 0, 0);
      const rand = rng(seed + 11);
      for (let i = 0; i < 4; i += 1) {
        paintSpark(
          ctx,
          {
            x: 3 + Math.floor(rand() * (cols - 6)),
            y: BOARD_PLANK_TOP - 1 + Math.floor(rand() * TOP_ROWS),
            age: 3,
          },
          palette,
        );
      }
    };

    const start = () => {
      window.cancelAnimationFrame(raf);
      if (reduced.matches || !visible) {
        paintStill();
        return;
      }
      scanStart = performance.now();
      raf = window.requestAnimationFrame(loop);
    };

    layPlank();
    start();

    const resize = new ResizeObserver(() => {
      layPlank();
      if (reduced.matches || !visible) paintStill();
    });
    if (canvas.parentElement) resize.observe(canvas.parentElement);

    const seen = new IntersectionObserver(entries => {
      visible = entries.some(e => e.isIntersecting);
      start();
    });
    seen.observe(canvas);

    const onMotionChange = () => start();
    reduced.addEventListener('change', onMotionChange);

    return () => {
      window.cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      reduced.removeEventListener('change', onMotionChange);
    };
  }, [seed]);

  return (
    <canvas
      ref={canvasRef}
      className={classNames(styles.canvas, className)}
      aria-hidden="true"
      role="presentation"
    />
  );
}
