export type SupplementsProps = {
  locale: string;
  data: {
    'situational section': Array<{ [key: string]: string | number }>;
    foundational: string;
    'longevity and cellular health': string;
    'performance and recovery': string;
    situational: string;
    'key brain rules section': Array<{ [key: string]: string | number }>;
    title: string;
    description: string;
    basicStats: {
      label: string;
      value: string;
      icon: string;
    }[];
    hacks: string;
  };
};
