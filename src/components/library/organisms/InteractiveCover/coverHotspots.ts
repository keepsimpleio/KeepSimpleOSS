import type { LibraryInfoCardProps } from '@components/library/molecules/LibraryInfoCard';

/**
 * Hotspot geometry is expressed in percentages of the cover frame, so it tracks
 * the artwork as it scales responsively without runtime measurement.
 *
 * Hotspots only render at 768px+, where the cover shows the wide
 * `library-wide.png` (3840x1704). All numbers below are authored directly
 * against that wide frame: left/top is the box's top-left corner as a percent
 * of the frame, width is a percent of the frame width, height a percent of the
 * frame height.
 */

interface Box {
  left: number;
  top: number;
  width: number;
  height?: number;
}

interface HotspotGeometry {
  /** Invisible trigger region over the building itself. */
  hit: Box;
  /** Glow silhouette overlay (house + tree + leader line). */
  highlight: { src: string; alt: string } & Box;
  /**
   * Where the info card attaches to the leader line. Anchor by whichever edge
   * meets the line: `left` for lines exiting right, `right` for lines exiting
   * left. Using the touching edge keeps the join intact across viewport widths,
   * since the card has a fixed pixel width but the line endpoint is a percent.
   */
  card: { left?: number; right?: number; top: number };
}

export interface CoverHotspot {
  id: string;
  /** Geometry for the wide `library-wide.png` cover, used at 768–1920px. */
  wide: HotspotGeometry;
  /**
   * Geometry for the `library-ultrawide.png` panorama (4000x852), used at 1920px+.
   * Derived from `wide` (see `toUltraWide`), with optional per-hotspot tweaks.
   */
  ultraWide: HotspotGeometry;
  library: Omit<LibraryInfoCardProps, 'className'>;
}

// At the 1920px breakpoint the full-bleed cover frame is 1920px wide and the
// wide art fills it; the panorama's centred 1920px crop is visually identical.
// So the panorama geometry is the wide geometry remapped from that 1920px frame
// into the fixed 4000px-wide panorama layer (centred, sides clipped) — which
// pins every glow to the same building and keeps it pinned as the frame widens.
// Vertical percentages carry over unchanged: both bands are 852px tall with the
// layer at top:0, so only the horizontal axis is rescaled and offset.
const PANORAMA_WIDTH = 4000;
const WIDE_FRAME_WIDTH = 1920;
const H_SCALE = WIDE_FRAME_WIDTH / PANORAMA_WIDTH; // 0.48
const H_INSET = ((1 - H_SCALE) / 2) * 100; // 26 — centring inset, in %

// Positions (left/right/width measured from a frame edge) shift and scale;
// sizes (width) only scale.
const remapPos = (value: number) => value * H_SCALE + H_INSET;
const remapSize = (value: number) => value * H_SCALE;

const toUltraWide = ({
  hit,
  highlight,
  card,
}: HotspotGeometry): HotspotGeometry => ({
  hit: {
    left: remapPos(hit.left),
    top: hit.top,
    width: remapSize(hit.width),
    ...(hit.height !== undefined && { height: hit.height }),
  },
  highlight: {
    src: highlight.src,
    alt: highlight.alt,
    left: remapPos(highlight.left),
    top: highlight.top,
    width: remapSize(highlight.width),
  },
  card: {
    ...(card.left !== undefined && { left: remapPos(card.left) }),
    ...(card.right !== undefined && { right: remapPos(card.right) }),
    top: card.top,
  },
});

// Per-hotspot tweaks to the derived panorama geometry, for the spots where the
// panorama art doesn't perfectly line up with the remapped wide geometry.
// Merged field-by-field over the derived `ultraWide`, so only the values listed
// here diverge from the wide art.
interface GeometryOverride {
  hit?: Partial<Box>;
  highlight?: Partial<Box>;
  card?: Partial<{ left: number; right: number; top: number }>;
}

