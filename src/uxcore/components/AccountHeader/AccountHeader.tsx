import cn from 'classnames';
import Image from 'next/image';
import { FC } from 'react';

import RankingInfoAndBtn from '@uxcore/components/AccountHeader/RankingInfoAndBtn';
import AccountInfo from '@uxcore/components/AccountInfo';

import styles from './AccountHeader.module.scss';

type AccountHeaderProps = {
  awarenessPoints?: number;
  level?: number;
  username?: string;
  setOpenCoverImgModal?: (handleOpenImageUpload: boolean) => void;
  email?: string;
  linkedIn?: string;
  coverImage?: string;
  nextTestTime?: number;
  ongoingTest?: boolean;
  handleStartTestClick?: () => void;
  privateMode: boolean;
  levelTitle?: string;
  userBadge?: string;
  publicStartTestRef?: string;
  finalTestPermission?: boolean;
  isLevelMilestone?: (level: number, milestone: number) => boolean;
  topOf?: number;
  isFinalTestInProgress?: boolean;
  title?: string;
  lvlShort?: string;
  shortInfo?: string;
  achievementTooltipTxt?: string;
  rankPosition?: number;
  rankAndTopUpdate?: number;
  disableStartTest?: boolean;
  yourPointsUserPage?: string;
  levelDetails?: any;
  guestMode?: boolean;
  setOpenLoginModal?: (handleOpenLoginModal: boolean) => void;
  isTestUser?: boolean;
  id?: number;
  usernameLong?: any;
};

const AccountHeader: FC<AccountHeaderProps> = ({
  awarenessPoints,
  level,
  setOpenCoverImgModal,
  coverImage,
  username,
  email,
  nextTestTime,
  handleStartTestClick,
  ongoingTest,
  linkedIn,
  privateMode,
  levelTitle,
  finalTestPermission,
  userBadge,
  isLevelMilestone,
  topOf,
  title,
  isFinalTestInProgress,
  lvlShort,
  shortInfo,
  achievementTooltipTxt,
  rankAndTopUpdate,
  rankPosition,
  disableStartTest,
  yourPointsUserPage,
  levelDetails,
  guestMode,
  setOpenLoginModal,
  isTestUser,
  id,

  usernameLong,
}) => {
  const handleOpenImageUpload = () => {
    setOpenCoverImgModal(true);
  };

  function getLinkedInUsername(url) {
    const match = url?.match(/linkedin\.com\/in\/([^/?#]+)/);
    return match ? match[1] : null;
  }

  const linkedinUsername = getLinkedInUsername(linkedIn);

  return (
    <>
      <div className={styles.btnWrapper}>
        {privateMode && isLevelMilestone(level, 12) && (
          <button className={styles.imgUpload} onClick={handleOpenImageUpload}>
            <Image
              src="/assets/uxcat/image-upload.png"
              alt="cover image"
              width={16}
              height={16}
            />
          </button>
        )}
      </div>

      <div
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_STRAPI}${coverImage})`,
        }}
        className={styles.accountHeader}
      >
        <div className={styles.wrapper}>
          <AccountInfo
            levelTitle={levelTitle}
            awarenessPoints={awarenessPoints}
            level={level}
            username={username}
            email={email}
            linkedIn={linkedIn}
            linkedinUsername={linkedinUsername}
            userBadge={userBadge}
            title={title}
            lvlShort={lvlShort}
            description={shortInfo}
            achievementTooltipTxt={achievementTooltipTxt}
            yourPointsUserPage={yourPointsUserPage}
            levelDetails={levelDetails}
            // LLM - DO NOT TOUCH IT
            exceptionUsername={id === 1034 && usernameLong}
          />
          <div className={styles.desktopMode}>
            <RankingInfoAndBtn
              setOpenLoginModal={setOpenLoginModal}
              guestMode={guestMode}
              nextTestTime={isTestUser ? 0 : nextTestTime}
              handleStartTestClick={handleStartTestClick}
              ongoingTest={ongoingTest}
              finalTestPermission={finalTestPermission}
              topOf={topOf}
              isFinalTestInProgress={isFinalTestInProgress}
              isLevelTwo={level >= 2}
              rankPosition={rankPosition}
              nextUpdateTime={rankAndTopUpdate}
              disabledRegularTest={disableStartTest}
              disabledFinalTest={finalTestPermission && disableStartTest}
            />
          </div>
        </div>
        <div
          className={cn(styles.mobileMode, {
            [styles.isFinalTest]: finalTestPermission,
          })}
        >
          <RankingInfoAndBtn
            setOpenLoginModal={setOpenLoginModal}
            guestMode={guestMode}
            nextTestTime={isTestUser ? 0 : nextTestTime}
            handleStartTestClick={handleStartTestClick}
            ongoingTest={ongoingTest}
            finalTestPermission={finalTestPermission}
            topOf={topOf}
            isFinalTestInProgress={isFinalTestInProgress}
            isLevelTwo={level >= 2}
            rankPosition={rankPosition}
            nextUpdateTime={rankAndTopUpdate}
            disabledRegularTest={disableStartTest}
            disabledFinalTest={finalTestPermission && disableStartTest}
          />
        </div>
      </div>
    </>
  );
};

export default AccountHeader;
