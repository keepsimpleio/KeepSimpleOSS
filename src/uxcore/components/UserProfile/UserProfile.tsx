import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { TRouter } from '@uxcore/local-types/global';

import useMobile from '@uxcore/hooks/useMobile';

import uxcatData from '@uxcore/data/uxcat';

import RankingInfoAndBtn from '@uxcore/components/AccountHeader/RankingInfoAndBtn';
import Button from '@uxcore/components/Button';
import StartTestBtn from '@uxcore/components/StartTestBtn';

import styles from './UserProfile.module.scss';

type UserProfileProps = {
  loggedIn?: boolean;
  userName: string;
  userLevel: number;
  openLoginModal?: () => void;
  levelTitle?: string;
  ranking?: number;
  ongoingTest?: boolean;
  awarenessPointsTxt: string;
  myProfileTxt: string;
  finalTestPermission?: boolean;
  nextTestTime: number | null;
  coverImage: string;
  isFinalTestInProgress?: boolean;
  userBadge: string;
  guestLevel: any;
  title?: string;
  topPosition?: number;
  rankPosition?: number;
  rankAndTopUpdate?: number;
  disableStartTest?: boolean;
  matchingLevelDetails?: any;
  isTestUser?: boolean;
  exceptionUsername?: string;
};
const UserProfile: FC<UserProfileProps> = ({
  userName = 'Guest User',
  userLevel = 0,
  openLoginModal,
  loggedIn,
  levelTitle,
  ongoingTest,
  awarenessPointsTxt,
  myProfileTxt,
  nextTestTime,
  finalTestPermission,
  coverImage,
  userBadge,
  guestLevel,
  isFinalTestInProgress,
  topPosition,
  rankPosition,
  rankAndTopUpdate,
  disableStartTest,
  title,
  matchingLevelDetails,
  isTestUser,
  exceptionUsername,
}) => {
  const router = useRouter();
  const { isMobile } = useMobile()[1];
  const { locale } = router as TRouter;
  const { lvl } = uxcatData[locale];

  const testStartUrl = ongoingTest ? '/uxcat/ongoing' : '/uxcat/start-test';

  const coverUserImage =
    loggedIn && coverImage
      ? `${process.env.NEXT_PUBLIC_STRAPI}${coverImage}`
      : '/assets/uxcat/coverImage.png';
  const badge =
    loggedIn && userBadge
      ? `${process.env.NEXT_PUBLIC_STRAPI}${userBadge}`
      : '/assets/uxcat/guestLvl.png';

  const openTest = () => {
    if (loggedIn) {
      router.push(testStartUrl);
    }
  };

  const openLogin = () => {
    if (!loggedIn) {
      openLoginModal();
    }
  };

  return (
    <>
      <div
        data-test-id={loggedIn ? 'authenticated' : 'guest'}
        className={cn(styles.userProfile, {
          [styles.guestMode]: !loggedIn,
          [styles.withFinalTestBtn]: finalTestPermission,
        })}
        style={{
          backgroundImage: `url(${coverUserImage})`,
        }}
      >
        <div className={styles.wrapper}>
          <div className={styles.badgeWrapper}>
            {badge ? (
              <>
                <img
                  src={badge}
                  data-tooltip-id={'user-badge'}
                  alt={'user badge'}
                  width={126}
                  height={126}
                  className={styles.badge}
                />
                <ReactTooltip
                  id={'user-badge'}
                  place="bottom"
                  opacity={1}
                  className={styles.badgeTooltip}
                >
                  <span> {matchingLevelDetails?.attributes?.description}</span>
                </ReactTooltip>
              </>
            ) : (
              <p> Loading...</p>
            )}
          </div>

          <div className={styles.userInfo}>
            <div className={styles.nameAndTitle}>
              {!!title && <span className={styles.title}> {title}</span>}
              <h2 className={styles.userName}>
                {exceptionUsername ? exceptionUsername : userName}
              </h2>
            </div>
            <span className={styles.level}>
              {`${
                levelTitle ? levelTitle : guestLevel.attributes.lavelName
              } (${lvl} ${userLevel || 0}) ${
                !!userLevel ? '' : guestLevel?.attributes?.description
              } `}
            </span>
            {!loggedIn ? (
              <span className={styles.awarenessPoints}>
                {awarenessPointsTxt}
              </span>
            ) : (
              <Button
                label={myProfileTxt}
                onClick={() => router.push(`/user/${userName}`)}
                type={'orange_outline'}
                className={styles['myProfileBtn']}
              />
            )}
          </div>
        </div>
        {!isMobile && (
          <div
            className={cn(styles.btnWrapper, {
              [styles['guestMode']]: !loggedIn,
            })}
          >
            {loggedIn ? (
              <RankingInfoAndBtn
                nextTestTime={isTestUser ? 0 : nextTestTime}
                handleStartTestClick={openTest}
                ongoingTest={ongoingTest}
                isFinalTestInProgress={isFinalTestInProgress}
                finalTestPermission={finalTestPermission}
                isLevelTwo={userLevel >= 2}
                isIconSmall
                topOf={topPosition}
                rankPosition={rankPosition}
                nextUpdateTime={rankAndTopUpdate}
                disabledRegularTest={disableStartTest}
                disabledFinalTest={finalTestPermission && disableStartTest}
              />
            ) : (
              <StartTestBtn
                nextTestTime={isTestUser ? 0 : nextTestTime}
                handleOpenTest={openLogin}
                ongoingTest={ongoingTest}
                isFinalTestInProgress={isFinalTestInProgress}
                isRegularTestBtn
                disabled={isFinalTestInProgress || disableStartTest}
                buttonType={finalTestPermission ? 'orange_outline' : 'orange'}
                dataCy={'start-test-btn'}
              />
            )}
          </div>
        )}
      </div>
      {isMobile && (
        <div className={styles.btnWrapperMobile}>
          {
            <StartTestBtn
              nextTestTime={isTestUser ? 0 : nextTestTime}
              handleOpenTest={loggedIn ? openTest : openLogin}
              ongoingTest={ongoingTest}
              isFinalTestInProgress={isFinalTestInProgress}
              isRegularTestBtn
              disabled={isFinalTestInProgress}
              className={styles['startBtn']}
              buttonType={finalTestPermission ? 'orange_outline' : 'orange'}
            />
          }
          {finalTestPermission && (
            <StartTestBtn
              nextTestTime={isTestUser ? 0 : nextTestTime}
              handleOpenTest={openTest}
              ongoingTest={isFinalTestInProgress}
              finalTestPermission={finalTestPermission}
              className={styles['finalTestBtn']}
              isFinalTestInProgress={isFinalTestInProgress}
              disabled={ongoingTest && !isFinalTestInProgress}
              buttonType={'orange'}
            />
          )}
        </div>
      )}
    </>
  );
};
export default UserProfile;
