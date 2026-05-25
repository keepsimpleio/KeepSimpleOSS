import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';

import { TRouter } from '@uxcore/local-types/global';
import {
  AchievementsTypes,
  UserTypes,
  UXCatDataTypes,
  uxCatLevels,
} from '@uxcore/local-types/uxcat-types/types';

import {
  enhanceAchievementsWithGroups,
  findAchievementListByType,
  findLevelDetail,
  getNotifiedAchievements,
  isLevelMilestone,
} from '@uxcore/lib/uxcat-helpers';

import { UXCatConfigs } from '@uxcore/api/uxcat/configs';
import { getAchievement } from '@uxcore/api/uxcat/get-achievement';
import { getAllAchievements } from '@uxcore/api/uxcat/get-all-achievements';
import { getLevels } from '@uxcore/api/uxcat/get-levels';
import { getNotifications } from '@uxcore/api/uxcat/get-notifications';
import { getUserInfo } from '@uxcore/api/uxcat/users-me';
import { getUXCatData } from '@uxcore/api/uxcat/uxcat';

import SeoGenerator from '@uxcore/components/SeoGenerator';

import UXCatLayout from '@uxcore/layouts/UXCatLayout';

type UxcatProps = {
  uxCatLevels: uxCatLevels[];
  allAchievements: AchievementsTypes[];
  seriouslyAchievement: any;
  uxcatData: UXCatDataTypes;
  killSwitcher: boolean;
};

const Uxcat: FC<UxcatProps> = ({
  uxCatLevels,
  seriouslyAchievement,
  allAchievements,
  uxcatData,
  killSwitcher,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const [levelsDetails, setLevelsDetails] = useState(null);
  const [uxcatUserInfo, setUxcatUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notificationsData, setNotificationsData] = useState();
  const [notifiedAchievements, setNotifiedAchievements] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const uxcatStrapiData = uxcatData[currentLocale]?.data?.attributes;
  const nextTestTime =
    (uxcatUserInfo && uxcatUserInfo?.user?.nextTestTime) || null;
  const userData: UserTypes['user'] = uxcatUserInfo?.user || null;
  const userLevels = uxcatUserInfo?.levels || null;

  const userAchievements = uxcatUserInfo?.achieves;
  const ongoingTest = !!uxcatUserInfo?.ongoingTest;
  const isFinalTestInProgress = uxcatUserInfo?.ongoingTest?.isFinal;
  const allLevels = levelsDetails?.data;
  const level = !!uxcatUserInfo && uxcatUserInfo?.user?.level;
  const milestoneLevel = level?.toString().includes('M')
    ? level?.toString().replace('M', '1')
    : level;
  const matchingLevelDetails = findLevelDetail(
    Number(level && milestoneLevel),
    allLevels,
  );
  const guestLevel = findLevelDetail(0, allLevels);
  const rules = uxcatStrapiData?.rules;
  const pageDescription = uxcatStrapiData?.pageDescription;

  const chosenCoverImage =
    !!uxcatUserInfo && uxcatUserInfo?.user?.coverImageUrl;
  const defaultCoverImage =
    matchingLevelDetails?.attributes.bgImage.data.attributes.url;
  const coverImage = chosenCoverImage ? chosenCoverImage : defaultCoverImage;
  const userBadge = matchingLevelDetails?.attributes?.badge.data.attributes.url;

  const enlightenedTitle = locale === 'ru' ? 'Просветленный' : 'Enlightened';
  const levelTitle = isLevelMilestone(level, 11)
    ? enlightenedTitle
    : matchingLevelDetails?.attributes.lavelName;

  const generalAchievements = findAchievementListByType(
    achievements,
    'UX Core',
  );

  const achievementsList = enhanceAchievementsWithGroups(
    generalAchievements,
    userAchievements,
  );

  useEffect(() => {
    const achievements =
      locale === 'ru'
        ? allAchievements.slice(40, 80)
        : allAchievements.slice(0, 40);

    const excludeUXCoreAchievements = achievements.filter(
      achievement =>
        achievement?.unlockedAt || !achievement.slug.includes('UX_CORE'),
    );
    setAchievements(excludeUXCoreAchievements);
  }, [locale]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await getLevels(currentLocale);
        setLevelsDetails(data);
      } catch (err) {
        setLevelsDetails(err.message);
      }
    };

    fetchLevels().then(r => r);
  }, [locale]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (achievements) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [achievements]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(accessToken);
        setNotificationsData(data);
      } catch (err) {
        setNotificationsData(err.message);
      }
    };
    if (accessToken) {
      fetchNotifications().then(r => r);
    }
  }, [accessToken]);

  useEffect(() => {
    const matchingAchievements = getNotifiedAchievements(
      achievements,
      notificationsData,
    );
    setNotifiedAchievements(matchingAchievements);
  }, [achievements, accessToken, notificationsData]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUxcatUserInfo(data);
      } catch (err) {
        setUxcatUserInfo(err.message);
      }
    };

    if (accessToken) {
      fetchUserInfo().then(r => r);
    }
  }, [accessToken]);

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: uxcatStrapiData?.seoDescription || '',
          title: uxcatStrapiData?.seoTitle || 'UXCat ',
          keywords: uxcatStrapiData?.keywords || '',
          pageTitle: uxcatStrapiData?.seoTitle || 'UXCat ',
        }}
        modifiedDate={uxcatStrapiData?.updatedAt}
        createdDate={'2025-10-28'}
        ogTags={uxcatStrapiData?.OGTags}
        questionsSeo={[]}
      />
      <UXCatLayout
        rules={rules}
        isTestUser={uxcatUserInfo?.user?.isTestUser}
        userInfo={!!uxcatUserInfo && userData}
        userDetails={uxcatUserInfo}
        ongoingTest={ongoingTest}
        nextTestTime={nextTestTime}
        coverImage={coverImage}
        levelTitle={levelTitle}
        userBadge={userBadge}
        levelsDetails={levelsDetails}
        achievements={achievementsList}
        accessToken={accessToken}
        userAchievements={userAchievements}
        loading={loading}
        isFinalTestInProgress={isFinalTestInProgress}
        guestLevel={guestLevel}
        userLevels={userLevels}
        level={level}
        uxCatLevels={uxCatLevels}
        seriouslyAchievement={seriouslyAchievement}
        notifiedAchievements={notifiedAchievements}
        disableStartTest={killSwitcher}
        pageDescription={pageDescription}
        matchingLevelDetails={matchingLevelDetails}
      />
    </>
  );
};

export default Uxcat;

export const getServerSideProps: GetServerSideProps = async context => {
  const achievementsEn = await getAllAchievements('en', 40);
  const achievementsRu = await getAllAchievements('ru', 40);
  const seriouslyAchievement = await getAchievement('SERIOUSLY', 'en');
  const allAchievements = [...achievementsEn.data, ...achievementsRu.data];
  const configs = await UXCatConfigs();
  const uxCatLevels = configs.pointsPerLevel;
  const killSwitcher = configs.TestKillSwitcher;
  const uxcatData = await getUXCatData();

  return {
    props: {
      uxCatLevels,
      seriouslyAchievement,
      allAchievements,
      uxcatData,
      killSwitcher,
    },
  };
};
