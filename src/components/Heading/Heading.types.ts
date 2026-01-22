export type HeadingProps = {
  text: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  hasRedUnderline?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
  Tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  hasUnderline?: boolean;
  isDarkTheme?: boolean;
  locale?: string;
  isBig?: boolean;
  isBold?: boolean;
};
