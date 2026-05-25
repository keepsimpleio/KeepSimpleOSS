let cachedBiases: any = null;
const LOCALES = ['en', 'ru', 'hy'];
const PAGE_SIZE = 100;
const TOTAL_ITEMS_EXPECTED = 105;

export const getStrapiBiases = async () => {
  if (cachedBiases) return cachedBiases;

  const allData = {
    en: [],
    ru: [],
    hy: [],
  };

  for (const locale of LOCALES) {
    let page = 1;
    let fetched = 0;
    while (fetched < TOTAL_ITEMS_EXPECTED) {
      const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/biases?locale=${locale}&sort=number&pagination[pageSize]=${PAGE_SIZE}&pagination[page]=${page}&populate[OGTags][populate]=ogImage`;
      const res = await fetch(url);
      const json = await res.json();

      if (!json.data || json.data.length === 0) break;

      allData[locale].push(...json.data);
      fetched += json.data.length;

      if (json.data.length < PAGE_SIZE) break; // no more pages
      page++;
    }
  }

  cachedBiases = allData;
  return allData;
};
