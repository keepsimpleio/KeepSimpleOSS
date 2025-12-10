import React, { useEffect, useRef } from 'react';
import { GetStaticProps } from 'next';

import { TStaticProps } from '@local-types/data';
import {
  getCompanyManagementData,
  getPyramids,
  getPyramidStats,
} from '@api/strapi';

import SeoGenerator from '@components/SeoGenerator';
import Spinner from '@components/Spinner';

import useGlobals from '@hooks/useGlobals';

import CompanyManagementLayout from '@layouts/CompanyManagementLayout';

import styles from '../styles/company-management.module.scss';

const CompanyManagementPage = ({
  pyramids,
  companyManagementData,
  pyramidStatistics,
}) => {
  const contributors = companyManagementData?.data.attributes.contributors;
  const description = companyManagementData?.data.attributes.seoDescription;
  const title = companyManagementData?.data.attributes.pageTitle;
  const keywords = companyManagementData?.data.attributes.keywords;
  const pageTitle = companyManagementData?.data.attributes.pageTitle;
  const articleRef = useRef<HTMLElement>(null);
  const [{ initUseGlobals, unmountUseGlobals }] = useGlobals();

  useEffect(() => {
    initUseGlobals(articleRef.current);

    return () => {
      unmountUseGlobals();
    };
  }, []);

  return (
    <section ref={articleRef} className={styles.managementBackground}>
      <SeoGenerator
        strapiSEO={{ description, title, keywords, pageTitle }}
        ogTags={companyManagementData?.data.attributes?.OGTags}
        createdDate={companyManagementData?.data.attributes?.createdAt}
        modifiedDate={companyManagementData?.data.attributes?.updatedAt}
      />
      <CompanyManagementLayout
        pyramids={pyramids.data}
        contributors={contributors}
        pyramidStatistics={pyramidStatistics}
      />
      <Spinner />
    </section>
  );
};

export default CompanyManagementPage;

export const getStaticProps: GetStaticProps = async ({
  locale,
}: TStaticProps) => {
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const pyramids = await getPyramids(currentLocale);
  const companyManagementData = await getCompanyManagementData(currentLocale);
  const pyramidStatistics = await getPyramidStats(currentLocale);

  return {
    props: {
      locale,
      pyramids,
      companyManagementData,
      pyramidStatistics,
    },
    revalidate: 5,
  };
};
