import { useRouter } from 'next/router';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import Skeleton from 'react-loading-skeleton';

import type { TRouter } from '@uxcore/local-types/global';
import {
  LevelDetailsTypes,
  userLevels,
  UserTypes,
  uxCatLevels,
} from '@uxcore/local-types/uxcat-types/types';

import useKonamiCode from '@uxcore/hooks/useKonamiCode';

import { isLevelMilestone } from '@uxcore/lib/uxcat-helpers';

import uxcatData from '@data/uxcat';

import LogInModal from '@uxcore/components/_uxcp/LogInModal';
import Accordion from '@uxcore/components/Accordion';
import AchievementContainer from '@uxcore/components/AchievementContainer';
import CompletionBar from '@uxcore/components/CompletionBar';
import ContentParser from '@uxcore/components/ContentParser';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import GenderModal from '@uxcore/components/GenderModal';
import Toasts from '@uxcore/components/Toasts';
import UserProfile from '@uxcore/components/UserProfile';
import UXCatFooter from '@uxcore/components/UXCatFooter';

import 'react-toastify/dist/ReactToastify.css';
import styles from './UXCatLayout.module.scss';

type UXCGLayoutProps = {
  userInfo?: UserTypes['user'];
  nextTestTime?: number;
  ongoingTest?: boolean;
  coverImage?: string;
  levelTitle?: string;
  level?: number;
  userBadge?: string;
  levelsDetails?: LevelDetailsTypes[];
  rules?: any;
  accessToken?: string;
  achievements?: any;
  userAchievements?: any;
  loading?: boolean;
  isFinalTestInProgress?: boolean;
  disableStartTest?: boolean;
  guestLevel?: any;
  userLevels?: userLevels[];
  uxCatLevels?: uxCatLevels[];
  seriouslyAchievement?: any;
  notifiedAchievements?: any;
  pageDescription?: any;
  userDetails?: UserTypes;
  matchingLevelDetails?: LevelDetailsTypes;
  isTestUser?: boolean;
};

