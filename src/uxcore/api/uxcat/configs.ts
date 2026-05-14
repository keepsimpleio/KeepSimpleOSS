export const UXCatConfigs = async () => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/uxcat-config`;

  return await fetch(url)
    .then(resp => resp.json())
    .then(data => data.data.attributes);
};

export const UxCatRoute: string = process.env.NEXT_PUBLIC_UXCAT_API;

export const requestBody = {
  system: 'uxcat',
};
