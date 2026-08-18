import { getStrapiBiases } from '@uxcore/api/biases';
import { getStrapiQuestions } from '@uxcore/api/questions';
import { getTags } from '@uxcore/api/tags';
import SeoGenerator from '@uxcore/components/SeoGenerator';
import UXCoreModal from '@uxcore/components/UXCoreModal';
import useUXCoreGlobals from '@uxcore/hooks/useUXCoreGlobals';
import UXCoreLayout from '@uxcore/layouts/UXCoreLayout';
import { getRedirectMap } from '@uxcore/lib/getUXCoreRedirects';
import {
  getAdjacentBiasTitles,
  mergeBiasesLocalization,
} from '@uxcore/lib/helpers';
import { isOffsecEnabled } from '@uxcore/lib/offsec';
import { getUXCoreTextPaths } from '@uxcore/lib/paths';
import type {
  QuestionType,
  StrapiBiasType,
  TagType,
} from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo, useState } from 'react';

import styles from './uxcoreId.module.scss';

interface UXCoreProps {
  tags: TagType[];
  currentModalData?: StrapiBiasType;
  currentActiveBias?: any;
  languageSwitchSlugs: Record<string, string>;
  biases: Record<string, StrapiBiasType[]>;
  uxcgLocalizedData: Record<string, QuestionType[]>;
}

