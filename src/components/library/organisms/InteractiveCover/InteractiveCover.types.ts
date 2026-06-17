import type { HotspotMode } from './useHotspotTrigger';

export interface InteractiveCoverProps {
  /** Cover artwork rendered behind the hotspots. */
  src: string;
  /** Wider artwork served to 1920px+ viewports via <picture> art direction. */
  wideSrc?: string;
  alt: string;
  /**
   * How a hotspot reveals its card. Defaults to 'hover'; flip to 'click' for
   * touch-first contexts without touching any markup.
   */
  mode?: HotspotMode;
  className?: string;
}
