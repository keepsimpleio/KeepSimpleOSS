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
  /** Geometry for the wide `library-wide.png` cover, used at 768px+. */
  wide: HotspotGeometry;
  library: Omit<LibraryInfoCardProps, 'className'>;
}

const makeHotspot = (
  id: string,
  wide: HotspotGeometry,
  library: CoverHotspot['library'],
): CoverHotspot => ({
  id,
  wide,
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
  ),
];
