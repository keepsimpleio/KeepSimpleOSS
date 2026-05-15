import { StrapiBiasType } from '@uxcore/local-types/data';

export interface UXCoreLinesProps {
  startGreen?: number;
  startPink?: number;
  startPurple?: number;
  setHoveredLineId?: (id) => void;
  setPathGeometry?: any;
  isThirdPaths?: boolean;
  className?: string;
  sectionId?: number;
  setHovered?: any;
  hovered?: any;
  setSvgSize?: (size: { width: number; height: number }) => void;
  pathName?: string;
  isLeftSection?: boolean;
  searchResults?: StrapiBiasType[];
}
