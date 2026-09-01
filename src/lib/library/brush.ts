/**
 * Watercolour primitives for the Library's brush skin. Pure Canvas2D —
 * deformed-polygon washes layered at low alpha in multiply over a paper
 * texture, the technique proven on Arc of Self's Living Theories page and
 * Game of Life. Deterministic: every render is seeded, so a given viewport
 * always yields the same sheet.
 *
 * Everything here renders ONCE into a canvas (or a data-URL tile) and is then
 * left alone — no per-frame work, no rAF loops. The page pays for the paint
 * at mount and on resize, nothing else.
 */

export type Pigment = [number, number, number];

export const PAPER = '#f2e9d6';

/** Classic transparent-watercolour set, shared with the reference pages. */
export const PIGMENTS: Pigment[] = [
  [52, 111, 74], // viridian
  [52, 94, 158], // ultramarine
  [161, 62, 38], // burnt sienna
  [166, 124, 27], // ochre
];

/** Small fast seeded PRNG — determinism is what keeps the paint stable. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rgba = (c: Pigment, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/**
 * One organic blob outline: a jittered polygon refined by midpoint
 * displacement, so the edge wanders the way a wet wash does.
 */
function blobPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  rng: () => number,
  deform: number,
  squashY = 1,
): void {
  let pts: Array<[number, number]> = [];
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rng() * 0.3;
    const rad = r * (1 + (rng() - 0.5) * 2 * deform);
    pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * squashY]);
  }
  for (let round = 0; round < 3; round++) {
    const next: Array<[number, number]> = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length];
      next.push(p);
      const mx = (p[0] + q[0]) / 2;
      const my = (p[1] + q[1]) / 2;
      const dx = q[0] - p[0];
      const dy = q[1] - p[1];
      const len = Math.hypot(dx, dy) || 1;
      const push = (rng() - 0.5) * len * 0.5;
      next.push([mx - (dy / len) * push, my + (dx / len) * push]);
    }
    pts = next;
  }
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

/**
 * A wash: several re-deformed layers of the same blob in multiply. Overlaps
 * darken naturally, which is where the watercolour depth comes from. The
 * granulation specks read as pigment settling into the paper tooth.
 */
export function wash(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: Pigment,
  layers: number,
  alpha: number,
  rng: () => number,
  squashY = 1,
): void {
  ctx.globalCompositeOperation = 'multiply';
  for (let i = 0; i < layers; i++) {
    const t = i / Math.max(1, layers - 1);
    const lr = r * (1.05 - 0.45 * t * rng());
    const ox = (rng() - 0.5) * r * 0.24;
    const oy = (rng() - 0.5) * r * 0.24 * squashY;
    ctx.fillStyle = rgba(color, alpha * (0.75 + 0.5 * rng()));
    blobPath(ctx, cx + ox, cy + oy, lr, rng, 0.3 - 0.15 * t, squashY);
    ctx.fill();
  }
  const specks = Math.min(90, Math.round((r * r * squashY) / 26));
  for (let i = 0; i < specks; i++) {
    const a = rng() * Math.PI * 2;
    const d = r * 0.9 * Math.sqrt(rng());
    ctx.fillStyle = rgba(color, 0.05 + rng() * 0.06);
    ctx.beginPath();
    ctx.arc(
      cx + Math.cos(a) * d,
      cy + Math.sin(a) * d * squashY,
      0.5 + rng() * 1.1,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
}

/**
 * A square of paper as a repeatable background tile: warm mottling plus fine
 * tooth flecks, no vignette (a vignette cannot tile — the section lays one on
 * top with a CSS gradient instead). Returns a data URL, or null when canvas
 * is unavailable, in which case the CSS fallback colour simply shows.
 */
export function renderPaperTile(size = 384, seed = 20080219): string | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  const rng = mulberry32(seed);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, size, size);
  const tones = [
    'rgba(226,212,180,0.02)',
    'rgba(255,250,236,0.025)',
    'rgba(208,192,158,0.018)',
  ];
  // Mottling drawn with wrap-around copies so the tile repeats without a
  // visible edge.
  for (let i = 0; i < 170; i++) {
    ctx.fillStyle = tones[Math.floor(rng() * tones.length)];
    const x = rng() * size;
    const y = rng() * size;
    const r = 8 + rng() * 46;
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle =
      rng() < 0.5 ? 'rgba(160,146,120,0.05)' : 'rgba(255,252,242,0.06)';
    ctx.fillRect(rng() * size, rng() * size, 1, 1);
  }
  return c.toDataURL('image/png');
}

/**
 * Ambient washes for a section backdrop: a handful of very faint pigment
 * pools drifting in from the edges. Painted once at ~half resolution — the
 * browser upscales, and on soft-edged washes the stretch only adds to the
 * bloom. Transparent canvas, meant to sit over the paper tile.
 */
export function paintAmbientWashes(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  seed = 610,
): void {
  const scale = 0.5;
  const w = Math.max(1, Math.round(cssWidth * scale));
  const h = Math.max(1, Math.round(cssHeight * scale));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  const rng = mulberry32(seed);
  // Edge pools: pigment cycling through the set, kept faint enough that the
  // cards stay the loudest thing on the sheet.
  const pools = 5;
  for (let i = 0; i < pools; i++) {
    const color = PIGMENTS[i % PIGMENTS.length];
    const edge = i % 2 === 0 ? 0 : 1; // alternate left/right
    const cx = edge === 0 ? rng() * w * 0.12 : w - rng() * w * 0.12;
    const cy = (0.1 + 0.8 * (i / pools) + rng() * 0.08) * h;
    const r = (0.1 + rng() * 0.1) * Math.max(w, h);
    wash(ctx, cx, cy, r, color, 3, 0.02 + rng() * 0.012, rng);
  }
}

/**
 * A hand-drawn ink divider: one quasi-horizontal line wandering across the
 * canvas with a hand wobble, variable pressure and slightly tapered ends.
 * Replaces the boxed 1px borders inside cards.
 */
export function paintInkLine(
  canvas: HTMLCanvasElement,
  seed: number,
  // The canvas is drawn at 480x10 and squeezed to 8px tall, so a nib sized
  // for the canvas lands on screen thinner than it was painted. Pressure and
  // width below carry the rule past that loss.
  alpha = 0.62,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const rng = mulberry32(seed);
  const y0 = h * (0.45 + rng() * 0.15);
  ctx.lineCap = 'round';
  const steps = 26;
  let px = w * 0.01;
  let py = y0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = w * (0.01 + 0.98 * t);
    let y = py + (rng() - 0.5) * h * 0.35;
    y = Math.min(h * 0.8, Math.max(h * 0.2, y));
    const taper = t < 0.08 || t > 0.92 ? 0.55 : 1;
    ctx.strokeStyle = `rgba(51,41,28,${alpha * (0.7 + rng() * 0.5) * taper})`;
    ctx.lineWidth = (1.35 + rng() * 1.25) * taper;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.stroke();
    px = x;
    py = y;
  }
}
