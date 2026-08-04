let cachedBiases: any = null;
let cachedSlimBiases: any = null;
const LOCALES = ['en', 'ru', 'hy'];
const PAGE_SIZE = 100;
const TOTAL_ITEMS_EXPECTED = 105;

const SLIM_FIELDS = [
  'number',
  'title',
  'description',
  'slug',
  // test-result.tsx JSON.parses this to pick recommended reading — omitting it
  // makes that page throw once the bias list is populated.
  'mentionedQuestionsIds',
];
const SLIM_LOCALES = ['en', 'ru'];

// UXCAT renders bias titles/descriptions from the shared bias list, but the
// full payload (SEO, OG images, usage sections) is ~30x larger than what those
// screens read. Fetch only the fields UXCAT needs.
export const getSlimBiases = async () => {
  if (cachedSlimBiases) return cachedSlimBiases;

  const fieldsQuery = SLIM_FIELDS.map(
    (field, index) => `fields[${index}]=${field}`,
  ).join('&');

  const allData = { en: [], ru: [], hy: [] };

  for (const locale of SLIM_LOCALES) {
    let page = 1;
    while (true) {
      const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/biases?locale=${locale}&sort=number&pagination[pageSize]=${PAGE_SIZE}&pagination[page]=${page}&${fieldsQuery}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!json.data || json.data.length === 0) break;

      allData[locale].push(...json.data);

      if (json.data.length < PAGE_SIZE) break;
      page++;
    }
  }

  cachedSlimBiases = allData;
  return allData;
};

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
