import { getStrapiBiases } from '@uxcore/api/biases';
import { getStrapiQuestions } from '@uxcore/api/questions';

export const getUXCoreTextPaths = async (locales: string[]) => {
  const strapiBiases = await getStrapiBiases();
  const paths: any[] = [];

  for (const locale of locales) {
    const localizedBiases = strapiBiases[locale] || [];

    localizedBiases.forEach(({ attributes }) => {
      if (attributes.locale === locale) {
        paths.push({
          params: { slug: attributes.slug },
          locale,
        });
      }
    });
  }

  return paths;
};

export const getUXCGSlugPaths = async (locales: string[]) => {
  const questions = await getStrapiQuestions();

  const paths: any[] = [];

  for (const locale of locales) {
    const localizedBiases = questions[locale] || [];

    localizedBiases.forEach(({ attributes }) => {
      paths.push({
        params: { slug: attributes.slug },
        locale,
      });
    });
  }

  return paths;
};
