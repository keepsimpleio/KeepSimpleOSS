import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { FC, useContext, useEffect, useState } from 'react';

import { TRouter } from '@uxcore/local-types/global';
import { UXCatDataTypes } from '@uxcore/local-types/uxcat-types/types';

import { UXCatConfigs } from '@uxcore/api/uxcat/configs';
import { getUXCatStatistics } from '@uxcore/api/uxcat/statistics';
import { getUXCatData } from '@uxcore/api/uxcat/uxcat';

import startTestData from '@data/startTest';

import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import GenderModal from '@uxcore/components/GenderModal';
import SeoGenerator from '@uxcore/components/SeoGenerator';
import Spinner from '@uxcore/components/Spinner';

import StartTestLayout from '@uxcore/layouts/StartTestLayout';

type StartTestProps = {
  uxcatData: UXCatDataTypes;
  uxcatConfigs: any;
};

const StartTest: FC<StartTestProps> = ({ uxcatData, uxcatConfigs }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const { accountData } = useContext(GlobalContext);

  const { description1, description2, goodLuckTxt, btnTxt } =
    startTestData[currentLocale];
  const testDuration = '20:00';

  const [isPageAccessed, setIsPageAccessed] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [statistics, setStatistics] = useState(null);
  const [openGenderModal, setOpenGenderModal] = useState(false);

  const forthTest = statistics?.totalTestCount >= 4;
  const askedGenderCount = accountData?.askGenderCount === 1;
  const uxcatStrapiData = uxcatData[currentLocale]?.data?.attributes;

  const handleStartTest = () => {
    router.push('/uxcat/ongoing');
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!accessToken) return;
      try {
        const result = await getUXCatStatistics(accessToken);
        setStatistics(result);
      } catch (e) {
        console.log(e);
      }
    };
    fetchStatistics().then(r => console.log(r));
  }, [accessToken]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsPageAccessed(true);
      router.push('/uxcat');
    }
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (accountData && forthTest) {
      !accountData?.gender &&
        setOpenGenderModal(accountData?.askGenderCount < 2);
    }
  }, [accountData, forthTest]);

  return (
    <>
      <>
        {isPageAccessed ? (
          <Spinner />
        ) : (
          <>
            <SeoGenerator
              strapiSEO={{
                description: uxcatStrapiData?.seoDescription || '',
                title: uxcatStrapiData?.startTestPageTitle || '',
                keywords: uxcatStrapiData?.keywords || '',
                pageTitle: uxcatStrapiData?.startTestPageTitle || '',
              }}
              ogTags={uxcatStrapiData?.OGTags}
              modifiedDate={uxcatStrapiData?.updatedAt}
              createdDate={'2025-10-28'}
            />
            <StartTestLayout
              testDuration={testDuration}
              handleStartTest={handleStartTest}
              description1={description1}
              description2={description2}
              goodLuckTxt={goodLuckTxt}
              btnTxt={btnTxt}
              disabled={uxcatConfigs.TestKillSwitcher}
            />
          </>
        )}
      </>
      {openGenderModal && (
        <GenderModal
          token={accessToken}
          onClose={() => setOpenGenderModal(false)}
          askedGenderCount={askedGenderCount}
        />
      )}
    </>
  );
};

export default StartTest;

export const getServerSideProps: GetServerSideProps = async context => {
  const uxcatData = await getUXCatData();
  const uxcatConfigs = await UXCatConfigs();

  return {
    props: {
      uxcatData,
      uxcatConfigs,
    },
  };
};
