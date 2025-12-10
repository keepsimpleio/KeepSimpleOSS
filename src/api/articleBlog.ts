export const getArticleBlog = async (locale: string) => {
  const chosenLocale = locale === 'ru' ? 'ru' : 'en';

  const articleUrl = `${process.env.NEXT_PUBLIC_STRAPI}/api/article-blog?locale=${chosenLocale}&populate[OGTags][populate]=ogImage&populate=Seo&populate[featuredArticles][populate]=coverImage`;

  return await fetch(articleUrl)
    .then(resp => resp.json())
    .then(json => json?.data || []);
};
