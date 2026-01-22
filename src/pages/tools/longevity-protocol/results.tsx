import { GetServerSideProps } from 'next';
import { getLongevityResults } from '@api/longevity/results';
import ResultsLayout from '@layouts/ResultsLayout';
import { useRouter } from 'next/router';

const Results = ({ yearlyResults }) => {
  const router = useRouter();
  const { locale } = router;
  return <ResultsLayout data={yearlyResults[locale]} locale={locale} />;
};

export default Results;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const yearlyResults = await getLongevityResults(locale);

  return {
    props: { yearlyResults },
  };
};
