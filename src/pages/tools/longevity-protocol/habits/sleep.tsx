import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSleep } from '@api/longevity/sleep';
import SleepLayout from '@layouts/SleepLayout/SleepLayout';

const Sleep = ({ sleepData }) => {
  const router = useRouter();
  const { locale } = router;
  return <SleepLayout locale={locale} data={sleepData[locale]} />;
};
export default Sleep;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const sleepData = await getSleep(locale);

  return {
    props: { sleepData },
  };
};
