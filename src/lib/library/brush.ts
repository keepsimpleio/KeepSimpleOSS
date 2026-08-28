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

export function pigmentFor(index: number): Pigment {
  return PIGMENTS[
    ((index % PIGMENTS.length) + PIGMENTS.length) % PIGMENTS.length
  ];
}

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

// One board texture serves every shelf on the page; painted on first request,
// then reused (the tile is seeded, so a repaint would be identical anyway).
let cachedBoardTile: string | null | undefined;

/**
 * The shelf board as a horizontally repeating tile: lit top surface, grain
 * streaks wandering along the wood, a seam where the top edge turns down into
 * the darker front face. Painted at 2× the board's 26px CSS height and
 * squeezed by background-size, which tightens the grain the way sanded wood
 * looks. Returns a data URL, or null when canvas is unavailable — the CSS
 * fallback gradient then simply shows.
 */
export function renderBoardTile(size = 384, seed = 90210): string | null {
  if (typeof document === 'undefined') return null;
  if (cachedBoardTile !== undefined) return cachedBoardTile;
  const h = 52;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) {
    cachedBoardTile = null;
    return null;
  }
  const rng = mulberry32(seed);

  // Base: light catches the top surface, the front face falls off darker.
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, '#ead9b8');
  base.addColorStop(0.3, '#e2d3b4');
  base.addColorStop(0.4, '#c3ad83');
  base.addColorStop(1, '#b7a075');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, h);

  // Grain: horizontal streaks wandering along the board. Each streak's end
  // returns to its starting height so the tile repeats without a visible seam.
  const streaks = 18;
  for (let i = 0; i < streaks; i++) {
    const y0 = rng() * h;
    const dark = rng() < 0.62;
    ctx.strokeStyle = dark
      ? `rgba(110,84,48,${0.045 + rng() * 0.055})`
      : `rgba(255,244,214,${0.05 + rng() * 0.05})`;
    ctx.lineWidth = 0.8 + rng() * 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const steps = 8;
    let py = y0;
    ctx.moveTo(0, y0);
    for (let s = 1; s <= steps; s++) {
      const x = (s / steps) * size;
      const y =
        s === steps
          ? y0
          : Math.min(h - 1, Math.max(1, py + (rng() - 0.5) * h * 0.16));
      ctx.lineTo(x, y);
      py = y;
    }
    ctx.stroke();
  }

  // The seam where the top surface turns down into the front face, and the
  // sliver of light along the board's upper edge.
  ctx.fillStyle = 'rgba(90,66,35,0.22)';
  ctx.fillRect(0, h * 0.36, size, 2);
  ctx.fillStyle = 'rgba(255,250,235,0.5)';
  ctx.fillRect(0, 0, size, 2);

  cachedBoardTile = c.toDataURL('image/png');
  return cachedBoardTile;
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

/** Seed a PRNG from a string (djb2), so a username yields a stable tree. */
export function hashSeed(s: string): number {
  let hash = 5381;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) + hash + s.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// The Library cover's tree palette: gnarled olive bark under teal mist with
// sage foliage. Deliberately NOT the page's sienna/ochre washes — matching
// the cover artwork is what makes the side branch read as THAT tree.
const BARK_SHADOW = 'rgba(74,68,48,';
const BARK_BODY = 'rgba(138,129,90,';
const BARK_RIDGE = 'rgba(199,189,146,';
const FOLIAGE: Pigment[] = [
  [125, 147, 119], // sage
  [92, 122, 108], // deep moss
  [151, 163, 133], // pale olive
];
const MIST: Pigment = [123, 150, 143];

export interface TreeNode {
  /** Vertical centre the limb should reach (canvas px). */
  y: number;
  /** Objects on the shelf — drives limb thickness and foliage density. */
  count: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Sample a quadratic bezier into a polyline. */
function sampleQuad(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  steps: number,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push([
      u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
      u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
    ]);
  }
  return pts;
}

/**
 * A branch as three painterly passes over the same wandering polyline —
 * dark underside, mid body, light ridge — with per-segment width taper and
 * jitter, which is what reads as bark rather than a plotted line.
 */
function strokeBranch(
  ctx: CanvasRenderingContext2D,
  pts: Array<[number, number]>,
  w0: number,
  w1: number,
  rng: () => number,
): void {
  const passes = [
    { color: BARK_SHADOW, alpha: 0.5, widthMul: 1, dy: 1.6 },
    { color: BARK_BODY, alpha: 0.75, widthMul: 0.8, dy: 0 },
    { color: BARK_RIDGE, alpha: 0.45, widthMul: 0.35, dy: -1.4 },
  ];
  ctx.lineCap = 'round';
  for (const pass of passes) {
    for (let i = 0; i < pts.length - 1; i++) {
      const t = i / Math.max(1, pts.length - 2);
      const width = Math.max(
        0.8,
        lerp(w0, w1, t) * pass.widthMul * (0.85 + rng() * 0.3),
      );
      ctx.strokeStyle = `${pass.color}${pass.alpha * (0.75 + rng() * 0.5)})`;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(pts[i][0], pts[i][1] + pass.dy);
      ctx.lineTo(pts[i + 1][0], pts[i + 1][1] + pass.dy);
      ctx.stroke();
    }
  }
}

