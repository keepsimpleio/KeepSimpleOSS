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
   * Geometry for the `library-test.png` panorama (4000x852), used at 1920px+.
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

export const coverHotspots: CoverHotspot[] = [
  makeHotspot(
    'house-1',
    {
      hit: { left: 37.73, top: 11.9, width: 12.55, height: 35.9 },
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
      hit: { left: 45.8, top: 11.9, width: 6 },
      highlight: { left: 45.6, top: 7.9 },
    },
  ),
  makeHotspot(
    'house-2',
    {
      hit: { left: 14.13, top: 2, width: 22.41, height: 60 },
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
    { hit: { left: 34.7824, top: 0 } },
  ),
  makeHotspot(
    'house-3',
    {
      hit: { left: 27.58, top: 43, width: 12.7, height: 34 },
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
      hit: { left: 41, top: 52, width: 7.096, height: 34 },
      highlight: { left: 40.4, top: 17.5 },
    },
  ),
  makeHotspot(
    'house-4',
    {
      hit: { left: 17.12, top: 57, width: 10.46, height: 17 },
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
      hit: { left: 35.6, top: 66 },
      highlight: { left: 35.552, top: 28 },
    },
  ),
  makeHotspot(
    'house-5',
    {
      // Leader line exits to the LEFT, so the card sits left of the lantern.
      hit: { left: 61.94, top: 38, width: 8.96, height: 26 },
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
    { hit: { left: 57.7312, top: 44, width: 4.3008, height: 28 } },
  ),
];