const UXCatLayout: FC<UXCGLayoutProps> = ({
  userInfo,
  nextTestTime,
  ongoingTest,
  coverImage,
  level,
  levelTitle,
  userBadge,
  levelsDetails,
  achievements,
  accessToken,
  userAchievements,
  loading,
  guestLevel,
  isTestUser,
  rules,
  userLevels,
  uxCatLevels,
  isFinalTestInProgress,
  seriouslyAchievement,
  notifiedAchievements,
  disableStartTest,
  pageDescription,
  matchingLevelDetails,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const { updatedUsername } = useContext(GlobalContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<boolean>(true);
  const [codeIsActivated, setCodeIsActivated] = useState(false);
  const [activatedDuration, setActivatedDuration] = useState(0);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const username = updatedUsername ? updatedUsername : userInfo?.username;
  const activatedBarLine = isLevelMilestone(level, 15) ? 2500 : 1000;
  const {
    shortTitle,
    title,
    guestUsername,
    accordionTitle,
    awarenessPointsTxt,
    myProfileTxt,
    lvlProgression,
    achievementTxt,
    showAchievementsTxt,
    yourPointsTxt,
    zeroLevelUser,
  } = uxcatData[currentLocale];

  const userPoints = userInfo?.points;
  const fiveAchievements = achievements?.slice(0, 10);
  const loggedInAchievements = achievements?.slice(0, 15);
  const achievementsList = !!accessToken
    ? loggedInAchievements
    : fiveAchievements;
  const handleClick = useCallback(() => {
    setOpenAccordion(prev => !prev);
  }, []);

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  useEffect(() => {
    const getOpenedUXCatRules = localStorage.getItem('isOpenedUXCatRules');
    if (!!getOpenedUXCatRules) {
      setOpenAccordion(JSON.parse(getOpenedUXCatRules));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isOpenedUXCatRules', JSON.stringify(openAccordion));
  }, [openAccordion]);

  useEffect(() => {
    // Mary you get  undefined from here!
    if (userInfo || !accessToken) {
      const timer = setTimeout(() => {
        setUserDataLoaded(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [userInfo]);

  useKonamiCode(() => {
    setCodeIsActivated(true);
  });

  useEffect(() => {
    if (codeIsActivated) {
      const timer = setTimeout(() => {
        setCodeIsActivated(false);
      }, 13000);
      return () => clearTimeout(timer);
    }
  }, [codeIsActivated]);

  useEffect(() => {
    if (codeIsActivated) {
      const timer = setInterval(() => {
        setActivatedDuration(prevDuration => prevDuration + 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setActivatedDuration(0);
    }
  }, [codeIsActivated]);

  useEffect(() => {
    if (activatedDuration >= 7 && activatedDuration <= 8 && !audioPlayed) {
      const audio = new Audio('/audio/bomb-short.mp3');
      audio.play();
      setAudioPlayed(true);
    }
    if (activatedDuration < 7 || activatedDuration > 8) {
      setAudioPlayed(false);
    }
  }, [activatedDuration, codeIsActivated, audioPlayed]);

  useEffect(() => {
    if (codeIsActivated) {
      if (activatedDuration === 9) {
        setSelectedGender('male');
      }
      if (activatedDuration === 10) {
        setSelectedGender('female');
      }
      if (activatedDuration === 11) {
        setSelectedGender('gmail');
      }
    } else {
      setSelectedGender('');
    }
  }, [activatedDuration, codeIsActivated]);

  return (
    <>
      <section className={styles.body}>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.shortTitle}>{shortTitle}</span>
          <ContentParser data={pageDescription} />
          <Accordion
            className={styles['accordion']}
            title={accordionTitle}
            isOpen={openAccordion}
            onToggleClick={handleClick}
          >
            <ContentParser data={rules} />
          </Accordion>
          <div className={styles.userProfile}>
            {userDataLoaded ? (
              <UserProfile
                guestLevel={guestLevel}
                userLevel={level}
                userName={!userInfo ? guestUsername : username}
                exceptionUsername={
                  userInfo?.id === 1034 && userInfo?.usernameLong
                }
                title={userInfo?.title}
                openLoginModal={openLoginModal}
                loggedIn={!!accessToken}
                levelTitle={levelTitle ? levelTitle : zeroLevelUser}
                topPosition={Math.floor(userInfo?.rankingStatistics?.topOf)}
                rankPosition={Math.floor(userInfo?.rankingStatistics?.rank)}
                rankAndTopUpdate={userInfo?.rankingStatistics?.nextUpdateTime}
                ongoingTest={ongoingTest}
                awarenessPointsTxt={awarenessPointsTxt}
                nextTestTime={nextTestTime}
                myProfileTxt={myProfileTxt}
                finalTestPermission={userInfo.finalTestPermission}
                coverImage={coverImage}
                userBadge={userBadge}
                isFinalTestInProgress={isFinalTestInProgress}
                disableStartTest={disableStartTest}
                matchingLevelDetails={matchingLevelDetails}
                isTestUser={isTestUser}
              />
            ) : (
              <Skeleton height={144} width={904} />
            )}
          </div>
          <CompletionBar
            points={codeIsActivated ? activatedBarLine : userPoints || 0}
            withBorders
            showTotal
            lvlProgressionTxt={lvlProgression}
            yourPointsTxt={level > 0 && yourPointsTxt}
            levelsDetails={levelsDetails}
            userLevel={level}
            testPoints={0}
            isMilestoneReached={isLevelMilestone(level, level)}
            userLevels={userLevels}
            uxCatLevels={uxCatLevels}
            codeIsActivated={codeIsActivated}
          />
          <AchievementContainer
            openLoginModal={openLoginModal}
            isLoggedIn={!!accessToken}
            username={userInfo?.username}
            achievementTxt={achievementTxt}
            showAchievementsTxt={showAchievementsTxt}
            achievements={achievementsList}
            loading={loading}
            codeIsActivated={codeIsActivated}
            activatedDuration={activatedDuration}
          />
          {/*Temporarily hidden*/}
          {/*<div className={styles.leaderboard}>*/}
          {/*  <Leaderboard />*/}
          {/*</div>*/}
          <UXCatFooter />
        </div>
      </section>
      {activatedDuration >= 2 && (
        <Toasts
          accessToken={accessToken}
          // TODO - Mary: Badge problem :(
          notificationsData={[seriouslyAchievement?.data]}
          isKonamiCodeActive
        />
      )}
      {activatedDuration >= 8 && (
        <div className={styles.explosion}>
          <ConfettiExplosion
            force={1}
            duration={3000}
            particleCount={500}
            width={1000}
            height={1000}
          />
        </div>
      )}
      {activatedDuration >= 9 && (
        <GenderModal
          token={accessToken}
          onClose={() => () => {}}
          askedGenderCount={false}
          defaultKonamiGender={selectedGender}
        />
      )}
      {showLoginModal && (
        <LogInModal setShowModal={setShowLoginModal} source={'UXCat'} />
      )}
      {!!notifiedAchievements ? (
        <Toasts
          accessToken={accessToken}
          notificationsData={notifiedAchievements}
        />
      ) : null}
    </>
  );
};
export default UXCatLayout;
