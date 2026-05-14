import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { FC, useContext, useEffect, useState } from 'react';

import { StrapiBiasType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';
import {
  AchievementsTypes,
  TestResultsTypes,
  UserTypes,
  UXCatDataTypes,
  uxCatLevels,
} from '@uxcore/local-types/uxcat-types/types';

import { mergeBiasesLocalization } from '@uxcore/lib/helpers';
import {
  cleanTitle,
  formatDate,
  getNotifiedAchievements,
  getPassedLevels,
} from '@uxcore/lib/uxcat-helpers';

import { UXCatConfigs } from '@uxcore/api/uxcat/configs';
import { getAchievement } from '@uxcore/api/uxcat/get-achievement';
import { getAllAchievements } from '@uxcore/api/uxcat/get-all-achievements';
import { getLevels } from '@uxcore/api/uxcat/get-levels';
import { getNotifications } from '@uxcore/api/uxcat/get-notifications';
import { getUXCatLastTest } from '@uxcore/api/uxcat/last-test';
import { getUserInfo } from '@uxcore/api/uxcat/users-me';
import { getUXCatData } from '@uxcore/api/uxcat/uxcat';

import uxcatData from '@data/uxcat';

import CongratsModal from '@uxcore/components/CongratsModal';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import SeoGenerator from '@uxcore/components/SeoGenerator';
import Spinner from '@uxcore/components/Spinner';

import CalculatingResults from '@uxcore/layouts/CalculatingResults';
import TestResultLayout from '@uxcore/layouts/TestResult';

type TestResultProps = {
  userInfo: UserTypes[];
  lastTest: any;
  uxCatLevels: uxCatLevels[];
  achievements: AchievementsTypes[];
  uxcatStrapiData: UXCatDataTypes;
  killSwitcher: boolean;
};

type matchingIncorrectListType = {
  mentionedQuestionsIds: string;
  titleEn: string;
  titleRu: string;
};

const TestResult: FC<TestResultProps> = ({
  uxCatLevels,
  uxcatStrapiData,
  achievements,
  killSwitcher,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { uxCoreData, uxcgData, accountData } = useContext(GlobalContext);
  const [userInfo, setUserInfo] = useState<UserTypes | null>(null);
  const [randomQuestionsIds, setRandomQuestionsIds] = useState([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [testResult, setTestResults] = useState<TestResultsTypes>(null);
  const [allAchievements, setAllAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState(null);
  const [notificationsData, setNotificationsData] = useState();
  const [analyzingProgress, setAnalyzingProgress] = useState<boolean>(null);
  const [notifiedAchievements, setNotifiedAchievements] = useState([]);
  const [levelsDetails, setLevelsDetails] = useState(null);
  const [nextTest, setNextTest] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [allowedToStart, setAllowedToStart] = useState(false);
  const [achievementLoading, setAchievementLoading] = useState<boolean>(true);
  const [biasList, setBiasList] = useState<StrapiBiasType[]>([]);
  const [openCongratsModal, setOpenCongratsModal] = useState(false);
  const [achievementList, setAchievementsList] = useState([]);

  const {
    minutesTxtShort,
    hoursTxtShort,
    secondsTxtShort,
    nextTestIn,
    startBtn,
  } = uxcatData[locale];

  const nextTestTime = userInfo?.user?.nextTestTime
    ? userInfo?.user?.nextTestTime
    : null;
  const userLevel = userInfo?.user?.level || 0;
  const ongoingTest = !!userInfo?.ongoingTest;
  const finalTestInProgress = !!userInfo?.ongoingTest?.isFinal;

  const newestPoints = testResult?.userPoints;
  const previousPoints = testResult?.userPoints - testResult?.testPoints;
  const passedLevels = getPassedLevels(
    previousPoints,
    newestPoints,
    uxCatLevels,
  );
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  useEffect(() => {
    const achievementsRuEn =
      locale === 'ru' ? achievements.slice(40, 80) : achievements.slice(0, 40);
    setAchievementsList(achievementsRuEn);
  }, []);

  useEffect(() => {
    const updateTimeString = () => {
      const hourByMinutes = 60;
      const nextTestDate = new Date(nextTestTime);
      const currentDate = new Date();
      const differenceInMilliseconds =
        nextTestDate.getTime() - currentDate.getTime();
      if (differenceInMilliseconds < 0 || !nextTestTime) {
        setNextTest(startBtn);
        setAllowedToStart(true);
        return;
      }

      const minutesTotal = Math.floor(
        differenceInMilliseconds / (1000 * hourByMinutes),
      );
      const hours = Math.floor(minutesTotal / hourByMinutes);
      const minutes = minutesTotal % hourByMinutes;
      const seconds = Math.floor(
        (differenceInMilliseconds / 1000) % hourByMinutes,
      );

      let newTimeString = '';
      if (hours > 0) {
        newTimeString += `${nextTestIn} ${hours} ${hoursTxtShort} ${minutes} ${minutesTxtShort}`;
      } else if (minutesTotal > 0) {
        newTimeString = `${nextTestIn} ${minutes} ${minutesTxtShort} ${seconds} ${secondsTxtShort}`;
      } else {
        newTimeString = `${nextTestIn} ${seconds} ${secondsTxtShort}`;
      }

      setNextTest(newTimeString.trim());
      setAllowedToStart(false);
    };

    updateTimeString();

    const interval = setInterval(updateTimeString, 1000);
    return () => clearInterval(interval);
  }, [nextTestTime, locale]);

  useEffect(() => {
    const fetchAllAchievements = async () => {
      const achievements = testResult?.testSummary?.unlockedAchieves;
      try {
        const getReceivedAchievements =
          achievements &&
          (await Promise.all(
            achievements?.map(
              async ach => await getAchievement(ach.name, currentLocale),
            ),
          ));
        setAllAchievements(getReceivedAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setTimeout(() => {
          setAchievementLoading(false);
        }, 1000);
      }
    };

    fetchAllAchievements().then(r => r);
  }, [locale, testResult]);

  useEffect(() => {
    const newAchievements = testResult?.testSummary?.unlockedAchieves;
    const userReceivedAchievements = userInfo?.achieves;

    const filteredAchievements = allAchievements?.map(achievement => {
      !!newAchievements &&
        newAchievements.find(userAch => userAch.name === achievement.slug);
      return { ...achievement };
    });
    const achievemensAndUnlockedDate = filteredAchievements?.map(ach => {
      const unlockedDate = userReceivedAchievements?.find(
        userAch => userAch.name === ach.data.slug,
      )?.unlockedAt;
      const percentage = achievementList?.find(
        userAch => userAch.slug === ach.data.slug,
      )?.percentage;
      return {
        ...ach,
        unlockedAt: formatDate(unlockedDate),
        percentage: percentage,
      };
    });

    const matchingAchievements = getNotifiedAchievements(
      achievementList,
      notificationsData,
    );

    setNotifiedAchievements(matchingAchievements);
    setUnlockedAchievements(achievemensAndUnlockedDate);
  }, [testResult, allAchievements, userInfo]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserInfo();
        setUserInfo(userData);
        const test = await getUXCatLastTest(accessToken);
        setTestResults(test);
      } catch (err) {
        setUserInfo(err.message);
      }
    };

    if (accessToken) {
      fetchUserInfo().then(r => r);
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchLevels = async () => {
      const data = await getLevels(currentLocale);
      setLevelsDetails(data);
    };

    fetchLevels().then(r => r);
  }, [locale]);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      setLoading(true);
      router.push('/uxcat');
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(accessToken);

        setNotificationsData(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    if (accessToken) {
      fetchNotifications().then(r => r);
    }
  }, [accessToken, userInfo]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);
  }, []);

  const testResultLength =
    testResult?.testSummary?.correctQuestions?.length +
    testResult?.testSummary?.incorrectQuestions?.length;

  const findMatchingTitles = (incorrectAnswers, list) => {
    const cleanedAnswers =
      incorrectAnswers &&
      incorrectAnswers.map(answer => ({
        bodyEn: cleanTitle(answer.bodyEn),
        bodyRu: cleanTitle(answer.bodyRu),
      }));
    return list?.filter(item =>
      cleanedAnswers?.some(
        answer =>
          answer.bodyEn === item.titleEn || answer.bodyRu === item.titleRu,
      ),
    );
  };

  const getRandomElement = (arr: number[]): number => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  const extractRandomQuestionsIds = (
    matchingIncorrectList: matchingIncorrectListType[],
  ) => {
    return matchingIncorrectList?.map((item: matchingIncorrectListType) => {
      const parsedIds = JSON.parse(item.mentionedQuestionsIds) as number[];
      return {
        titleEn: item.titleEn,
        titleRu: item.titleRu,
        recommendedReadingId: getRandomElement(parsedIds),
      };
    });
  };

  const matchingIncorrectBiases = findMatchingTitles(
    testResult?.testSummary?.incorrectQuestions,
    biasList,
  );

  const getRecommendedReadingFromUXCG = (id: number) => {
    return uxcgData && uxcgData.find(item => item.number === id);
  };
  const uxcgRecommendedReading = randomQuestionsIds.map(item =>
    getRecommendedReadingFromUXCG(item.recommendedReadingId),
  );

  const mergedIncorrectQuestions =
    testResult?.testSummary?.incorrectQuestions?.map(question => {
      const q = question as Record<string, any>;

      const matchingBias = biasList?.find(bias => bias.number === q.biasNumber);

      return {
        ...q,
        slugEn: matchingBias?.slugEn || '',
        slugRu: matchingBias?.slugRu || '',
      };
    });

  useEffect(() => {
    const randomIds = extractRandomQuestionsIds(matchingIncorrectBiases);
    setRandomQuestionsIds(randomIds);
  }, [biasList, testResult]);

  useEffect(() => {
    const fetchData = async () => {
      if (uxCoreData) {
        try {
          const result = mergeBiasesLocalization(
            uxCoreData?.en || null,
            uxCoreData?.ru || null,
          );
          setBiasList(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData().then(r => r);
  }, [uxCoreData]);

  useEffect(() => {
    const isCongratsSeen = localStorage.getItem('isCongratsSeen');
    if (!isCongratsSeen) {
      if (testResult?.success) {
        const timer = setTimeout(() => {
          setOpenCongratsModal(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [testResult]);

  useEffect(() => {
    const lastQuestionClicked = localStorage.getItem('lastQuestionClicked');
    setAnalyzingProgress(lastQuestionClicked === 'true');
  }, []);

  const closeCongratsModal = () => {
    setOpenCongratsModal(false);
    localStorage.setItem('isCongratsSeen', 'true');
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <SeoGenerator
            strapiSEO={{
              description:
                uxcatStrapiData[currentLocale]?.data?.attributes
                  ?.seoDescription,
              title:
                uxcatStrapiData[currentLocale]?.data?.attributes
                  ?.testResultPageTitle,
              keywords:
                uxcatStrapiData[currentLocale]?.data?.attributes?.keywords,
              pageTitle:
                uxcatStrapiData[currentLocale]?.data?.attributes
                  ?.testResultPageTitle,
            }}
            ogTags={uxcatStrapiData[currentLocale]?.data?.attributes?.OGTags}
            modifiedDate={uxcatStrapiData?.updatedAt}
            createdDate={'2025-10-28'}
          />
          {analyzingProgress ? (
            <CalculatingResults
              setIsAnalyzingInProgress={setAnalyzingProgress}
            />
          ) : (
            <TestResultLayout
              incorrectAnswers={mergedIncorrectQuestions}
              uxcgRecommendedReading={uxcgRecommendedReading}
              nextTestTime={nextTestTime}
              availableDate={nextTest}
              testResult={testResult}
              points={testResult?.userPoints}
              testPoints={testResult?.testPoints}
              levelsDetails={levelsDetails}
              allowedToStart={allowedToStart}
              unlockedAchievements={unlockedAchievements}
              loading={achievementLoading}
              finalTestPassed={testResult?.success}
              finalTestPermission={testResultLength > 10}
              userLevel={userLevel}
              isFinalTestAvailable={userInfo?.user?.finalTestPermission}
              uxCatLevels={uxCatLevels}
              userLevels={userInfo?.levels}
              ongoingTest={ongoingTest}
              notificationsData={notifiedAchievements}
              accessToken={accessToken}
              isRated={accountData?.isRated}
              finalTestInProgress={finalTestInProgress}
              passedLevels={passedLevels}
              killSwitcher={killSwitcher}
            />
          )}

          {openCongratsModal && (
            <CongratsModal
              closeModal={closeCongratsModal}
              username={userInfo?.user?.username}
            />
          )}
        </>
      )}
    </>
  );
};

export default TestResult;

export const getServerSideProps: GetServerSideProps = async context => {
  const uxcatStrapiData = await getUXCatData();
  const configs = await UXCatConfigs();

  const killSwitcher = configs.TestKillSwitcher;
  const uxCatLevels = configs.pointsPerLevel;

  const achievementsEn = await getAllAchievements('en', 40);
  const achievementsRu = await getAllAchievements('ru', 40);
  const achievements = [...achievementsEn.data, ...achievementsRu.data];

  return {
    props: {
      uxCatLevels,
      achievements,
      uxcatStrapiData,
      killSwitcher,
    },
  };
};
