export type MainInfoSectionProps = {
  title: string;
  backgroundImageUrl?: string;
  description?: string;
  hasBasicStats?: boolean;
  japaneseText?: string;
  basicStats: {
    label: string;
    value: string;
    icon: string;
  }[];
  hasRedUnderline?: boolean;
  locale?: string;
  basicStatsTitle?: string;
  isIntroPage?: boolean;
};
