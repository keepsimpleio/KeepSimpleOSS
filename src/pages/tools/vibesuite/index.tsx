import { GetStaticProps } from 'next';
import { FC, useEffect } from 'react';

import { TStaticProps } from '@local-types/data';

import useGlobals from '@hooks/useGlobals';

import { getVibesuite } from '@api/vibesuite';

import SeoGenerator from '@components/SeoGenerator';
import MapClient from '@components/vibesuite/MapClient';

export type VibeSuitePageProps = {
  vibesuite?: any | null;
};

const VibeSuitePage: FC<VibeSuitePageProps> = ({ vibesuite }) => {
  const [{ initUseGlobals, unmountUseGlobals }, { isDarkTheme }] = useGlobals();

  useEffect(() => {
    initUseGlobals(null);

    return () => {
      unmountUseGlobals();
    };
  }, []);

  const seoContent = vibesuite?.pageSeo;
  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: seoContent?.seoDescription,
          title: seoContent?.pageTitle,
          keywords: seoContent?.keywords,
          seoTitle: seoContent?.seoTitle,
        }}
        type={'WebPage'}
        ogTags={vibesuite?.OGTags}
        createdDate={vibesuite?.publishedAt}
        modifiedDate={vibesuite?.updatedAt}
      />
      <MapClient initialProgress={{}} isDarkTheme={isDarkTheme} />
    </>
  );
};

export default VibeSuitePage;

export const getStaticProps: GetStaticProps = async ({
  locale,
}: TStaticProps) => {
  const vibesuite = await getVibesuite(locale);
  return {
    props: {
      locale,
      vibesuite,
    },
    revalidate: 10,
  };
};
