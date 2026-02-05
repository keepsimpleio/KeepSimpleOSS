import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { getWhatIsThis } from '@api/longevity/what-is-this';

import WhatIsThisLayout from '@layouts/LongevityLayouts';

const WhatIsThis = ({ aboutTheProject }) => {
  const router = useRouter();
  const { locale } = router;
  return (
    <WhatIsThisLayout data={aboutTheProject[locale || 'en']} locale={locale} />
  );
};

export default WhatIsThis;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const aboutTheProject = await getWhatIsThis(locale);

  return {
    props: { aboutTheProject },
  };
};
