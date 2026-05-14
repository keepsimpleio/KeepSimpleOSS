import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useMemo, useState } from 'react';

import type { QuestionType, StrapiBiasType, TagType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';

import useMobile from '@uxcore/hooks/useMobile';
import useUXCoreGlobals from '@uxcore/hooks/useUXCoreGlobals';

import { getAdjacentBiasTitles, mergeBiasesLocalization } from '@uxcore/lib/helpers';
import { getUXCoreTextPaths } from '@uxcore/lib/paths';

import { getStrapiBiases } from '@uxcore/api/biases';
import { getTags } from '@uxcore/api/tags';

import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import SeoGenerator from '@uxcore/components/SeoGenerator';
import UXCoreModal from '@uxcore/components/UXCoreModal';
import UXCoreModalMobile from '@uxcore/components/UXCoreModalMobile';

import UXCoreLayout from '@uxcore/layouts/UXCoreLayout';

import { getRedirectMap } from '@uxcore/lib/getUXCoreRedirects';

import styles from './uxcoreId.module.scss';

interface UXCoreProps {
  tags: TagType[];
  currentModalData?: StrapiBiasType;
  currentActiveBias?: any;
  languageSwitchSlugs: Record<string, string>;
}

const UXCoreIds: FC<UXCoreProps> = ({
  tags,
  currentModalData,
  currentActiveBias,
  languageSwitchSlugs,
}) => {
  const { uxCoreData, uxcgLocalizedData } = useContext(GlobalContext);
  const [strapiQuestions, setStrapiQuestions] = useState<QuestionType[]>([]);
  const [activeBiasNumber, setActiveBiasNumber] = useState<number>(null);
  const [biases, setBiases] = useState<StrapiBiasType[]>([]);
  const [isModalClosed, setIsModalClosed] = useState<boolean>(true);
  const [{ toggleIsProductView }, { isProductView }] = useUXCoreGlobals();
  const router = useRouter();
  const { isMobile } = useMobile()[1];
  const { locale } = router as TRouter;

  const slugs = {
    slugEn: `/uxcore/${currentModalData?.slugEn}`,
    slugRu: `/uxcore/${currentModalData?.slugRu}`,
  };

  const mentionedQuestions = strapiQuestions.filter(({ attributes }) =>
    JSON.parse(currentModalData.mentionedQuestionsIds).includes(
      attributes?.number,
    ),
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
                url: currentModalData[`OGTags${lang}`]?.OGTags?.ogImage?.data
                  ?.attributes?.url,
                staticUrl: '/assets/ogImages/UXCore.png',
              },
            },
          },
        },
      };
    }
  }, [currentActiveBias.number, locale]);

  useEffect(() => {
    setActiveBiasNumber(Number(currentActiveBias.number));
    if (!isModalClosed) {
      setActiveBiasNumber(null);
    }
  }, []);

  useEffect(() => {
    const newHash = isProductView ? '' : 'hr';
    const currentPath = router.asPath.split('#')[0];
    const newUrl = `${currentPath}${newHash ? '#' + newHash : ''}`;
    if (router.asPath !== newUrl) {
      router.push(newUrl, undefined, { shallow: false });
    }
  }, [isProductView, router.asPath]);

  const openPage = () => {
    router.push(`/uxcore`, undefined, { scroll: true });
  };

  useEffect(() => {
    router.prefetch('/uxcore');
  }, []);

  useEffect(() => {
    if (uxCoreData) {
      setBiases(uxCoreData);
    } else {
      setBiases([]);
    }
  }, [uxCoreData]);

  useEffect(() => {
    if (uxcgLocalizedData) {
      setStrapiQuestions(uxcgLocalizedData[locale]);
    } else {
      setStrapiQuestions([]);
    }
  }, [locale, uxcgLocalizedData]);

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
      {isMobile ? (
        <UXCoreModalMobile
          toggleIsCoreView={toggleIsProductView}
          isProductView={!isProductView}
          biasNumber={activeBiasNumber}
          isSecondView={!isProductView}
          secondViewLabel={'hr'}
          defaultViewLabel="product"
          questions={mentionedQuestions}
          uxCoreData={biases[locale]}
          tags={tags}
          onClose={openPage}
          onChangeBiasId={openSelectedBias}
          nextBiasName={next}
          prevBiasName={prev}
          slugs={languageSwitchSlugs}
        />
      ) : (
        <UXCoreModal
          headingTitle={currentActiveBias.title}
          toggleIsProductView={toggleIsProductView}
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
      )}
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
  const newPaths = await getUXCoreTextPaths(locales);
  return { paths: [...newPaths], fallback: 'blocking' };
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

  const strapiBiases = await getStrapiBiases();
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
    },
    revalidate: 5,
  };
};
