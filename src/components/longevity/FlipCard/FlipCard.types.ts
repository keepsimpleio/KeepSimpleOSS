export type FlipCardProps = {
  headline?: string;
  subText?: string;
  chartTitle?: string;
  chart: string;
  painText?: string;
  isHacks?: boolean;
  hacksQuote?: string;
  quoteAuthor?: string;
  setSwitchPage?: (value: boolean) => void;
  switchPage?: boolean;
  chartWidth?: number;
};
