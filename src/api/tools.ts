export const getTools = async (locale: string) => {
  const fields = [
    'idForDev',
    'link',
    'title',
    'description',
    'poweredBy',
    'isInDevelopment',
  ]
    .map((f, i) => `populate[tools_list][fields][${i}]=${f}`)
    .join('&');
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/tool-setting?${fields}&populate[Seo]=*&locale=${locale}`;
  return await fetch(url)
    .then(resp => resp.json())
    .then(json => json?.data?.attributes || null);
};
