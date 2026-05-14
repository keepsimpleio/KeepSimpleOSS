import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';

import { TRouter } from '@uxcore/local-types/global';
import { UXCatDataTypes } from '@uxcore/local-types/uxcat-types/types';

import { UXCatConfigs } from '@uxcore/api/uxcat/configs';
import { getFinalTest } from '@uxcore/api/uxcat/final-test';
import { getUXCatStartTest } from '@uxcore/api/uxcat/start-test';
import { getUserInfo } from '@uxcore/api/uxcat/users-me';
import { getUXCatData } from '@uxcore/api/uxcat/uxcat';

import { achievementSlugs } from '@data/uxcat/ongoingTest/realTimeAchievements';

import SeoGenerator from '@uxcore/components/SeoGenerator';
import Spinner from '@uxcore/components/Spinner';

import styles from '@uxcore/layouts/OngoingLayout/OngoingLayout.module.scss';

import OngoingLayout from 'src/uxcore/layouts/OngoingLayout';

type OngoingProps = {
  configs: {
    testExpirationTime: number;
  };
  uxcatData: UXCatDataTypes;
};

const Ongoing: FC<OngoingProps> = ({ configs, uxcatData }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const [userInfo, setUserInfo] = useState(null);
  const [test, setTest] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isFinalTest, setIsFinalTest] = useState(false);
  const [testLength, setTestLength] = useState(0);

  const testDuration = configs?.testExpirationTime;

  const finalTestPermission = userInfo?.user.finalTestPermission;
  const userAchievements = userInfo?.achieves;
  const uxcatStrapiData = uxcatData[currentLocale]?.data?.attributes;

  function calculateRemainingTime(startedAt, duration) {
    const MINUTES_PER_HOUR = 60;
    const MILLISECONDS_PER_MINUTE = 60 * 1000;
    const MILLISECONDS_PER_SECOND = 1000;

    const durationMs = duration * MILLISECONDS_PER_MINUTE;
    const startedAtMs = new Date(startedAt).getTime();
    const currentTimeMs = new Date().getTime();
    const remainingTimeMs = startedAtMs + durationMs - currentTimeMs;

    if (remainingTimeMs <= 0) {
      return null;
    }

    const hours = Math.floor(
      remainingTimeMs / (MILLISECONDS_PER_MINUTE * MINUTES_PER_HOUR),
    );
    const minutes = Math.floor(
      (remainingTimeMs % (MILLISECONDS_PER_MINUTE * MINUTES_PER_HOUR)) /
        MILLISECONDS_PER_MINUTE,
    );
    const seconds = Math.floor(
      (remainingTimeMs % MILLISECONDS_PER_MINUTE) / MILLISECONDS_PER_SECOND,
    );

    return { hours, minutes, seconds };
  }

  const remainingTime = calculateRemainingTime(
    test?.testStartedAt,
    testDuration,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        try {
          const userInfo = await getUserInfo();
          setUserInfo(userInfo);
          const ongoingTest = userInfo?.ongoingTest;
          if (isFinalTest) {
            const testResult = !ongoingTest
              ? await getFinalTest(accessToken)
              : ongoingTest;
            setTest(testResult);
            setTestLength(30);
          }
          if (!isFinalTest) {
            const testResult = !ongoingTest
              ? await getUXCatStartTest(accessToken)
              : ongoingTest;
            setTest(testResult);
            // Might be dynamically changed if we change the quantity of the test questions
            setTestLength(10);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };
    fetchUserData().then(r => r);
  }, [accessToken]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      setPageLoading(true);
      router.push('/uxcat');
    }
    if (test?.statusCode === 400) {
      setPageLoading(true);
      router.push('/uxcat');
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      if (test?.statusCode !== 201) {
        setPageLoading(false);
      }
      if (test?.statusCode === 400) {
        setPageLoading(true);
        router.push('/uxcat');
      }
    }
  }, [test]);

  useEffect(() => {
    const finalTestPermission =
      localStorage.getItem('finalTestPermission') === 'true';
    setIsFinalTest(finalTestPermission);
  }, []);

  return (
    <>
      {pageLoading ? (
        <Spinner />
      ) : (
        <>
          <SeoGenerator
            strapiSEO={{
              description: uxcatStrapiData?.seoDescription,
              title: uxcatStrapiData?.ongoingPageTitle,
              keywords: uxcatStrapiData?.keywords,
              pageTitle: uxcatStrapiData?.ongoingPageTitle,
            }}
            ogTags={uxcatStrapiData?.OGTags}
            modifiedDate={uxcatStrapiData?.updatedAt}
            createdDate={'2025-10-28'}
          />
          <section className={styles.mainWrapper}>
            <OngoingLayout
              accessToken={accessToken}
              startTest={test}
              remainingTime={remainingTime}
              finalTestPermission={finalTestPermission}
              userAchievements={userAchievements}
              achievementSlugs={achievementSlugs}
              testLength={testLength}
            />
          </section>
        </>
      )}
    </>
  );
};

export default Ongoing;

export async function getServerSideProps() {
  const configs = await UXCatConfigs();
  const uxcatData = await getUXCatData();
  if (configs.TestKillSwitcher) {
    return {
      redirect: {
        destination: '/uxcat',
        permanent: false,
      },
    };
  }

  return {
    props: {
      configs,
      uxcatData,
    },
  };
}
