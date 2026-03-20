export const getArticleBlog = async (locale: string) => {
  const chosenLocale = locale === 'ru' ? 'ru' : 'en';

  const articleUrl = `${process.env.NEXT_PUBLIC_STRAPI}/api/article-blog?locale=${chosenLocale}&populate[OGTags][populate]=ogImage&populate=Seo&populate[featuredArticles][populate][0]=coverImage&populate[featuredArticles][populate][1]=tags&populate[tags]`;

  return await fetch(articleUrl)
    .then(resp => resp.json())
    .then(json => json?.data || []);
};
