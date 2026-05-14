import { getStrapiQuestions } from '@uxcore/api/questions';

export const getUXCGRedirects = async (
  locale: string,
): Promise<Record<string, string>> => {
  const questions = await getStrapiQuestions();

  const map: Record<string, string> = {};
  const localizedBiases = questions[locale] || [];

  localizedBiases.forEach(({ attributes }) => {
    const number = String(attributes.number);
    if (!map[number]) {
      map[number] = attributes.slug;
    }
  });

  return map;
};
