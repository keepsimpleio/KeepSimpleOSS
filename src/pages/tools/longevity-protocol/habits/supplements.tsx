import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import SupplementsLayout from '@layouts/Supplements';

import { getSupplements } from '@api/longevity/supplements';

const Supplements = ({ supplements }) => {
  const router = useRouter();
  const { locale } = router;
  return <SupplementsLayout data={supplements[locale]} locale={locale} />;
};
export default Supplements;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const supplements = await getSupplements(locale);

  return {
    props: { supplements },
    revalidate: 5,
  };
};
