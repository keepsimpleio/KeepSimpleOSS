import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { FC, useMemo, useState } from 'react';

import { QuestionType, TagType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';

import {
  generateQuestionsSeo,
  mergeBiasesLocalization,
  mergeQuestionsLocalization,
} from '@uxcore/lib/helpers';

import { getStrapiBiases } from '@uxcore/api/biases';
import { getUXCGSeo } from '@uxcore/api/mainPageSeo';
import { getStrapiQuestions } from '@uxcore/api/questions';
import { getTags } from '@uxcore/api/tags';

import SeoGenerator from '@uxcore/components/SeoGenerator';
import Spinner from '@uxcore/components/Spinner';

import UXCGLayout from '@uxcore/layouts/UXCGLayout';

interface UxcgProps {
  tags: TagType[];
  questionsSeo: TagType[];
  mainSeo: { en: any; ru: any };
  allQuestions: QuestionType[];
}

const Index: FC<UxcgProps> = ({
  questionsSeo,
  mainSeo,
  tags,
  allQuestions,
}) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>('');
  const { asPath, locale } = router as TRouter;

  const seoData = useMemo(() => {
    const seoLocale = locale === 'ru' ? 'ru' : 'en';
    if (asPath === '/uxcg' || '/uxcg?searchTerm=') {
      return mainSeo[seoLocale];
    }
  }, [asPath, locale, mainSeo]);

  return (
    <>
      <SeoGenerator
        questionsSeo={questionsSeo}
        strapiSEO={seoData}
        ogTags={seoData.OGTags}
        type={'CollectionPage'}
        createdDate={'2021-07-16'}
        modifiedDate={seoData?.updatedAt}
      />
      <UXCGLayout
        questions={allQuestions[locale]}
        tags={tags}
        allQuestions={allQuestions}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <Spinner />
    </>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const tags = getTags();
  const questions = await getStrapiQuestions();
  const biases = await getStrapiBiases();
  const sortedBiases = mergeBiasesLocalization(
    biases.en,
    biases.ru,
    biases.hy,
  ).sort((a, b) => a.number - b.number);
  // HYTranslation TODO
  const sortedQuestions = mergeQuestionsLocalization(
    questions.en,
    questions.ru,
  ).sort((a, b) => a.number - b.number);
  const questionsSeo = generateQuestionsSeo(
    sortedQuestions,
    locale as 'en' | 'ru' | 'hy',
  );
  const mainSeo = await getUXCGSeo();

  return {
    props: {
      biases: sortedBiases,
      tags,
      questionsSeo,
      mainSeo,
      allQuestions: questions,
    },
    revalidate: 5,
  };
};