const applyOverride = (
  base: HotspotGeometry,
  override?: GeometryOverride,
): HotspotGeometry =>
  override
    ? {
        hit: { ...base.hit, ...override.hit },
        highlight: { ...base.highlight, ...override.highlight },
        card: { ...base.card, ...override.card },
      }
    : base;

const makeHotspot = (
  id: string,
  wide: HotspotGeometry,
  library: CoverHotspot['library'],
  ultraWideOverride?: GeometryOverride,
): CoverHotspot => ({
  id,
  wide,
  ultraWide: applyOverride(toUltraWide(wide), ultraWideOverride),
  library,
});

const lorem =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cih sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus';

// Hit boxes are sized to the glow silhouette each hotspot lights up, so the
// whole building answers the pointer rather than just its roofline.
//
// Order matters: overlapping triggers share a z-index, so the last one declared
// wins the pointer. The tree (house-2) is the backdrop the buildings sit in
// front of, so it goes first and the buildings keep their own hover areas.
export const coverHotspots: CoverHotspot[] = [
  makeHotspot(
    'house-2',
    {
      // The glow here traces the tree, not a building — hence the wide box.
      hit: { left: 17.76, top: 0, width: 30.85, height: 55 },
      highlight: {
        src: '/library/images/hotspots/house-2.svg',
        alt: '',
        left: 17.98,
        top: 0,
        width: 47.06,
      },
      card: { left: 53.0, top: 19.01 },
    },
    {
      libraryName: 'Sarah’s Library',
      about: lorem,
      bookCount: 88,
      videoCount: 34,
      songCount: 12,
    },
  ),
  makeHotspot(
    'house-1',
    {
      hit: { left: 41.45, top: 20.02, width: 13.13, height: 29.79 },
      highlight: {
        src: '/library/images/hotspots/house-1.svg',
        alt: '',
        left: 40.8,
        top: 7.57,
        width: 25.81,
      },
      card: { left: 53.0, top: 19.01 },
    },
    {
      libraryName: 'John’s Library',
      about: lorem,
      bookCount: 123,
      videoCount: 52,
      songCount: 17,
    },
    {
      // The panorama art sits 0.33% lower here, matching the highlight offset.
      hit: { top: 20.35 },
      highlight: { left: 45.6, top: 7.9 },
    },
  ),
  makeHotspot(
    'house-3',
    {
      hit: { left: 31.13, top: 50.79, width: 15.57, height: 37.59 },
      highlight: {
        src: '/library/images/hotspots/house-3.svg',
        alt: '',
        left: 30,
        top: 18.5,
        width: 20.17,
      },
      card: { left: 46.47, top: 10.5 },
    },
    {
      libraryName: 'Liam’s Library',
      about: lorem,
      bookCount: 64,
      videoCount: 21,
      songCount: 9,
    },
    {
      hit: { top: 49.79 },
      highlight: { left: 40.4, top: 17.5 },
    },
  ),
  makeHotspot(
    'house-4',
    {
      hit: { left: 20.02, top: 61.73, width: 11.43, height: 22.42 },
      highlight: {
        src: '/library/images/hotspots/house-4.svg',
        alt: '',
        left: 19.9,
        top: 28.9,
        width: 11.21,
      },
      card: { left: 30.62, top: 26.4 },
    },
    {
      libraryName: 'Mia’s Library',
      about: lorem,
      bookCount: 47,
      videoCount: 18,
      songCount: 6,
    },
    {
      hit: { top: 60.83 },
      highlight: { left: 35.552, top: 28 },
    },
  ),
  makeHotspot(
    'house-5',
    {
      // Leader line exits to the LEFT, so the card sits left of the lantern.
      hit: { left: 65.44, top: 49.75, width: 8.59, height: 24.69 },
      highlight: {
        src: '/library/images/hotspots/house-5.svg',
        alt: '',
        left: 63.32,
        top: 22,
        width: 11.95,
      },
      card: { right: 36.26, top: 14 },
    },
    {
      libraryName: 'Noah’s Library',
      about: lorem,
      bookCount: 31,
      videoCount: 14,
      songCount: 4,
    },
  ),
];
