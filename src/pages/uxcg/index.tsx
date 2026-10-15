import { getUXCGSeo } from '@uxcore/api/mainPageSeo';
import { getStrapiQuestions } from '@uxcore/api/questions';
import { getTags } from '@uxcore/api/tags';
import SeoGenerator from '@uxcore/components/SeoGenerator';
import Spinner from '@uxcore/components/Spinner';
import UXCGLayout from '@uxcore/layouts/UXCGLayout';
import {
  generateQuestionsSeo,
  mergeQuestionsLocalization,
  slimUXCGQuestions,
} from '@uxcore/lib/helpers';
import { QuestionType, TagType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { FC, useMemo, useState } from 'react';

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
      tags,
      questionsSeo,
      mainSeo,
      allQuestions: slimUXCGQuestions(questions, locale),
    },
    revalidate: 5,
  };
};