/**
 * The library's own limb of the landing cover's great tree, painted once down
 * the page's left edge: a gnarled trunk wandering up through teal mist, one
 * branch reaching under each shelf, its thickness and sage foliage growing
 * with the shelf's object count. Deterministic per (seed, nodes), so the same
 * library always grows the same tree.
 */
export function paintLibraryTree(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  nodes: TreeNode[],
  seed: number,
): void {
  const w = Math.max(1, Math.round(cssWidth));
  const h = Math.max(1, Math.round(cssHeight));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  const rng = mulberry32(seed);

  // Mist pools drifting along the trunk's column — the cover's fog.
  const pools = Math.max(2, Math.round(h / 500));
  for (let i = 0; i < pools; i++) {
    wash(
      ctx,
      rng() * w * 0.55,
      ((i + 0.2 + rng() * 0.5) / pools) * h,
      70 + rng() * 60,
      MIST,
      3,
      0.045,
      rng,
    );
  }

  // Trunk spine: bottom of the sheet up to just above the first shelf.
  const top = Math.max(24, (nodes[0]?.y ?? 64) - 90);
  const spine: Array<[number, number]> = [];
  let x = 26 + rng() * 16;
  for (let y = h + 30; y > top; y -= 70 + rng() * 40) {
    spine.push([x, y]);
    x = Math.min(60, Math.max(12, x + (rng() - 0.5) * 34));
  }
  spine.push([x, top]);
  strokeBranch(ctx, spine, 15, 6, rng);

  // Crown: a foliage cluster where the trunk ends, so the tree never
  // terminates in a bare stump.
  for (let i = 0; i < 7; i++) {
    wash(
      ctx,
      spine[spine.length - 1][0] + (rng() - 0.5) * 44,
      top - 4 - rng() * 30,
      9 + rng() * 9,
      FOLIAGE[i % FOLIAGE.length],
      2,
      0.14,
      rng,
    );
  }

  // One limb per shelf, anchored to the nearest spine joint, sagging then
  // rising to meet the board's underside.
  for (const node of nodes) {
    const anchor = spine.reduce((best, p) =>
      Math.abs(p[1] - node.y - 24) < Math.abs(best[1] - node.y - 24) ? p : best,
    );
    const tip: [number, number] = [w - 8 - rng() * 10, node.y + 2 + rng() * 6];
    const mid: [number, number] = [
      (anchor[0] + tip[0]) / 2 + (rng() - 0.5) * 18,
      (anchor[1] + tip[1]) / 2 + 12 + rng() * 14,
    ];
    const limb = sampleQuad(anchor, mid, tip, 9);
    const thickness = 3 + Math.min(21, node.count) * 0.45;
    strokeBranch(ctx, limb, thickness, Math.max(1.6, thickness * 0.35), rng);

    // Foliage along the limb's outer half — one leaf-wash per object, so a
    // full shelf is visibly in leaf and an empty one is a bare twig.
    const leaves = Math.min(21, node.count);
    for (let i = 0; i < leaves; i++) {
      const at = limb[Math.min(limb.length - 1, 4 + Math.floor(rng() * 5))];
      wash(
        ctx,
        at[0] + (rng() - 0.5) * 30,
        at[1] - 8 - rng() * 22,
        6 + rng() * 8,
        FOLIAGE[i % FOLIAGE.length],
        2,
        0.15,
        rng,
      );
    }
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
  alpha = 0.4,
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
    ctx.lineWidth = (0.8 + rng() * 1.1) * taper;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.stroke();
    px = x;
    py = y;
  }
}

/**
 * One elongated horizontal stroke filling the given canvas — the accent that
 * sits behind headings. Internal resolution is fixed by the caller through
 * the canvas element's width/height attributes.
 */
export function paintStroke(
  canvas: HTMLCanvasElement,
  color: Pigment,
  seed: number,
  alpha = 0.1,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const rng = mulberry32(seed);
  // Three overlapping squashed washes marching left to right read as one
  // dragged brush stroke with a wet start and a dry tail.
  //
  // Every wash stays inside the canvas with room to spare: a blob's edge can
  // wander up to ~40% past its radius, so the centres and radii below are
  // sized to keep even the widest excursion off the canvas border. A wash
  // that touched the border would be sliced into a straight machine edge,
  // which is the one thing watercolour never does.
  const rx = w * 0.15;
  const ry = h * 0.3;
  const steps = 3;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const cx = w * (0.26 + 0.44 * t + (rng() - 0.5) * 0.04);
    const cy = h * (0.5 + (rng() - 0.5) * 0.1);
    const r = rx * (1 - 0.18 * t);
    wash(ctx, cx, cy, r, color, 2, alpha * (1 - 0.35 * t), rng, ry / rx);
  }
}
