export const getLevels = async locale => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/uxcat-levels?locale=${locale}&populate=*`;

  return await fetch(url, {
    method: 'GET',
  }).then(data => data.json());
};
