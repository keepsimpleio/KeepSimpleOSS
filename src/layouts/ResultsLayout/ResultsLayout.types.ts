type ObjectContent = {
  headline?: string;
  content?: string;
  date?: string;
};

export type ResultsLayoutProps = {
  data?: {
    basicStats: {
      label: string;
      value: string;
      icon: string;
    }[];
    title?: string;
    description?: string;
    'japanese title'?: string;
    'background image'?: {
      data?: {
        attributes?: {
          url?: string;
        };
      };
    };
    'biological marker highlights (blood-based)'?: ObjectContent;
    'body composition'?: ObjectContent;
    'physiological function (wearables)'?: ObjectContent;
    'training summary'?: ObjectContent;
    'PS Quote'?: string;
  };
  locale?: string;
};
