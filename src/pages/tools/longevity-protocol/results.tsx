import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import ResultsLayout from '@layouts/ResultsLayout';

import { getLongevityResults } from '@api/longevity/results';

const Results = ({ yearlyResults }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  return (
    <ResultsLayout
      data={yearlyResults ? yearlyResults[currentLocale] : null}
      locale={locale}
    />
  );
};

export default Results;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const yearlyResults = await getLongevityResults(locale);

  return {
    props: { yearlyResults },
  };
};
