import DietLayout from '@layouts/DietLayout';
import { GetServerSideProps } from 'next';
import { getDiet } from '@api/longevity/diet';
import { useRouter } from 'next/router';

const Diet = ({ dietData }) => {
  const router = useRouter();
  const { locale } = router;
  return <DietLayout locale={locale} data={dietData[locale]} />;
};
export default Diet;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const dietData = await getDiet(locale);

  return {
    props: { dietData },
  };
};
