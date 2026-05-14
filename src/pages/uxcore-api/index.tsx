import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FC, Fragment, useMemo } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import { getUXCoreApiSeo } from '@uxcore/api/mainPageSeo';

import SeoGenerator from '@uxcore/components/SeoGenerator';

import ApiLayout from '@uxcore/layouts/ApiLayout';

interface ApiProps {
  mainSeo: { en: any; ru: any };
}

const API: FC<ApiProps> = ({ mainSeo }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const seoData = useMemo(
    () => mainSeo[currentLocale],
    [mainSeo, currentLocale],
  );

  return (
    <Fragment>
      <SeoGenerator
        strapiSEO={seoData}
        ogTags={seoData?.OGTags}
        createdDate={'2023-05-15'}
        modifiedDate={'2023-05-15'}
      />
      <ApiLayout />
    </Fragment>
  );
};
export const getStaticProps: GetStaticProps = async () => {
  const mainSeo = await getUXCoreApiSeo();
  return { props: { mainSeo } };
};

export default API;
