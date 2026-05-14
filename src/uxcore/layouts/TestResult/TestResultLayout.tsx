import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { TRouter } from '@uxcore/local-types/global';
import { uxCatLevels } from '@uxcore/local-types/uxcat-types/types';

import { isLevelMilestone } from '@uxcore/lib/uxcat-helpers';

import { userInfoUpdate } from '@uxcore/api/uxcat/settings';

import testResultData from '@data/uxcat/testResult';

import BobIconWhite from '@icons/BobIconWhite';

import AddToCalendar from '@uxcore/components/AddToCalendar';
import Button from '@uxcore/components/Button';
import CompletionBar from '@uxcore/components/CompletionBar';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import NPS from '@uxcore/components/NPS';
import Result from '@uxcore/components/Result';
import ScorePanel from '@uxcore/components/ScorePanel';
import TestResultsAchievements from '@uxcore/components/TestResultsAchievements';
import Toasts from '@uxcore/components/Toasts';

import 'react-toastify/dist/ReactToastify.css';
import styles from './TestResultLayout.module.scss';

interface TestResultsTypes {
  testPoints: number;
  correctQuestions?: [];
  incorrectQuestions?: [];
  userPoints?: number;
  points?: number;
  testSummary?: {
    correctQuestions?: [];
    incorrectQuestions?: [];
  };
}

