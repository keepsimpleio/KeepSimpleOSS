import { getStrapiBiases } from '@uxcore/api/biases';
import { getUXCGSeo } from '@uxcore/api/mainPageSeo';
import { getStrapiQuestions } from '@uxcore/api/questions';
import { getTags } from '@uxcore/api/tags';
import SeoGenerator from '@uxcore/components/SeoGenerator';
import UXCGModal from '@uxcore/components/UXCGModal';
import UXCGLayout from '@uxcore/layouts/UXCGLayout';
import { getUXCGRedirects } from '@uxcore/lib/getUXCGRedirects';
import {
  copyToClipboard,
  generateQuestionsSeo,
  getAdjacentUXCGTitles,
  mergeQuestionsLocalization,
} from '@uxcore/lib/helpers';
import { getUXCGSlugPaths } from '@uxcore/lib/paths';
import {
  QuestionType,
  StrapiBiasType,
  TagType,
} from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from './UxcgId.module.scss';

interface UXCGIdProps {
  tags: TagType[];
  questionsSeo: TagType[];
  mainSeo: { en: any; ru: any };
  uxcgId: number;
  questionsLength?: number;
  title?: string;
  modalData?: QuestionType;
  answerRelatedQuestions?: QuestionType;
  questions?: QuestionType;
  allQuestions: QuestionType;
  id?: number;
  languageSwitchSlugs?: Record<string, string>;
  biases: Record<string, StrapiBiasType[]>;
}

const Slug: FC<UXCGIdProps> = ({
  tags,
  questionsSeo,
  mainSeo,
  title,
  modalData,
  answerRelatedQuestions,
  questionsLength,
  questions,
  allQuestions,
  id,
  languageSwitchSlugs,
  biases,
}) => {
  const router = useRouter();
  const { asPath, locale } = router as TRouter;
  const searchQuery = router.query.search;
  const searchTermQuery = router.query.searchTerm;
  const searchTerm =
    typeof searchTermQuery === 'string' && searchTermQuery
      ? searchTermQuery
      : typeof searchQuery === 'string'
        ? searchQuery
        : undefined;

  const [isModalClosed, setIsModalClosed] = useState<boolean>(true);
  const [questionId, setQuestionId] = useState<number>(id);
  const [answerId, setAnswerId] = useState<number>(null);
  const [searchValue, setSearchValue] = useState<string>(searchTerm as string);
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);
  const tooltipTimer: { current: any } = useRef();
  const { prev, next } = getAdjacentUXCGTitles(locale, allQuestions, id);

  const slugs = {
    slugEn: `/uxcg/${modalData?.slugEn}`,
    slugRu: `/uxcg/${modalData?.slugRu}`,
  };

  const OGTags = useMemo(() => {
    if (modalData.number) {
      const lang = locale === 'ru' ? 'Ru' : 'En';
      return {
        OGTags: {
          ogDescription: modalData[`OGTags${lang}`]?.ogDescription,
          ogTitle: modalData[`OGTags${lang}`]?.ogTitle,
          ogStaticTitle: modalData[`seoTitle${lang}`],
          ogType: modalData[`OGTags${lang}`]?.ogType || 'article',
          ogImageAlt: modalData[`OGTags${lang}`]?.ogImageAlt,
          ogImage: {
            data: {
              attributes: {
                url: modalData[`OGTags${lang}`]?.OGTags?.ogImage?.data
                  ?.attributes?.url,
                staticUrl: '/assets/ogImages/UXCore.png',
              },
            },
          },
        },
      };
    }
  }, [modalData, locale]);

  const handleSelectedQuestion = useCallback(
    (newId, newSlug) => {
      router.push(`/uxcg/${newSlug}`, undefined, { scroll: false });
      setQuestionId(Number(newId));
    },
    [router],
  );

  // Copy link to clipboard
  const handleCopyLink = useCallback(() => {
    copyToClipboard(window.location.href);
    setIsCopyTooltipVisible(true);

    clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => {
      setIsCopyTooltipVisible(false);
    }, 1500);
  }, [copyToClipboard]);

  // Click on question in modal
  const handleQuestionClick = useCallback(
    (number, slug) => {
      handleSelectedQuestion(Number(number), slug);
    },
    [handleSelectedQuestion],
  );

  const closeModal = () => {
    router.push(`/uxcg`, undefined, { scroll: false });
  };

  useEffect(() => {
    setQuestionId(id);
    if (!isModalClosed) {
      setQuestionId(null);
    }
  }, []);

  useEffect(() => {
    let str = asPath;
    let newAnswerId = null;
    const indexOfHashTag = str.indexOf('#');

    if (indexOfHashTag !== -1) {
      newAnswerId = Number(str.slice(indexOfHashTag + 1));
      str = str.slice(0, indexOfHashTag);
    }

    const possibleQuestionNumberTest = str.slice(6);
    setQuestionId(Number(possibleQuestionNumberTest) || null);
    setAnswerId(newAnswerId);
  }, [asPath]);

  useEffect(() => {
    if (searchTerm) {
      setSearchValue(searchTerm as string);
    }
  }, []);

  return (
    <>
      <SeoGenerator
        questionsSeo={questionsSeo}
        strapiSEO={mainSeo}
        ogTags={OGTags.OGTags}
        type={'DefinedTerm'}
        localizedSlug={slugs}
        modifiedDate={modalData?.updatedAt}
        createdDate={'2021-07-16'}
      />
      <h1 className={styles.title}>{title}</h1>
      {/* UXCGModal carries its own mobile layout now (pills, dark theme,
          loaders) — the legacy UXCGModalMobile swap is retired. */}
      <UXCGModal
        data={id && modalData}
        setIsModalClosed={setIsModalClosed}
        questionId={questionId}
        answerId={answerId}
        biases={biases?.[locale]}
        tags={tags}
        totalLength={questionsLength}
        onChangeQuestionId={handleSelectedQuestion}
        closeModal={closeModal}
        handleQuestionClick={handleQuestionClick}
        relatedQuestions={answerRelatedQuestions}
        handleCopyLink={handleCopyLink}
        isCopyTooltipVisible={isCopyTooltipVisible}
        nextQuestion={next}
        prevQuestion={prev}
        id={id}
        slugs={languageSwitchSlugs}
      />
      <UXCGLayout
        questions={allQuestions[locale]}
        tags={tags}
        changedHeadingOrder={true}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        allQuestions={allQuestions}
      />
    </>
  );
};

