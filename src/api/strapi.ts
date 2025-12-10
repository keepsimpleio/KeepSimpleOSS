import { TArticle, TLocales } from '@local-types/data';

export const getMyInfo = async () => {
  const myInfoUrl: string = `${process.env.NEXT_PUBLIC_STRAPI}/api/users/me`;
  const token: string = localStorage?.getItem('accessToken');
  if (token) {
    try {
      const data = await fetch(myInfoUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(resp => resp.json());

      if (data.error) {
        const { status, message } = data.error;
        throw new Error(`Error ${status} \n ${message}`);
      }

      return data;
    } catch (e) {
      console.error(e);
      window.localStorage.removeItem('accessToken');
    }
  }
};

export const getArticles = async (locale: TLocales) => {
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const articleUrl = `${process.env.NEXT_PUBLIC_STRAPI}/api/articles?locale=${currentLocale}
&populate[coverImage]=*
&populate[footerImage]=*
&populate[OGTags][populate]=ogImage`;
  const articles: TArticle[] = await fetch(articleUrl)
    .then(resp => resp.json())
    .then(json => json?.data || []);

  return articles;
};

export const getHomeData = async (locale: TLocales) => {
  const homeUrl = `${process.env.NEXT_PUBLIC_STRAPI}/api/home-page?locale=${locale}&populate[tools][populate]=icon&populate[usedBy][populate]=*&populate[projects]=*&populate[pageSeo]=*&populate[supporters][populate]=image&populate[OGTags][populate]=ogImage`;
  return await fetch(homeUrl)
    .then(resp => resp.json())
    .then(json => json?.data?.attributes || null);
};

export const getCurrentArticle = (articles: TArticle[], url: string) => {
  const article = articles.find(
    ({ attributes }: any) => attributes.newUrl === url,
  )?.attributes;
  return article || {};
};

export const getArticleNewPaths = async () => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/articles?locale=all&populate=*`;

  const articles = await fetch(url)
    .then(resp => resp.json())
    .then(json => json?.data || []);

  const filteredArticles = articles.filter(
    article => article.attributes?.newUrl !== 'company-management',
  );
  const strapiPaths = filteredArticles
    .map((article: TArticle) => ({
      params: {
        page: article.attributes?.newUrl || '',
      },
      locale: article?.attributes?.locale,
    }))
    .filter(
      (path: any) =>
        !path?.params?.page?.[0]?.includes('http') &&
        path?.params?.page?.[0] !== 'uxeducation',
    );

  return strapiPaths;
};

export const getPyramids = async (locale: TLocales) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/pyramids?locale=${locale}&populate=*`;
  return await fetch(url, {
    method: 'GET',
  }).then(data => data.json());
};

export const getCompanyManagementData = async (locale: TLocales) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/company-management?locale=${locale}&populate[OGTags][populate]=ogImage`;
  return await fetch(url, {
    method: 'GET',
  }).then(data => data.json());
};

export const getPyramidStats = async (locale: TLocales) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/pyramid-stats?locale=${locale}&populate%5Bstatistics%5D%5Bpopulate%5D=tooltip`;
  return await fetch(url, {
    method: 'GET',
  }).then(data => data.json());
};
