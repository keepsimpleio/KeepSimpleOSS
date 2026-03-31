import { FC, SVGProps } from 'react';

import BobIcon from '@icons/tools/tool-icons/bob.svg';
import ClaudeBobIcon from '@icons/tools/tool-icons/claude-bob.svg';
import EmaIcon from '@icons/tools/tool-icons/ema.svg';
import GithubIcon from '@icons/tools/tool-icons/github.svg';
import MosaicIcon from '@icons/tools/tool-icons/mosaic.svg';
import TomIcon from '@icons/tools/tool-icons/tom.svg';

export type ToolConfig = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  hoverColor: string;
  darkHoverColor: string;
  darkIconFill: string;
};

export const TOOL_CONFIG: Record<number, ToolConfig> = {
  1: {
    Icon: MosaicIcon,
    hoverColor: '#3F4A7A',
    darkHoverColor: '#C1D6FF',
    darkIconFill: '#E08080',
  },
  2: {
    Icon: EmaIcon,
    hoverColor: '#0A3D3D',
    darkHoverColor: '#95CCCC',
    darkIconFill: '#95CCCC',
  },
  4: {
    Icon: GithubIcon,
    hoverColor: '#4A2F63',
    darkHoverColor: '#E9D3FF',
    darkIconFill: '#E9D3FF',
  },
  5: {
    Icon: BobIcon,
    hoverColor: '#2F4A3E',
    darkHoverColor: '#ADD19A',
    darkIconFill: '#ADD19A',
  },
  6: {
    Icon: TomIcon,
    hoverColor: '#6A3A2A',
    darkHoverColor: '#EACCAA',
    darkIconFill: '#EACCAA',
  },
  7: {
    Icon: ClaudeBobIcon,
    hoverColor: '#B06A3A',
    darkHoverColor: '#FFB366',
    darkIconFill: '#FFB366',
  },
};

export const DEFAULT_CONFIG: ToolConfig = {
  Icon: MosaicIcon,
  hoverColor: '#3F4A7A',
  darkHoverColor: '#C1D6FF',
  darkIconFill: '#E08080',
};
