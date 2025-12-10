export type HeadingProps = {
  text: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
  Tag?: 'h1' | 'h2' | 'h3' | 'h4';
  hasUnderline?: boolean;
  isDarkTheme?: boolean;
  locale?: string;
  isBig?: boolean;
};
