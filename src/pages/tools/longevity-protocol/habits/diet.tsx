import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';

import DietLayout from '@layouts/DietLayout';

import { getDiet } from '@api/longevity/diet';

const Diet = ({ dietData }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  return (
    <DietLayout
      locale={locale}
      data={dietData ? dietData[currentLocale] : null}
    />
  );
};
export default Diet;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const dietData = await getDiet(locale);

  return {
    props: { dietData },
    revalidate: 5,
  };
};
