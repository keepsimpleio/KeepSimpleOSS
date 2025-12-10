export type LandingLayoutTypes = {
  headline: string;
  linkedInUrl: string;
  createdAt: string;
  updatedAt: string;
  xUrl: string;
  quote: string;
  tools: any;
  usedBy: any;
  supporters: any;
  projects: any;
  pageSeo: {
    seoDescription: string;
    seoTitle: string;
    keywords: string;
    pageTitle: string;
  };
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
};
