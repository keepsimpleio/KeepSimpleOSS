import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { FC, useMemo } from 'react';

import type { QuestionType, StrapiBiasType, TagType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';

import { getStrapiBiases } from '@uxcore/api/biases';
import { getUXCPSeo } from '@uxcore/api/mainPageSeo';
import { getStrapiQuestions } from '@uxcore/api/questions';
import { getTags } from '@uxcore/api/tags';

import SeoGenerator from '@uxcore/components/SeoGenerator';
import Spinner from '@uxcore/components/Spinner';

import UXCPLayout from '@uxcore/layouts/UXCPLayout';

interface UXCPProps {
  questions: QuestionType[];
  strapiBiases: StrapiBiasType[];
  tags: TagType[];
  seo: { en: any; ru: any };
}

const Index: FC<UXCPProps> = ({ questions, strapiBiases, tags, seo }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const isRu = locale === 'ru';
  const seoData = useMemo(() => seo[isRu ? 'ru' : 'en'], [seo, locale]);

  function flattenStrapiBiases(data): [] {
    return data.map(({ id, attributes }) => ({
      _id: id,
      ...attributes,
    }));
  }

  function flattenStrapiQuestions<T>(data): [] {
    return data.map(({ attributes }) => ({
      ...attributes,
      aliases: [attributes.aliases],
      tags: JSON.parse(attributes?.tags) || [],
      relatedQuestions: JSON.parse(attributes?.relatedQuestions) || [],
    }));
  }
  const strapiBiasesData = flattenStrapiBiases(strapiBiases[locale]);
  const questionsData = flattenStrapiQuestions(questions[locale]);

  return (
    <>
      <SeoGenerator
        strapiSEO={seoData}
        ogTags={seoData.OGTags}
        createdDate={'2022-05-05'}
        modifiedDate={seoData.updatedAt}
      />
      <UXCPLayout
        questions={questionsData}
        allLangBiases={strapiBiases}
        tags={tags}
        biases={strapiBiasesData}
      />
      <Spinner />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const tags = getTags();
  const questions = await getStrapiQuestions();
  const strapiBiases = await getStrapiBiases();

  const mainSeo = await getUXCPSeo();

  return {
    props: {
      strapiBiases,
      questions,
      tags,
      seo: mainSeo,
    },
    revalidate: 5,
  };
};

export default Index;
