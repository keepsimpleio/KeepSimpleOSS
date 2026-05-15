export const getUXCoreSeo = async locale => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/uxcore-seo?locale=`;
  const result = await Promise.all([
    fetch(`${url}${locale}&populate[OGTags][populate]=ogImage`)
      .then(data => data.json())
      .then(data => data.data.attributes),
  ]);
  return result;
};

export const getUXCGSeo = async () => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/uxcg-seo?locale=`;
  const result = await Promise.all([
    fetch(`${url}en&populate[OGTags][populate]=ogImage`)
      .then(data => data.json())
      .then(data => data.data.attributes),
    fetch(`${url}ru&populate[OGTags][populate]=ogImage`)
      .then(data => data.json())
      .then(data => data.data.attributes),
  ]);
  return { en: result[0], ru: result[1] };
};

export const getUXCPSeo = async () => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/uxcp-seo?locale=`;
  const result = await Promise.all([
    fetch(`${url}en&populate[OGTags][populate]=ogImage`)
      .then(data => data.json())
      .then(data => data.data.attributes),
    fetch(`${url}ru&populate[OGTags][populate]=ogImage`)
      .then(data => data.json())
      .then(data => data.data.attributes),
  ]);
  return { en: result[0], ru: result[1] };
};

export const getUXCoreApiSeo = async () => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/uxcore-api?locale=`;
  const result = await Promise.all([
    fetch(`${url}en&populate[OGTags][populate]=ogImage`)
      .then(data => data.json())
      .then(data => data.data.attributes),
    fetch(`${url}ru&populate[OGTags][populate]=ogImage`)
      .then(data => data.json())
      .then(data => data.data.attributes),
  ]);
  return { en: result[0], ru: result[1] };
};
