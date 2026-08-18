let cachedBiases: any = null;
let cachedBiasesAt = 0;
const LOCALES = ['en', 'ru', 'hy'];
const PAGE_SIZE = 100;
const TOTAL_ITEMS_EXPECTED = 105;
// A complete result is reused for the TTL, then refetched so ISR
// revalidation actually picks up Strapi content edits. An incomplete or
// failed fetch is never cached (a transient empty response must not
// 404-poison every bias page until a container restart); the previous
// complete result keeps serving instead.
const CACHE_TTL_MS = 5 * 60 * 1000;

export const getStrapiBiases = async () => {
  if (cachedBiases && Date.now() - cachedBiasesAt < CACHE_TTL_MS) {
    return cachedBiases;
  }

  const allData = {
    en: [],
    ru: [],
    hy: [],
  };

  try {
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
  } catch (err) {
    if (cachedBiases) return cachedBiases;
    throw err;
  }

  // hy is a partial override set in Strapi, so completeness is judged on
  // the two full locales only.
  const isComplete =
    allData.en.length >= TOTAL_ITEMS_EXPECTED &&
    allData.ru.length >= TOTAL_ITEMS_EXPECTED;

  if (!isComplete && cachedBiases) return cachedBiases;

  if (isComplete) {
    cachedBiases = allData;
    cachedBiasesAt = Date.now();
  }
  return allData;
};
