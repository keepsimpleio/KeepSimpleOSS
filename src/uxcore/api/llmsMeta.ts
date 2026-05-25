export const getLlmsMeta = async () => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/llms-meta`;
  return await fetch(url, {
    method: 'GET',
  })
    .then(data => data.json())
    .then(data => data?.data?.attributes);
};