export default Slug;

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  // BUILD-TIME SAFETY (uxcore-merge): a Strapi fetch can return HTML
  // (Cloudflare bot challenge against GH Actions runners). Return empty
  // paths so the build doesn't abort; fallback: 'blocking' below makes
  // requests render on-demand at runtime where Strapi is reachable.
  try {
    const newPaths = await getUXCGSlugPaths(locales);
    return { paths: [...newPaths], fallback: 'blocking' };
  } catch (err) {
    console.warn(
      '[getStaticPaths] build-time fetch failed, empty paths fallback:',
      err,
    );
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const { slug } = params as { slug: string };

  if (/^\d+$/.test(slug)) {
    const map = await getUXCGRedirects(locale as 'en' | 'ru' | 'hy');
    const resolvedSlug = map[slug];
    if (resolvedSlug) {
      return {
        redirect: {
          destination: `${locale === 'en' ? '' : `/${locale}`}/uxcg/${resolvedSlug}`,
          permanent: true,
        },
      };
    }
  }

  const tags = getTags();
  const questions = await getStrapiQuestions();
  const biases = await getStrapiBiases();

  const sortedQuestions = mergeQuestionsLocalization(
    questions.en,
    questions.ru,
    questions.hy,
  ).sort((a, b) => a.number - b.number);

  const questionsSeo = generateQuestionsSeo(
    sortedQuestions,
    locale as 'en' | 'ru' | 'hy',
  );
  const mainSeo = await getUXCGSeo();

  const question = questions[locale as 'en' | 'ru' | 'hy'].find(
    ({ attributes }) => String(attributes?.slug) === slug,
  );

  const uxcgData = sortedQuestions?.find(
    ({ number }) => question?.attributes?.number === number,
  );

  const mapRelatedQuestions = (relatedQuestions, questions) =>
    relatedQuestions?.map((id: number) => {
      return questions.find(({ number }) => number === id);
    });

  const answerRelatedQuestions = mapRelatedQuestions(
    uxcgData?.relatedQuestions,
    sortedQuestions,
  );
  const languageSwitchSlugs = {
    en: uxcgData?.slugEn,
    ru: uxcgData?.slugRu,
    hy: uxcgData?.slugEn,
  };

  if (!uxcgData) {
    return { notFound: true };
  }
  return {
    props: {
      currentSlug: slug,
      languageSwitchSlugs,
      tags,
      questionsTest: questions,
      questionsSeo,
      title: question?.attributes?.title || '',
      mainSeo,
      modalData: uxcgData || null,
      answerRelatedQuestions: answerRelatedQuestions || null,
      questionsLength: sortedQuestions?.length,
      questions: sortedQuestions,
      allQuestions: questions,
      id: question?.attributes.number || null,
      biases,
    },
    revalidate: 5,
  };
};
