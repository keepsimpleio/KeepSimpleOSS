import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';

import DietLayout from '@layouts/DietLayout';

import { getDiet } from '@api/longevity/diet';

const Diet = ({ dietData }) => {
  const router = useRouter();
  const { locale } = router;
  return <DietLayout locale={locale} data={dietData[locale]} />;
};
export default Diet;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const dietData = await getDiet(locale);

  return {
    props: { dietData },
    revalidate: 5,
  };
};
