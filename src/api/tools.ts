export const getTools = async (locale: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/tool-setting?populate[tools_list][populate]=*&populate[Seo]=*&locale=${locale}`;
  return await fetch(url)
    .then(resp => resp.json())
    .then(json => json?.data?.attributes || null);
};
