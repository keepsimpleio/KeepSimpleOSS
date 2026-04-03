export type ToolContainerProps = {
  id?: number;
  title?: string;
  description?: string;
  poweredBy?: 'Claude' | 'ChatGPT' | string;
  isDarkTheme?: boolean;
  isInDevelopment?: boolean;
  isBlank?: boolean;
  link?: string;
};
