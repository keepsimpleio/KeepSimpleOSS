import { useRouter } from 'next/router';
import React, { FC, useContext, useEffect, useState } from 'react';

import { TRouter } from '@uxcore/local-types/global';
import {
  AchievementsTypes,
  BoardContentTypes,
  userLevels,
  UserTypes,
  uxCatLevels,
} from '@uxcore/local-types/uxcat-types/types';

import {
  enhanceAchievementsWithGroups,
  findAchievementListBySubType,
  findAchievementListByType,
  findLevelDetail,
  formatDate,
  getNotifiedAchievements,
  isLevelMilestone,
  normalizeUserData,
} from '@uxcore/lib/uxcat-helpers';

import { getBackgroundImages, getCoverImages } from '@uxcore/api/strapi';
import { UXCatConfigs } from '@uxcore/api/uxcat/configs';
import { getAllAchievements } from '@uxcore/api/uxcat/get-all-achievements';
import { getLevels } from '@uxcore/api/uxcat/get-levels';
import { getNotifications } from '@uxcore/api/uxcat/get-notifications';
import { getPublicUserInfo } from '@uxcore/api/uxcat/getUser';
import { getUXCatStatistics } from '@uxcore/api/uxcat/statistics';
import { getUserInfo } from '@uxcore/api/uxcat/users-me';

import pageNotFoundData from '@data/404';

import UXCoreIcon from '@icons/UXCoreIcon';

import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import SeoGenerator from '@uxcore/components/SeoGenerator';

import UserProfile from '@uxcore/layouts/UserProfile/UserProfile';

import NotFoundPage from '../../404';

import 'react-toastify/dist/ReactToastify.css';

const achievementBoard: BoardContentTypes[] = [
  {
    id: 1,
    pageName: 'UXCore',
    pageIcon: <UXCoreIcon />,
    headerColor: '#5B88BD',
  },
];
type UserIdProps = {
  uxCatLevels: uxCatLevels[];
  allAchievements: AchievementsTypes[];
  killSwitcher: boolean;
};

