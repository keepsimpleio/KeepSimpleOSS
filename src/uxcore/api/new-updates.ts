export const getNewUpdate = async (locale: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/new-update?locale=${locale}&populate=*`;

  return await fetch(url, {
    method: 'GET',
  })
    .then(data => data.json())
    .then(data => data?.data?.attributes);
};
