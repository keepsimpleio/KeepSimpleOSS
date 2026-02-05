import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import HabitsLayout from '@layouts/HabitsLayout/HabitsLayout';

import { getHabitsProtocol } from '@api/longevity/habits-protocol';

const Index = ({ habitsData }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  return (
    <HabitsLayout
      data={habitsData ? habitsData[currentLocale] : null}
      locale={locale}
    />
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const habitsData = await getHabitsProtocol(locale);

  return {
    props: { habitsData },
    revalidate: 5,
  };
};