const UserId: FC<UserIdProps> = ({
  uxCatLevels,
  allAchievements,
  killSwitcher,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { userId } = router.query;
  const { accountData } = useContext(GlobalContext);
  const [userPublicInfo, setPublicUserInfo] = useState<UserTypes>(null);
  const [userLevels, setUserLevels] = useState<userLevels>(null);
  const [userInfo, setUserInfo] = useState<UserTypes>(null);
  const [headerUserInfo, setHeaderUserInfo] = useState<UserTypes>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [levelsDetails, setLevelsDetails] = useState(null);
  const [userPrivateInfo, setUserPrivateInfo] = useState(userPublicInfo);
  const [nextTestTime, setNextTestTime] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [coverImages, setCoverImages] = useState(null);
  const [backgroundImages, setBackgroundImages] = useState(null);
  const [userAchievements, setUserAchievements] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [notifiedAchievements, setNotifiedAchievements] = useState([]);
  const [generalAchievements, setGeneralAchievements] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);
  const [achievementsByType, setAchievementsByType] = useState({
    uxcoreAchievements: [],
    keepsimpleAchievements: [],
  });
  const [isFinalTestInProgress, setFinalTestInProgress] = useState(false);
  const [specialAchievements, setSpecialAchievements] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [receivedAchievementPercentage, setReceivedAchievementPercentage] =
    useState({
      uxCore: 0,
      keepSimple: 0,
    });

  const pageTitle =
    locale === 'ru'
      ? `Профиль пользователя ${userInfo?.username || 'Пользователь'} на keepsimple`
      : `${userInfo?.username || 'User'} Profile at keepsimple`;

  const isOwner = accountData?.username === userId;

  const level = userInfo?.level;
  const milestoneLevel = level?.toString().includes('M')
    ? level.toString().replace('M', '1')
    : level;

  const allLevels = levelsDetails && levelsDetails?.data;

  const matchingLevelDetails = findLevelDetail(
    Number(level && milestoneLevel),
    allLevels,
  );

  const publicStartTestRef = userInfo?.startTest;
  const ongoingTest = !!userPrivateInfo?.ongoingTest;
  const userFavicon = `${process.env.NEXT_PUBLIC_STRAPI}/uploads/Group_316_2dceac5897.svg`;

  const enlightenedTitle = locale === 'en' ? 'Enlightened' : 'Просветленный';
  const levelName = isLevelMilestone(level, 11)
    ? enlightenedTitle
    : matchingLevelDetails?.attributes.lavelName;

  const ogTags = {
    ogDescription: pageTitle,
    ogTitle: pageTitle,
    ogType: 'website',
    ogImageAlt: 'User Profile',
    ogStaticTitle: 'User Profile',
    ogImage: {
      data: {
        attributes: {
          url: '/uploads/UX_Core_73ad5ad5da.png',
          staticUrl: '/uploads/UX_Core_73ad5ad5da.png',
        },
      },
    },
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (isOwner) {
          const privateInfo = await getUserInfo();
          setUserPrivateInfo(privateInfo);
          setUserInfo(normalizeUserData(privateInfo));
          setUserAchievements(privateInfo?.achieves);
          setFinalTestInProgress(privateInfo?.ongoingTest?.isFinal);
          setUserLevels(privateInfo?.levels);
          setHeaderUserInfo(privateInfo);
          setNextTestTime(privateInfo?.user?.nextTestTime);
        } else {
          const publicUserInfo = await getPublicUserInfo(userId);
          setPublicUserInfo(publicUserInfo);
          setUserInfo(normalizeUserData(publicUserInfo));
          setUserAchievements(publicUserInfo?.achieves);
          setUserLevels(publicUserInfo?.levels);
        }
      } catch (err) {
        setUserInfo(err.message);
        setUserAchievements(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, accountData?.username]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const stats = await getUXCatStatistics(accessToken);
        setStatistics(stats);

        const coverImages = await getCoverImages(accessToken);
        setCoverImages(coverImages);

        const backgroundImages = await getBackgroundImages(accessToken);
        setBackgroundImages(backgroundImages);
      } catch (err) {
        // TODO stat error
      }
    };
    if (accessToken) {
      fetchUserInfo().then(r => r);
    }
  }, [accessToken]);

  useEffect(() => {
    const achievements =
      locale === 'ru'
        ? allAchievements.slice(40, 80)
        : allAchievements.slice(0, 40);

    setAchievementsList(achievements);
  }, [locale]);

  useEffect(() => {
    if (achievementsList) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [achievementsList]);

  useEffect(() => {
    if (achievementsList.length > 0 || userAchievements) {
      const uxcoreAchievements = findAchievementListByType(
        achievementsList,
        'UX Core',
      );

      const getKeepsimpleAchievements = findAchievementListByType(
        achievementsList,
        'KeepSimple',
      );

      const keepsimpleAchievements = getKeepsimpleAchievements.map(
        achievement => {
          const userAchievement = userAchievements?.find(
            userAch => userAch.name === achievement.slug,
          );
          return userAchievement
            ? {
                ...achievement,
                unlockedAt: formatDate(userAchievement.unlockedAt),
              }
            : achievement;
        },
      );

      if (!!keepsimpleAchievements[0]?.unlockedAt) {
        const exists = achievementBoard.some(item => item.id === 2);

        if (!exists) {
          achievementBoard.push({
            id: 2,
            pageName: 'KeepSimple',
            pageIcon: <UXCoreIcon />,
            headerColor: '#8C8C8C',
          });
        }
      }

      const enhanceKeepsimpleReceived =
        achievementsByType.keepsimpleAchievements.filter(
          achievement => achievement.unlockedAt,
        );

      setAchievementsByType({
        uxcoreAchievements,
        keepsimpleAchievements: isAllSelected
          ? keepsimpleAchievements
          : enhanceKeepsimpleReceived,
      });
    }
  }, [achievementsList, isAllSelected, userAchievements]);

  const allGeneralAchievements = findAchievementListBySubType(
    achievementsByType.uxcoreAchievements,
    'general',
  );
  const allSpecialAchievements = findAchievementListBySubType(
    achievementsByType.uxcoreAchievements,
    'special',
  );
  const getEnhancedAchievements = (achievements, userAchievements) => {
    return achievements.map(achievement => {
      const userAchievement = userAchievements?.find(
        userAch => userAch.name === achievement.slug,
      );
      return userAchievement
        ? {
            ...achievement,
            unlockedAt: formatDate(userAchievement.unlockedAt),
          }
        : achievement;
    });
  };

  const filterUnlockedAchievements = enhancedAchievements => {
    return enhancedAchievements.filter(achievement => achievement.unlockedAt);
  };

  useEffect(() => {
    if (achievementsList.length > 0 || userAchievements) {
      const enhancedGeneralAchievements = getEnhancedAchievements(
        allGeneralAchievements,
        userAchievements,
      );
      const enhanceGeneralReceived = filterUnlockedAchievements(
        enhancedGeneralAchievements,
      );

      const enhancedSpecialAchievements = getEnhancedAchievements(
        allSpecialAchievements,
        userAchievements,
      );
      const excludeUXCoreAchievements = enhancedSpecialAchievements.filter(
        achievement =>
          achievement?.unlockedAt || !achievement.slug.includes('UX_CORE'),
      );
      const enhanceSpecialReceived = filterUnlockedAchievements(
        excludeUXCoreAchievements,
      );

      const enhanceKeepsimpleReceived =
        achievementsByType.keepsimpleAchievements.filter(
          achievement => achievement.unlockedAt,
        );

      const allAchievementsQuantity =
        enhancedGeneralAchievements.length + excludeUXCoreAchievements.length;
      const unlockedAchievementsQuantity =
        enhanceGeneralReceived.length + enhanceSpecialReceived.length;
      const unlockedUxCorePercentage =
        (unlockedAchievementsQuantity / allAchievementsQuantity) * 100;
      const unlockedKeepsimplePercentage =
        (enhanceKeepsimpleReceived.length /
          achievementsByType.keepsimpleAchievements.length) *
        100;

      setReceivedAchievementPercentage({
        uxCore: unlockedUxCorePercentage,
        keepSimple: unlockedKeepsimplePercentage,
      });
    }
  }, [achievementsByType, isAllSelected, userAchievements]);

  useEffect(() => {
    if (achievementsList.length > 0 || userAchievements) {
      const enhancedGeneralAchievements =
        allGeneralAchievements &&
        enhanceAchievementsWithGroups(allGeneralAchievements, userAchievements);
      const enhanceGeneralReceived = filterUnlockedAchievements(
        enhancedGeneralAchievements,
      );

      const enhancedSpecialAchievements =
        allSpecialAchievements &&
        enhanceAchievementsWithGroups(allSpecialAchievements, userAchievements);
      const enhanceSpecialReceived = filterUnlockedAchievements(
        enhancedSpecialAchievements,
      );

      const excludeUXCoreAchievements = enhancedSpecialAchievements.filter(
        achievement =>
          achievement?.unlockedAt || !achievement.slug.includes('UX_CORE'),
      );

      setGeneralAchievements(
        isAllSelected ? enhancedGeneralAchievements : enhanceGeneralReceived,
      );
      setSpecialAchievements(
        isAllSelected ? excludeUXCoreAchievements : enhanceSpecialReceived,
      );
    }
  }, [achievementsByType, isAllSelected, userAchievements]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);
  }, []);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await getLevels(locale === 'ru' ? 'ru' : 'en');
        setLevelsDetails(data);
      } catch (err) {
        setLevelsDetails(err.message);
      }
    };

    fetchLevels().then(r => r);
  }, [locale]);

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
      achievementsList,
      notificationsData,
    );
    setNotifiedAchievements(matchingAchievements);
  }, [achievementsList, accessToken, notificationsData]);

  return (
    <>
      <SeoGenerator
        ogTags={ogTags}
        strapiSEO={{
          description: pageTitle,
          keywords: '',
          pageTitle: pageTitle,
          title: pageTitle,
        }}
        userFavIcon={isLevelMilestone(level, 14) ? userFavicon : ''}
      />
      {userPublicInfo?.response?.status === 404 ? (
        <NotFoundPage
          intl={pageNotFoundData[locale]}
          locale={locale === 'ru' ? 'ru' : 'en'}
        />
      ) : (
        <UserProfile
          headerUserInfo={isOwner && headerUserInfo}
          nextTestTime={nextTestTime}
          dummyBoardContent={achievementBoard}
          userInfo={userInfo}
          coverImages={coverImages}
          backgroundImages={backgroundImages}
          ongoingTest={ongoingTest}
          privateMode={isOwner}
          statistics={statistics}
          levelsDetails={levelsDetails}
          generalAchievements={generalAchievements}
          specialAchievements={specialAchievements}
          setIsAllSelected={setIsAllSelected}
          isLoading={isLoading}
          // @ts-ignore
          publicStartTestRef={publicStartTestRef}
          isLevelMilestone={isLevelMilestone}
          levelName={levelName}
          userLevels={userLevels}
          matchingLevelDetails={matchingLevelDetails}
          level={level}
          uxcatLevels={uxCatLevels}
          accessToken={accessToken}
          notifiedAchievements={notifiedAchievements}
          isFinalTestInProgress={isFinalTestInProgress}
          shortInfo={matchingLevelDetails?.attributes?.shortInfo}
          receivedAchievementPercentage={receivedAchievementPercentage}
          isTestResultsAvailable={!!userPrivateInfo?.user?.nextTestTime}
          finalTestPermission={userPrivateInfo?.user?.finalTestPermission}
          keepsimpleAchievements={achievementsByType.keepsimpleAchievements}
          disableStartTest={killSwitcher}
        />
      )}
    </>
  );
};
export default UserId;

export async function getServerSideProps(context) {
  const achievementsEn = await getAllAchievements('en', 40);
  const achievementsRu = await getAllAchievements('ru', 40);

  const configs = await UXCatConfigs();
  const uxCatLevels = configs.pointsPerLevel;
  const killSwitcher = configs.TestKillSwitcher;

  const allAchievements = [...achievementsEn.data, ...achievementsRu.data];

  return {
    props: {
      uxCatLevels,
      allAchievements,
      killSwitcher,
    },
  };
}
