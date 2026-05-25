export interface Country {
  id: string;
  name: string;
  flag: string;
  region: RegionKey;
  rationale: string;
  biases: number[];
  confidence: number;
  aliases: string[];
  biasRationale: string;
}

export type RegionKey =
  | 'Americas'
  | 'Europe'
  | 'Asia'
  | 'Middle East'
  | 'Africa'
  | 'Oceania';

export type RegionLabels = Record<RegionKey | 'All', string>;

export interface CountryUI {
  chooseYour: string;
  cyclingWords: string[];
  cyclingBoldWord: string;
  subTaglineLead: string;
  subTagline: string;
  statTemplates: string;
  statReady: string;
  loadingMap: string;
  tooltipBiases: string;
  tooltipHint: string;
  searchPlaceholder: string;
  moreCountries: (n: number) => string;
  showLess: string;
  matchSuffix: string;
  whyTheseBiases: string;
  whyApproxNote: string;
  hofstedeNote: string;
  useInPersonaBuilder: string;
  emptyStateLead: string;
  emptyStateLink: string;
  emptyStateHint: string;
  footerBiases: string;
  footerConfidence: string;
}

export interface CountryBiasLocale {
  countries: Country[];
  ui: CountryUI;
  regions: RegionLabels;
}