type TestResultLayoutProps = {
  testResult: TestResultsTypes;
  uxCatLevels?: uxCatLevels[];
  nextTestTime: Date | number | null;
  isFinalTestAvailable?: boolean;
  finalTestPermission?: boolean;
  finalTestPassed?: boolean;
  allowedToStart: boolean;
  loading?: boolean;
  ongoingTest?: boolean;
  isRated?: boolean;
  availableDate?: string;
  points: number;
  testPoints?: number;
  userLevel?: number | string;
  accessToken?: string;
  levelsDetails?: any;
  unlockedAchievements?: any;
  uxcgRecommendedReading?: any;
  userLevels?: any;
  notificationsData?: any;
  finalTestInProgress?: boolean;
  killSwitcher?: boolean;
  passedLevels?: number[];
  isTestUser?: boolean;
  incorrectAnswers: any; // TODO MARY - add type
};
const TestResultLayout: FC<TestResultLayoutProps> = ({
  nextTestTime,
  availableDate,
  testResult,
  points,
  levelsDetails,
  allowedToStart,
  testPoints,
  unlockedAchievements,
  finalTestPassed,
  finalTestPermission,
  uxcgRecommendedReading,
  loading,
  userLevel,
  uxCatLevels,
  userLevels,
  ongoingTest,
  notificationsData,
  accessToken,
  isRated,
  isFinalTestAvailable,
  finalTestInProgress,
  passedLevels,
  killSwitcher,
  incorrectAnswers,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { accountData } = useContext(GlobalContext);
  const [openCalendar, setOpenCalendar] = useState<boolean>(allowedToStart);
  const [loadReadingListSkeleton, setLoadReadingListSkeleton] =
    useState<boolean>(true);
  const [isNPSVisible, setIsNPSVisible] = useState(false);
  const currentLocaleUrl = locale === 'en' ? '/' : `/${locale}/`;
  const testStartUrl = ongoingTest ? '/uxcat/ongoing' : '/uxcat/start-test';
  const testStartUrlFinal = finalTestInProgress
    ? '/uxcat/ongoing'
    : '/uxcat/start-test';
  const bobUrl =
    'https://chatgpt.com/g/g-BtuSiGF18-bob-bias-trickery-and-deception-by-uxcore-io/';

  const {
    greatJobTxt,
    pointsTxt,
    failedQuestions,
    recommendationTxt,
    reminderTxt,
    nextTestTxt,
    passedQuestion,
    startBtn,
    continueTest,
    insight,
    achievementUnlocked,
    clickMe,
    passedFinalTest,
    passedFinalTestSubtext,
    failedFinalTest,
    failedFinalTestSubtext,
    encouragement,
    betterLuckNextTime,
    testIsAvailable,
    pleaseRateFirstWord,
    pleaseRate,
    finalTest,
    levelUp,
    greatJobFor100,
    done,
  } = testResultData[locale];

  const handleCalendarOpen = () => {
    setOpenCalendar(prev => !prev);
  };

  const backToUXCat = () => {
    router.push('/uxcat');
    localStorage.removeItem('testResult');
  };

  const handleSaveNPS = async (score: number) => {
    try {
      await userInfoUpdate(
        accessToken,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        score,
      );
    } catch (error) {
      console.error('Failed to update user info:', error);
      throw error;
    }
  };
  const saveFinalTestPermission = () => {
    localStorage.setItem('finalTestPermission', 'true');
  };

  const removeFinalTestPermission = () => {
    localStorage.removeItem('finalTestPermission');
  };

  const correctAnswers = testResult?.testSummary?.correctQuestions;
  const achievedPoints = correctAnswers?.length * 10;

  useEffect(() => {
    if (!!allowedToStart || uxcgRecommendedReading) {
      const timer = setTimeout(() => {
        setLoadReadingListSkeleton(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [allowedToStart, uxcgRecommendedReading]);

  useEffect(() => {
    if (isRated === null || isRated === false) {
      const timer = setTimeout(() => {
        setIsNPSVisible(true);
      }, 7000);

      return () => clearTimeout(timer);
    } else {
      setIsNPSVisible(false);
    }
  }, [isRated]);

  return (
    <section
      className={cn(styles.testResult, {
        [styles.testResultLayoutWithCode]:
          !nextTestTime && !loadReadingListSkeleton,
      })}
    >
      {loadReadingListSkeleton || nextTestTime ? (
        <>
          <div
            className={cn(styles.sectionHeader, {
              [styles.finalTestResultHeader]: finalTestPermission,
            })}
          >
            <ScorePanel
              points={achievedPoints ? achievedPoints : 0}
              greatJobTxt={achievedPoints ? greatJobTxt : ''}
              greatJobFor100={greatJobFor100 ? greatJobFor100 : ''}
              pointsTxt={pointsTxt}
              finalTestResultHeader={finalTestPermission}
              finalTestPassed={finalTestPassed}
              isMilestoneReached={isLevelMilestone(userLevel, userLevel)}
              passedFinalTestTxt={passedFinalTest}
              failedFinalTestTxt={failedFinalTest ? failedFinalTest : ''}
              encouragementTxt={encouragement ? encouragement : ''}
              passedFinalTestSubtext={passedFinalTestSubtext}
              failedFinalTestSubtext={failedFinalTestSubtext}
              loading={loading}
            />
            {!finalTestPermission && (
              <CompletionBar
                points={points || 0}
                levelsDetails={levelsDetails}
                hideMainTitle={true}
                testPoints={testPoints || 0}
                isTestResultPage
                isMilestoneReached={isLevelMilestone(userLevel, userLevel)}
                uxCatLevels={uxCatLevels}
                userLevel={userLevel as number}
                userLevels={userLevels}
                passedLevels={passedLevels}
                levelUpTxt={levelUp}
              />
            )}
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.encourage}>
              <span className={styles.encourageTxt}>{insight}</span>
              {locale === 'ru' ? (
                <p className={styles.clickOnBob}>
                  Нажмите на
                  <a href={bobUrl} target={'_blank'}>
                    <BobIconWhite />
                  </a>
                  иконки, чтобы узнать больше.
                </p>
              ) : (
                <p className={styles.clickOnBob}>
                  Click on
                  <BobIconWhite />
                  icons to learn more.
                </p>
              )}
            </div>
            <Result
              clickMeTxt={clickMe}
              correctQuestions={testResult && correctAnswers}
              incorrectQuestions={testResult && incorrectAnswers}
              failedQuestionsTxt={failedQuestions}
              passedQuestionsTxt={passedQuestion}
              betterLuckNextTimeTxt={betterLuckNextTime}
            />
            <div className={styles.additionalInfo}>
              <div
                className={cn(styles.links, {
                  [styles.linksSkeleton]: loadReadingListSkeleton,
                })}
              >
                <span className={styles.title}>{recommendationTxt}</span>
                <div className={styles.readingList}>
                  {loadReadingListSkeleton
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton
                          width={342}
                          height={27}
                          key={index}
                          className={styles.readingListSkeleton}
                        />
                      ))
                    : uxcgRecommendedReading?.map((uxcgQuestion, index) => {
                        const slug = {
                          en: uxcgQuestion?.slugEn,
                          ru: uxcgQuestion?.slugRu,
                          hy: uxcgQuestion?.slugEn,
                        };
                        return (
                          <a
                            key={index}
                            href={`${currentLocaleUrl}uxcg/${slug[locale]}`}
                            className={styles.link}
                            target={'_blank'}
                          >
                            🔗
                            {locale === 'ru'
                              ? uxcgQuestion?.titleRu
                              : uxcgQuestion?.titleEn}
                          </a>
                        );
                      })}
                </div>
              </div>
              <div className={styles.reminder}>
                <>
                  <span>{nextTestTxt}</span>
                  {!loadReadingListSkeleton ? (
                    <span className={styles.date}>
                      {allowedToStart || ongoingTest
                        ? testIsAvailable
                        : availableDate}
                    </span>
                  ) : (
                    <Skeleton
                      width={130}
                      height={25}
                      className={styles.dateSkeleton}
                    />
                  )}
                  {allowedToStart || ongoingTest ? (
                    <>
                      <Button
                        label={
                          !finalTestInProgress && ongoingTest
                            ? continueTest
                            : startBtn
                        }
                        onClick={() => {
                          router.push(testStartUrl);
                          removeFinalTestPermission();
                        }}
                        type="orange_outline"
                        className={styles['btn']}
                        disabled={finalTestInProgress || killSwitcher}
                        loading={loading}
                      />

                      {isFinalTestAvailable && (
                        <Button
                          label={finalTestInProgress ? continueTest : finalTest}
                          onClick={() => {
                            router.push(testStartUrlFinal);
                            saveFinalTestPermission();
                          }}
                          type="orange"
                          className={styles['finalTestBtn']}
                          disabled={
                            (!finalTestInProgress && ongoingTest) ||
                            killSwitcher
                          }
                          loading={loading}
                        />
                      )}
                    </>
                  ) : (
                    <Button
                      label={reminderTxt}
                      onClick={handleCalendarOpen}
                      type="orange_outline"
                      className={styles['btn']}
                      loading={loading}
                    />
                  )}
                </>
              </div>
              {!allowedToStart && openCalendar && (
                <div className={styles.calendar}>
                  <AddToCalendar
                    startTime={nextTestTime}
                    toggleCalendar={handleCalendarOpen}
                  />
                </div>
              )}
            </div>
            <TestResultsAchievements
              unlockedAchievements={unlockedAchievements}
              loading={loading}
              achievementUnlocked={achievementUnlocked}
            />
          </div>
          <div className={styles.sectionFooter}>
            <Button
              label={done}
              onClick={backToUXCat}
              type="orange"
              className={styles['btn']}
              isBig
            />
            {locale === 'en' ? (
              <span>
                You can come back to this page from{' '}
                <a href={`/user/${accountData?.username}`}>
                  {' '}
                  your profile page.{' '}
                </a>
              </span>
            ) : (
              <span>
                Вы можете вернуться на эту страницу со{' '}
                <a href={`/user/${accountData?.username}`}>
                  страницы вашего профиля.
                </a>
              </span>
            )}
          </div>
          {!!notificationsData ? (
            <Toasts
              accessToken={accessToken}
              notificationsData={notificationsData}
            />
          ) : null}
          {isNPSVisible && (
            <NPS
              pleaseRateTxt={pleaseRate}
              sendScore={handleSaveNPS}
              setIsVisible={setIsNPSVisible}
              isVisible={isNPSVisible}
              pleaseRateFirstWord={pleaseRateFirstWord}
            />
          )}
        </>
      ) : (
        <div className={styles.whyAreYouHere}>
          <Image
            src={'/assets/uxcat/secretCode.png'}
            width={870}
            height={78}
            alt={"You won't expose."}
          />
        </div>
      )}
    </section>
  );
};

export default TestResultLayout;
