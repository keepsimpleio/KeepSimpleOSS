import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { FC, Fragment, useMemo } from 'react';

import type { QuestionType, StrapiBiasType, TagType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';

import { getStrapiBiases } from '@uxcore/api/biases';
import { getUXCPSeo } from '@uxcore/api/mainPageSeo';
import { getPersona } from '@uxcore/api/personas';
import { getStrapiQuestions } from '@uxcore/api/questions';
import { getTags } from '@uxcore/api/tags';

import pageNotFoundData from '@uxcore/data/404';

import SeoGenerator from '@uxcore/components/SeoGenerator';
import Spinner from '@uxcore/components/Spinner';

import UXCPLayout from '@uxcore/layouts/UXCPLayout';

import NotFoundPage from '../../404';

interface UXCPProps {
  questions: QuestionType[];
  biases: StrapiBiasType[];
  tags: TagType[];
  seo: { en: any; ru: any };
  singlePersona: any;
}

const PersonaId: FC<UXCPProps> = ({
  questions,
  biases,
  singlePersona,
  tags,
  seo,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const seoData = useMemo(() => seo[locale], [seo, locale]);
  const { personaId } = router.query;

  const existingPersonaName = singlePersona?.name;

  function flattenStrapiBiases<T>(data): [] {
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

  const strapiBiasesData = flattenStrapiBiases(biases[locale]);
  const questionsData = flattenStrapiQuestions(questions[locale]);

  const isValidId = personaId === singlePersona?.id;

  if (!isValidId) {
    return <NotFoundPage intl={pageNotFoundData[locale]} locale={locale} />;
  }
  let personaDecisionTable;
  if (singlePersona?.decisionTable) {
    try {
      personaDecisionTable = JSON.parse(singlePersona.decisionTable);
    } catch (e) {
      console.error('Failed to parse decisionTable:', e);
      personaDecisionTable = null;
    }
  } else {
    personaDecisionTable = null;
  }

  return (
    <>
      <Fragment>
        <SeoGenerator strapiSEO={seoData} />
        <UXCPLayout
          questions={questionsData}
          allLangBiases={biases}
          tags={tags}
          biases={strapiBiasesData}
          isSinglePersona
          existingPersonaName={existingPersonaName}
          personaDecisionTable={personaDecisionTable}
        />
      </Fragment>
      <Spinner />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const tags = getTags();
  const questions = await getStrapiQuestions();
  const biases = await getStrapiBiases();
  const { query } = context;
  const personaId = query.personaId as string;
  const userId = query.userId as string;
  const singlePersona = await getPersona(personaId, userId);

  const mainSeo = await getUXCPSeo();

  return {
    props: {
      biases,
      questions,
      tags,
      seo: mainSeo,
      singlePersona,
    },
  };
};

export default PersonaId;
