export interface TitlesType {
  en: string;
  ru: string;
  hy: string;
}

export interface QuestionType {
  attributes: any; //HYTranslation TODO
  title: any;
  titleEn: string;
  titleRu: string;
  titleHy: string;
  number: number | null;
  answersEn: string;
  answersRu: string;
  answersHy: string;
  tags: number[];
  downloadLinks?: {
    en?: string;
    ru?: string;
  };
  aliases: string[];
  relatedQuestions: number[];
  _id?: string;
  __v?: number;
  seoTitleEn: string;
  seoTitleRu: string;
  seoTitleHy: string;
  keywordsEn: string;
  keywordsRu: string;
  keywordsHy: string;
  seoDescriptionEn: string;
  seoDescriptionRu: string;
  seoDescriptionHy: string;
  pageTitleEn: string;
  pageTitleRu: string;
  pageTitleHy: string;
  slugEn: string;
  slugRu: string;
  slugHy: string;
  slug?: string;
  updatedAt?: string;
}

export interface TagType {
  id: number;
  iconUrl?: string;
  styles: {
    backgroundColor: string;
  };

  tooltip: TitlesType;
  title: TitlesType;
  backgroundUrl: string;
  iconName: string;
}

export interface BiasType {
  mentionedQuestionsIds: string[];
  p: boolean;
  m: boolean;
  titleEn: string;
  descrEn: string;
  usageEn: string;
  wikiLink: string;
  titleRu: string;
  descrRu: string;
  usageRu: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  _id?: string;
  __v?: number;
  attributes?: any; // HYTranslation TODO
}

export interface StrapiBiasType {
  titleEn: string;
  titleRu: string;
  titleHy: string;
  title?: string;

  OGTagsEn: any;
  OGTagsRu: any;
  OGTagsHy: any;

  descrEn: string;
  descrRu: string;
  descrHy: string;

  usageEn: string;
  usageRu: string;
  usageHy: string;

  usageHrEn: string;
  usageHrRu: string;
  usageHrHy: string;

  usageUiUxEn: string;
  usageUiUxRu: string;
  usageUiUxHy: string;

  number: number;
  _id?: number;

  mentionedQuestionsIds: string;

  wikiLinkEn: string;
  wikiLinkRu: string;
  wikiLinkHy: string;

  m: boolean;
  p: boolean;

  seoTitleEn: string;
  seoTitleRu: string;
  seoTitleHy: string;

  pageTitleEn: string;
  pageTitleRu: string;
  pageTitleHy: string;

  keywordsEn: string;
  keywordsRu: string;
  keywordsHy: string;

  seoDescriptionEn: string;
  seoDescriptionRu: string;
  seoDescriptionHy: string;
  [key: string]: string | number | boolean;

  attributes?: any; // HYTranslation TODO
}

export type RelevantQuestionType = QuestionType & {
  relevantFor: StrapiBiasType[];
  relevancy: number;
  relevancyIndex: number;
  relevancyTitle: 'high' | 'medium' | 'low';
  percentOfAppearing: number;
};

export type SuggestedQuestionType = QuestionType & {
  relevancy: number;
  relevancyIndex: number;
  relevancyTitle: 'high' | 'medium' | 'low';
  percentOfAppearing: number;
};
