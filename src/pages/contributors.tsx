import { FC, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import type { TRouter } from '@local-types/global';
import type { ContributorLocaleData } from '@local-types/pageTypes/contributors';

import useGlobals from '@hooks/useGlobals';

import { getContributors } from '@api/contributors';

import ContributorsLayout from '@layouts/ContributorsLayout';

import SeoGenerator from '@components/SeoGenerator';

const Contributors: FC<ContributorLocaleData> = ({ contributors }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const data = contributors[currentLocale];
  const [{}, { isDarkTheme }] = useGlobals();
  const darkThemeRef = useRef<HTMLElement>(null);
  const [{ initUseGlobals, unmountUseGlobals }] = useGlobals();

  const {
    seoDescription: description,
    pageTitle: title,
    seoTitle: pageTitle,
    keywords,
  } = data?.Seo || {};

  useEffect(() => {
    initUseGlobals(darkThemeRef.current);

    return () => {
      unmountUseGlobals();
    };
  }, []);

  return (
    <>
      <SeoGenerator
        strapiSEO={{ description, title, keywords, pageTitle }}
        ogTags={data?.OGTags}
        createdDate={data.createdAt}
        modifiedDate={data.updatedAt}
      />
      <ContributorsLayout
        ref={darkThemeRef}
        contributorsData={data}
        isDarkTheme={isDarkTheme}
      />
    </>
  );
};

export default Contributors;

export async function getServerSideProps({ locale }) {
  const contributors = await getContributors(locale);
  return {
    props: {
      contributors,
    },
  };
}
