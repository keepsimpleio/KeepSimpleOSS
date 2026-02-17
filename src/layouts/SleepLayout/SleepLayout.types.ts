export type SleepLayoutProps = {
  locale: string;
  data: {
    title: string;
    description: string;
    basicStats: {
      label: string;
      value: string;
      icon: string;
    }[];
    hacks?: string;
    'japanese title'?: string;
    'background image'?: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
  supplements?: {
    'product name': string;
    'product benefits': string;
    supplements: string[];
  }[];
  'key brain rules section'?: {
    [key: string]: string;
  };
};
