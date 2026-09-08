import type { HomeLibraryCardView } from '@local-types/library/library';

import type { HotspotMode } from './useHotspotTrigger';

export interface InteractiveCoverProps {
  /** Cover artwork rendered behind the hotspots (mobile, below 768px). */
  src: string;
  libraries?: HomeLibraryCardView[];
  /** Wider artwork (3840x1704) served to 768–1920px viewports via <picture>. */
  wideSrc?: string;
  /**
   * Optional srcset for the wide artwork so 1x screens get a 1920px file and
   * only 2x screens fetch the full 3840px one. Pairs with `sizes` in markup.
   */
  wideSrcSet?: string;
  /** Panorama artwork (4000x852) served to 1920px+ viewports via <picture>. */
  ultraWideSrc?: string;
  /**
   * Small copy of the art for the blurred fill behind the frame. It is blurred
   * 24px, so a few hundred pixels wide is plenty; without it the full-size art
   * would be downloaded twice.
   */
  backgroundSrc?: string;
  alt: string;
  /**
   * How a hotspot reveals its card. Defaults to 'hover'; flip to 'click' for
   * touch-first contexts without touching any markup.
   */
  mode?: HotspotMode;
  className?: string;
}
