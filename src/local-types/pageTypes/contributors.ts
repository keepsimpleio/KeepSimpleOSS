export type OgImage = {
  data: { attributes: { url: string; staticUrl?: string } };
};

export type OgTags = {
  ogDescription: string;
  ogTitle: string;
  ogType: string;
  ogImageAlt?: string;
  ogImage?: OgImage;
};

export type Seo = {
  seoDescription: string;
  pageTitle: string;
  seoTitle: string;
  keywords: string;
};

export type Contributor = {
  name: string;
  role: string;
  japaneseLetter: string;
  isActive: boolean;
  socialLink?: string;
};

export type ContributorLocaleData = {
  title: string;
  description: string;
  Seo: Seo;
  OGTags: OgTags;
  contributors: Contributor[];
  createdAt: string;
  updatedAt: string;
};
