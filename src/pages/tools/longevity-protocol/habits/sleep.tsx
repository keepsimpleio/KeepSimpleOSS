import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';

import { getSleep } from '@api/longevity/sleep';
import { getSleepSupplements } from '@api/longevity/sleep-supplements';

import SleepLayout from '@layouts/SleepLayout/SleepLayout';

const Sleep = ({ sleepData, sleepSupplements }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  return (
    <SleepLayout
      locale={locale}
      data={sleepData ? sleepData[currentLocale] : null}
      supplements={sleepSupplements?.supplements}
    />
  );
};
export default Sleep;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const sleepData = await getSleep(locale);
  const sleepSupplements = await getSleepSupplements(locale || 'en');

  return {
    props: { sleepData, locale: locale ?? 'en', sleepSupplements },
    revalidate: 5,
  };
};
