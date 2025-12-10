import React, { FC } from 'react';
import { GetStaticProps } from 'next';

import { TStaticProps } from '@local-types/data';

import { getHomeData } from '@api/strapi';

import LandingLayout from '@layouts/LandingLayout';

import useGlobals from '@hooks/useGlobals';
import { LandingLayoutTypes } from '@layouts/LandingLayout/LandingLayout.types';

type PageProps = {
  landingData?: LandingLayoutTypes;
};

const Index: FC<PageProps> = ({ landingData }) => {
  const [{}, { isDarkTheme }] = useGlobals();
  return (
    <LandingLayout
      homeData={landingData && landingData}
      darkTheme={isDarkTheme}
    />
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async ({
  locale,
}: TStaticProps) => {
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const landingData = await getHomeData(currentLocale);

  return {
    props: {
      locale,
      landingData,
    },
    revalidate: 5,
  };
};
