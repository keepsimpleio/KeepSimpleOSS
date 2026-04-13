import { FC, SVGProps } from 'react';

import CompanyManagementIcon from '@icons/tools/company-management.svg';
import BobIcon from '@icons/tools/tool-icons/bob.svg';
import ClaudeBobIcon from '@icons/tools/tool-icons/claude-bob.svg';
import EmaIcon from '@icons/tools/tool-icons/ema.svg';
import FriendlyTomIcon from '@icons/tools/tool-icons/friendly-tom.svg';
import GithubIcon from '@icons/tools/tool-icons/github.svg';
import MosaicIcon from '@icons/tools/tool-icons/mosaic.svg';
import TomIcon from '@icons/tools/tool-icons/tom.svg';
import VibeSuiteIcon from '@icons/tools/tool-icons/vibesuite.svg';

export type ToolConfig = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  hoverColor: string;
  darkHoverColor: string;
  darkIconFill: string;
  isBlank: boolean;
};
// TODO - review html, button with p and div

export const TOOL_CONFIG: Record<number, ToolConfig> = {
  1: {
    Icon: CompanyManagementIcon,
    hoverColor: '#3F4A7A',
    darkHoverColor: '#C1D6FF',
    darkIconFill: '#C1D6FF',
    isBlank: false,
  },
  2: {
    Icon: EmaIcon,
    hoverColor: '#0A3D3D',
    darkHoverColor: '#95CCCC',
    darkIconFill: '#95CCCC',
    isBlank: false,
  },
  3: {
    Icon: MosaicIcon,
    hoverColor: '#3F4A7A',
    darkHoverColor: '#C1D6FF',
    darkIconFill: '#E08080',
    isBlank: false,
  },
  4: {
    Icon: GithubIcon,
    hoverColor: '#4A2F63',
    darkHoverColor: '#E9D3FF',
    darkIconFill: '#E9D3FF',
    isBlank: true,
  },
  5: {
    Icon: BobIcon,
    hoverColor: '#2F4A3E',
    darkHoverColor: '#ADD19A',
    darkIconFill: '#ADD19A',
    isBlank: true,
  },
  6: {
    Icon: TomIcon,
    hoverColor: '#6A3A2A',
    darkHoverColor: '#EACCAA',
    darkIconFill: '#EACCAA',
    isBlank: true,
  },
  7: {
    Icon: ClaudeBobIcon,
    hoverColor: '#B06A3A',
    darkHoverColor: '#FFB366',
    darkIconFill: '#FFB366',
    isBlank: true,
  },
  8: {
    Icon: VibeSuiteIcon,
    hoverColor: '#A4B465',
    darkHoverColor: '#D3DEAC',
    darkIconFill: '#D3DEAC',
    isBlank: true,
  },
  9: {
    Icon: FriendlyTomIcon,
    hoverColor: '#B8860B',
    darkHoverColor: '#E5C988',
    darkIconFill: '#E5C988',
    isBlank: false,
  },
};

export const DEFAULT_CONFIG: ToolConfig = {
  Icon: CompanyManagementIcon,
  hoverColor: '#3F4A7A',
  darkHoverColor: '#C1D6FF',
  darkIconFill: '#C1D6FF',
  isBlank: false,
};
