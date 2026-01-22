import { getStudy } from '@api/longevity/study';
import { GetServerSideProps } from 'next';
import StudyLayout from '@layouts/StudyLayout';
import { useRouter } from 'next/router';

const Study = ({ studyData }) => {
  const router = useRouter();
  const { locale } = router;
  return <StudyLayout data={studyData[locale]} locale={locale} />;
};
export default Study;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const studyData = await getStudy(locale);

  return {
    props: { studyData },
  };
};
