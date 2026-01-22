import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getEnvironment } from '@api/longevity/environment';
import EnvironmentLayout from '@layouts/EnvironmentLayout/EnvironmentLayout';

const Environment = ({ environment }) => {
  const router = useRouter();
  const { locale } = router;
  return <EnvironmentLayout data={environment[locale]} locale={locale} />;
};

export default Environment;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const environment = await getEnvironment(locale);

  return {
    props: { environment },
  };
};