const UXCoreIds: FC<UXCoreProps> = ({
  tags,
  currentModalData,
  currentActiveBias,
  languageSwitchSlugs,
  biases,
  uxcgLocalizedData,
}) => {
  const [activeBiasNumber, setActiveBiasNumber] = useState<number>(null);
  const [, setIsModalClosed] = useState<boolean>(true);
  const [, { isProductView, isOffsecView }] = useUXCoreGlobals();
  const router = useRouter();
  const { locale } = router as TRouter;

  const slugs = {
    slugEn: `/uxcore/${currentModalData?.slugEn}`,
    slugRu: `/uxcore/${currentModalData?.slugRu}`,
  };

  const strapiQuestions = uxcgLocalizedData?.[locale] ?? [];

  // mentionedQuestionsIds comes from Strapi as a JSON string; a null/garbage
  // value must degrade to "no mentions", not crash the whole bias page.
  const mentionedQuestionIds = useMemo(() => {
    try {
      const parsed = JSON.parse(currentModalData?.mentionedQuestionsIds);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [currentModalData?.mentionedQuestionsIds]);

  const mentionedQuestions = strapiQuestions.filter(({ attributes }) =>
    mentionedQuestionIds.includes(attributes?.number),
  );

  const openSelectedBias = (number, slug) => {
    router.push(`/uxcore/${slug}`, undefined, {
      scroll: true,
      shallow: false,
      locale: locale,
    });
    setActiveBiasNumber(Number(number));
  };

  const { prev, next } = getAdjacentBiasTitles(
    locale,
    biases,
    activeBiasNumber,
  );

  const seoData = useMemo(() => {
    if (currentActiveBias.number) {
      const lang = locale === 'ru' ? 'Ru' : 'En';
      // we need currentModalData right now for using english content for HY, but this will be removed in the future
      return {
        title: currentModalData[`seoTitle${lang}`],
        description: currentModalData[`seoDescription${lang}`],
        keywords: currentModalData[`keywords${lang}`],
        pageTitle: currentModalData[`pageTitle${lang}`],
      };
    }
  }, [currentActiveBias.number, locale]);

  const OGTags = useMemo(() => {
    if (currentActiveBias.number) {
      const lang = locale === 'ru' ? 'Ru' : 'En';
      return {
        OGTags: {
          ogDescription: currentModalData[`OGTags${lang}`]?.ogDescription,
          ogTitle: currentModalData[`OGTags${lang}`]?.ogTitle,
          ogStaticTitle: currentModalData[`seoTitle${lang}`],
          ogType: currentModalData[`OGTags${lang}`]?.ogType || 'article',
          ogImageAlt: currentModalData[`OGTags${lang}`]?.ogImageAlt,
          ogImage: {
            data: {
              attributes: {
                url: currentModalData[`OGTags${lang}`]?.ogImage?.data
                  ?.attributes?.url,
                staticUrl: '/assets/ogImages/UXCore.png',
              },
            },
          },
        },
      };
    }
  }, [currentActiveBias.number, locale]);

  // Keep the modal's bias in sync with the route. Depending on the prop (not
  // mount-only) makes browser Back/Forward land on the right bias instead of
  // leaving the modal stuck on the previously viewed one.
  useEffect(() => {
    setActiveBiasNumber(Number(currentActiveBias.number));
  }, [currentActiveBias.number]);

  useEffect(() => {
    const offsecActive = isOffsecEnabled && isOffsecView;
    const newHash = offsecActive ? 'offsec' : isProductView ? '' : 'hr';
    const currentPath = router.asPath.split('#')[0];
    const newUrl = `${currentPath}${newHash ? '#' + newHash : ''}`;
    if (router.asPath !== newUrl) {
      // Hash-only change: shallow, no scroll — switching the use case inside
      // the modal must not refetch the page or jump to the top.
      router.push(newUrl, undefined, { shallow: true, scroll: false });
    }
  }, [isProductView, isOffsecView, router.asPath]);

  const openPage = () => {
    router.push(`/uxcore`, undefined, { scroll: true });
  };

  useEffect(() => {
    router.prefetch('/uxcore');
  }, []);

  return (
    <>
      <SeoGenerator
        strapiSEO={seoData}
        ogTags={OGTags.OGTags}
        localizedSlug={slugs}
        type={'DefinedTerm'}
        createdDate={'2020-07-23'}
        modifiedDate={currentActiveBias.updatedAt}
      />
      <h1 className={styles.headingTitle}>{currentActiveBias.title}</h1>
      {/* UXCoreModal carries its own mobile layout now (pills, dark theme,
          loaders) — the legacy UXCoreModalMobile swap is retired. */}
      <UXCoreModal
        headingTitle={currentActiveBias.title}
        isProductView={!isProductView}
        setIsModalClosed={setIsModalClosed}
        biasNumber={activeBiasNumber}
        isSecondView={!isProductView}
        secondViewLabel={'hr'}
        defaultViewLabel="product"
        questions={mentionedQuestions}
        tags={tags}
        data={Number(currentActiveBias.number) && currentActiveBias}
        onClose={openPage}
        onChangeBiasId={openSelectedBias}
        nextBiasName={next}
        prevBiasName={prev}
        slugs={languageSwitchSlugs}
      />
      {biases[locale] ? (
        <UXCoreLayout
          strapiBiases={biases[locale]}
          isOpen={!!currentActiveBias.number}
          biasSelected={!!activeBiasNumber}
          blockLanguageSwitcher
        />
      ) : null}
    </>
  );
};

export default UXCoreIds;

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  // BUILD-TIME SAFETY (uxcore-merge): a Strapi fetch can return HTML
  // (Cloudflare bot challenge against GH Actions runners). Return empty
  // paths so the build doesn't abort; fallback: 'blocking' below makes
  // requests render on-demand at runtime where Strapi is reachable.
  try {
    const newPaths = await getUXCoreTextPaths(locales);
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
    const map = await getRedirectMap(locale as 'en' | 'ru' | 'hy');
    const resolvedSlug = map[slug];
    if (resolvedSlug) {
      return {
        redirect: {
          destination: `${locale === 'en' ? '' : `/${locale}`}/uxcore/${resolvedSlug}`,
          permanent: true,
        },
      };
    }
  }

  const [number] = slug.split('-');

  const [strapiBiases, strapiQuestions] = await Promise.all([
    getStrapiBiases(),
    getStrapiQuestions(),
  ]);
  const biases = mergeBiasesLocalization(
    strapiBiases.en,
    strapiBiases.ru,
    strapiBiases.hy,
  );
  // Note: We keep this for SEO, will be removed in the future!
  const currentActiveBias = biases.find(
    ({ number: biasNumber }) => String(biasNumber) === number,
  );

  const currentActiveBiasWithLocale = strapiBiases[
    locale as 'en' | 'ru' | 'hy'
  ].find(({ attributes }) => String(attributes.slug) === slug);

  if (!currentActiveBiasWithLocale) {
    return { notFound: true };
  }
  const languageSwitchSlugs = {
    en: currentActiveBias?.slugEn,
    ru: currentActiveBias?.slugRu,
    hy: currentActiveBias?.slugEn,
  };

  return {
    props: {
      tags: getTags(),
      currentModalData: currentActiveBias,
      languageSwitchSlugs,
      currentActiveBias: currentActiveBiasWithLocale.attributes,
      biases: strapiBiases,
      uxcgLocalizedData: strapiQuestions,
    },
    revalidate: 5,
  };
};
