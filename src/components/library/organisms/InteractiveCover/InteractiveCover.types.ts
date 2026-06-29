import type { HotspotMode } from './useHotspotTrigger';

export interface InteractiveCoverProps {
  /** Cover artwork rendered behind the hotspots. */
  src: string;
  /** Wider artwork (3840x1704) served to 768–1920px viewports via <picture>. */
  wideSrc?: string;
  /** Panorama artwork (4000x852) served to 1920px+ viewports via <picture>. */
  ultraWideSrc?: string;
  alt: string;
  /**
   * How a hotspot reveals its card. Defaults to 'hover'; flip to 'click' for
   * touch-first contexts without touching any markup.
   */
  mode?: HotspotMode;
  className?: string;
}
