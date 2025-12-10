export type TLocales = 'en' | 'ru' | 'hy';

export type TStaticProps = { params: any; locale: TLocales };

export type TNavbarSubmenuItems = {
  label?: string;
  prefix?: string;
  title?: string;
  href?: string;
  target?: '_blank' | '_self';
  icon?: string;
  answers?: {
    description: string;
    items?: string[];
  };
};

export type TNavbarManagementTools = {
  title: string;
  href?: string;
  submenuItems?: TNavbarSubmenuItems[];
};

export type TNavbarDataItem = {
  title: string;
  href?: string;
  target?: string;
  icon?: string;
  submenuItems?: TNavbarSubmenuItems[];
  tools?: TNavbarManagementTools[];
};

export interface TitlesType {
  en: string;
  ru: string;
  hy: string;
}

export interface TagType {
  id: number;
  styles: {
    backgroundColor: string;
  };

  tooltip: TitlesType;
  title: TitlesType;
}

export type TArticle = {
  id: number;
  headline?: string;
  createdAt: string;
  updatedAt: string;
  OGTags: {
    ogDescription: string;
    ogTitle: string;
    ogType: string;
    ogImageAlt?: string;
    ogImage?: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
  attributes: {
    content: string;
    createdAt: string;
    description: string;
    locale: string;
    publishedAt: string;
    sequence_number: number;
    title: string;
    updatedAt: string;
    url: string;
    newUrl: string;
    category: any;
    seoDescription?: string;
    seoTitle?: string;
    keywords?: string;
    pageTitle?: string;
  };

  seoDescription?: string;
  seoTitle?: string;
  keywords?: string;
  pageTitle?: string;
  profile_image: any;
};

export type TPaths = {
  params: { page: string };
  locale: string;
};
