import { GetStaticProps } from 'next';

import SupplementsLayout from '@layouts/Supplements';

import { getSupplements } from '@api/longevity/supplements';
import SeoGenerator from '@components/SeoGenerator';

const Supplements = ({ supplements }) => {
  const OGTags = {
    ogDescription: supplements['en']?.ogDescription || '',
    ogTitle: supplements['en']?.ogTitle || '',
    ogType: supplements['en']?.ogType || '',
    ogImageAlt: supplements['en']?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: supplements['en']?.ogImage?.data?.attributes?.url || '',
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: supplements['en']?.Seo?.seoDescription || '',
          keywords: supplements['en']?.Seo?.keywords || '',
          title: supplements['en']?.Seo?.pageTitle || '',
          seoTitle: supplements['en']?.Seo?.seoTitle || '',
        }}
        ogTags={OGTags}
        createdDate={supplements['en']?.createdAt || ''}
        modifiedDate={supplements['en']?.updatedAt || ''}
      />
      <SupplementsLayout
        data={!!supplements ? supplements['en'] : null}
        locale={'en'}
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
