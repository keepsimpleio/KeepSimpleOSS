import { getStrapiBiases } from '@uxcore/api/biases';

export const getRedirectMap = async (
  locale: string,
): Promise<Record<string, string>> => {
  const strapiBiases = await getStrapiBiases();

  const map: Record<string, string> = {};
  const localizedBiases = strapiBiases[locale] || [];

  localizedBiases.forEach(({ attributes }) => {
    const number = String(attributes.number);
    if (!map[number]) {
      map[number] = attributes.slug;
    }
  });

  return map;
};
