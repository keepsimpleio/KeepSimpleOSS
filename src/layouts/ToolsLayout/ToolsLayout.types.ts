import { ReactNode } from 'react';

export type ToolsLayoutProps = {
  children?: ReactNode;
  subtitle?: string;
  backgroundImage?: string;
  darkBackgroundImage?: string;
  logoImage?: string;
  darkLogoImage?: string;
  isDarkTheme?: boolean;
};
