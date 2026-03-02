import { GetStaticProps } from 'next';

import SupplementsLayout from '@layouts/Supplements';

import { getSupplements } from '@api/longevity/supplements';
import SeoGenerator from '@components/SeoGenerator';
import { ogImage } from '@constants/longevity';
import { useRouter } from 'next/router';
import type { TRouter } from '@local-types/global';

const Supplements = ({ supplements }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
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
        ogTags={OGTags}
        createdDate={supplements[currentLocale]?.createdAt || ''}
        modifiedDate={supplements[currentLocale]?.updatedAt || ''}
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
    revalidate: 5,
  };
};
