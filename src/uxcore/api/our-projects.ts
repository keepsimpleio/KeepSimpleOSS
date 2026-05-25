export const getOurProjects = async (locale: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/our-project?locale=${locale}&pagination[pageSize]=100
                &populate[aboutProject][populate]=*
                &populate[github][populate]=*
                &populate[api][populate]=*`;

  return await fetch(url, {
    method: 'GET',
  })
    .then(data => data.json())
    .then(data => data?.data?.attributes);
};
