import { getSupplementsImageUrls } from '@utils/getLongevityImageUrls';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ogImage } from '@constants/longevity';

import type { TRouter } from '@local-types/global';

import usePreloadImages from '@hooks/usePreloadImages';

import { getSupplements } from '@api/longevity/supplements';

import SeoGenerator from '@components/SeoGenerator';

import SupplementsLayout from '@layouts/Supplements';

const Supplements = ({ supplements }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const data = supplements?.[currentLocale];
  const imageUrls = getSupplementsImageUrls(data);
  usePreloadImages(imageUrls);
  const OGTags = {
    ogDescription: supplements[currentLocale]?.ogDescription || '',
    ogTitle: supplements[currentLocale]?.ogTitle || '',
    ogType: supplements[currentLocale]?.ogType || '',
    ogImageAlt: supplements[currentLocale]?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: ogImage,
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: supplements[currentLocale]?.Seo?.seoDescription || '',
          keywords: supplements[currentLocale]?.Seo?.keywords || '',
          title: supplements[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: supplements[currentLocale]?.Seo?.seoTitle || '',
        }}
        isLongevityPage
        type={'MedicalWebPage'}
        ogTags={OGTags}
        createdDate={supplements[currentLocale]?.createdAt || ''}
        modifiedDate={supplements[currentLocale]?.updatedAt || ''}
        preloadImages={imageUrls}
      />
      <SupplementsLayout
        data={!!supplements ? supplements[currentLocale] : null}
        locale={currentLocale}
      />
    </>
  );
};
export default Supplements;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const supplements = await getSupplements(locale);

  return {
    props: { supplements },
    revalidate: 10,
  };
};
