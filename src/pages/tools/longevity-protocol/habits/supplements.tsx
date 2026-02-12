import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import SupplementsLayout from '@layouts/Supplements';

import { getSupplements } from '@api/longevity/supplements';
import SeoGenerator from '@components/SeoGenerator';

const Supplements = ({ supplements }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const OGTags = {
    ogDescription: supplements[currentLocale]?.ogDescription || '',
    ogTitle: supplements[currentLocale]?.ogTitle || '',
    ogType: supplements[currentLocale]?.ogType || '',
    ogImageAlt: supplements[currentLocale]?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: supplements[currentLocale]?.ogImage?.data?.attributes?.url || '',
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
        ogTags={OGTags}
        createdDate={supplements[currentLocale]?.createdAt || ''}
        modifiedDate={supplements[currentLocale]?.updatedAt || ''}
      />
      <SupplementsLayout
        data={!!supplements ? supplements[currentLocale] : null}
        locale={locale}
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
