import { GetServerSideProps } from 'next';
import { getHabitsProtocol } from '@api/longevity/habits-protocol';
import HabitsLayout from '@layouts/HabitsLayout/HabitsLayout';
import { useRouter } from 'next/router';

const Index = ({ habitsData }) => {
  const router = useRouter();
  const { locale } = router;
  return <HabitsLayout data={habitsData[locale]} locale={locale} />;
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const habitsData = await getHabitsProtocol(locale);

  return {
    props: { habitsData },
  };
};
