import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import StudyLayout from '@layouts/StudyLayout';

import { getStudy } from '@api/longevity/study';

const Study = ({ studyData }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  return (
    <StudyLayout
      data={studyData ? studyData[currentLocale] : null}
      locale={locale}
    />
  );
};
export default Study;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const studyData = await getStudy(locale);

  return {
    props: { studyData },
    revalidate: 5,
  };
};
