export type ToolContainerProps = {
  id?: number;
  title?: string;
  description?: string;
  poweredBy?: 'Claude' | 'ChatGPT' | string;
  isBlank?: boolean;
  isDarkTheme?: boolean;
  isInDevelopment?: boolean;
  link?: string;
};
