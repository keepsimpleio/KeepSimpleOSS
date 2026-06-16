import type { LibraryInfoCardProps } from '@components/library/molecules/LibraryInfoCard';

/**
 * All geometry is expressed in percentages of the cover's 1440x852 design
 * frame, so hotspots track the artwork as it scales responsively without any
 * runtime measurement. Library content is static for now and will later be fed
 * from the six real libraries — keeping geometry and data separate means that
 * swap is data-only.
 */

interface Box {
  left: number;
  top: number;
  width: number;
  height?: number;
}

export interface CoverHotspot {
  id: string;
  /** Invisible trigger region over the building itself. */
  hit: Box;
  /** Glow silhouette overlay (house + tree + leader line). */
  highlight: { src: string; alt: string } & Box;
  /** Top-left anchor of the info card at the end of the leader line. */
  card: { left: number; top: number };
  library: Omit<LibraryInfoCardProps, 'className'>;
}

export const coverHotspots: CoverHotspot[] = [
  {
    id: 'house-1',
    hit: { left: 38.6, top: 11.9, width: 16.8, height: 35.9 },
    highlight: {
      src: '/library/images/hotspots/house-1.svg',
      alt: '',
      left: 38,
      top: 6.57,
      width: 34.55,
    },
    card: { left: 59.03, top: 19.01 },
    library: {
      libraryName: 'John’s Library',
      about:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cih sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus',
      bookCount: 123,
      videoCount: 52,
      songCount: 17,
    },
  },
  {
    id: 'house-2',
    // Estimated from the screenshot — confirm/refine via devtools like house-1.
    hit: { left: 7, top: 2, width: 30, height: 60 },
    highlight: {
      src: '/library/images/hotspots/house-2.svg',
      alt: '',
      left: 6.8,
      top: 0,
      width: 63,
    },
    card: { left: 59.03, top: 19.01 },
    library: {
      libraryName: 'Sarah’s Library',
      about:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cih sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus',
      bookCount: 88,
      videoCount: 34,
      songCount: 12,
    },
  },
  {
    id: 'house-3',
    // Estimated from the screenshot — confirm/refine via devtools like house-1.
    hit: { left: 25, top: 43, width: 17, height: 34 },
    highlight: {
      src: '/library/images/hotspots/house-3.svg',
      alt: '',
      left: 24,
      top: 16.5,
      width: 27,
    },
    card: { left: 50.3, top: 10.5 },
    library: {
      libraryName: 'Liam’s Library',
      about:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cih sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus',
      bookCount: 64,
      videoCount: 21,
      songCount: 9,
    },
  },
  {
    id: 'house-4',
    // Estimated from the screenshot — confirm/refine via devtools like house-1.
    hit: { left: 11, top: 57, width: 14, height: 17 },
    highlight: {
      src: '/library/images/hotspots/house-4.svg',
      alt: '',
      left: 10.4,
      top: 25.9,
      width: 15,
    },
    card: { left: 24.7, top: 26.4 },
    library: {
      libraryName: 'Mia’s Library',
      about:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cih sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus',
      bookCount: 47,
      videoCount: 18,
      songCount: 6,
    },
  },
  {
    id: 'house-5',
    // Estimated from the screenshot — confirm/refine via devtools like house-1.
    // Leader line exits to the LEFT, so the card sits left of the lantern.
    hit: { left: 71, top: 38, width: 12, height: 26 },
    highlight: {
      src: '/library/images/hotspots/house-5.svg',
      alt: '',
      left: 67.5,
      top: 19,
      width: 16,
    },
    card: { left: 40, top: 14 },
    library: {
      libraryName: 'Noah’s Library',
      about:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cih sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus',
      bookCount: 31,
      videoCount: 14,
      songCount: 4,
    },
  },
];
