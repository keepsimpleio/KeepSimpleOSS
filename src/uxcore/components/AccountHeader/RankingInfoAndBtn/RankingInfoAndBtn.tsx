import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { TRouter } from '@uxcore/local-types/global';

import uxcatData from '@uxcore/data/uxcat';

import StartTestBtn from '@uxcore/components/StartTestBtn';
import Tooltip from '@uxcore/components/Tooltip';

import styles from './RankingInfoAndBtn.module.scss';

interface RankingInfoAndBtnProps {
  nextTestTime: number;
  handleStartTestClick: () => void;
  ongoingTest: boolean;
  finalTestPermission?: boolean;
  topOf?: number;
  nextUpdateTime?: number;
  rankPosition?: number;
  isFinalTestInProgress?: boolean;
  isLevelTwo?: boolean;
  isIconSmall?: boolean;
  disabledRegularTest?: boolean;
  disabledFinalTest?: boolean;
  guestMode?: boolean;
  setOpenLoginModal?: (handleOpenLoginModal: boolean) => void;
}

const RankingInfoAndBtn: FC<RankingInfoAndBtnProps> = ({
  nextTestTime,
  handleStartTestClick,
  finalTestPermission,
  ongoingTest,
  topOf,
  isFinalTestInProgress,
  isLevelTwo,
  isIconSmall,
  rankPosition,
  nextUpdateTime,
  disabledRegularTest,
  disabledFinalTest,
  guestMode,
  setOpenLoginModal,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { top, rank, unlockAt, nextUpdateIn } = uxcatData[locale];
  const [updateTime, setUpdateTime] = useState('');
  const { minutesTxtShort, hoursTxtShort, secondsTxtShort } = uxcatData[locale];

  useEffect(() => {
    const updateTimeString = () => {
      const hourByMinutes = 60;
      const nextTestDate = new Date(nextUpdateTime);
      const currentDate = new Date();
      const differenceInMilliseconds =
        nextTestDate.getTime() - currentDate.getTime();
      if (differenceInMilliseconds < 0 || !nextUpdateTime) {
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
        newTimeString += `${nextUpdateIn} ${hours} ${hoursTxtShort} ${minutes} ${minutesTxtShort}`;
      } else if (minutesTotal > 0) {
        newTimeString = `${nextUpdateIn} ${minutes} ${minutesTxtShort} ${seconds} ${secondsTxtShort}`;
      } else {
        newTimeString = `${nextUpdateIn} ${seconds} ${secondsTxtShort}`;
      }

      setUpdateTime(newTimeString.trim());
    };

    updateTimeString();

    const interval = setInterval(updateTimeString, 1000);
    return () => clearInterval(interval);
  }, [nextUpdateTime, locale]);

  return (
    <div
      className={cn(styles.contentWrapper, {
        [styles.iconSmall]: isIconSmall,
      })}
    >
      {isLevelTwo ? (
        <div className={styles.statisticsWrapper}>
          <div className={styles.userTop} data-tooltip-id={'1'}>
            <span> {top}</span>
            <span> {`${topOf || 0}%`} </span>
          </div>
          <ReactTooltip className={styles.unlockAt} id={'1'} place={'top'}>
            <span> {updateTime}</span>
          </ReactTooltip>
          <div className={styles.userRank} data-tooltip-id={'2'}>
            <span> {rank}</span>
            <span> {`#${rankPosition || 0} `} </span>
          </div>
          <ReactTooltip id={'2'} place={'top'} className={styles.unlockAt}>
            <span> {updateTime}</span>
          </ReactTooltip>
        </div>
      ) : (
        <div className={styles.statisticsWrapper}>
          <Tooltip content={unlockAt} className={styles.unlockAt}>
            <div className={styles.userTop}>
              <span className={styles.locker}> 🔒 </span>
            </div>
          </Tooltip>
          <Tooltip content={unlockAt} className={styles.unlockAt}>
            <div className={styles.userRank}>
              <span className={styles.locker}> 🔒 </span>
            </div>
          </Tooltip>
        </div>
      )}
      <div
        className={cn(styles.btnWrapper, {
          [styles.withFinalTestBtn]: finalTestPermission,
        })}
      >
        <StartTestBtn
          buttonType={finalTestPermission ? 'orange_outline' : 'orange'}
          nextTestTime={nextTestTime}
          handleOpenTest={
            guestMode ? () => setOpenLoginModal(true) : handleStartTestClick
          }
          ongoingTest={ongoingTest}
          className={cn(styles['btn'], {
            [styles.ruBtn]: locale === 'ru',
          })}
          isFinalTestInProgress={isFinalTestInProgress}
          isRegularTestBtn
          disabled={isFinalTestInProgress || disabledRegularTest}
        />
        {finalTestPermission && (
          <StartTestBtn
            buttonType={'orange'}
            nextTestTime={nextTestTime}
            handleOpenTest={handleStartTestClick}
            ongoingTest={ongoingTest}
            finalTestPermission={finalTestPermission}
            className={cn(styles['btn'], {
              [styles.ruBtn]: locale === 'ru',
            })}
            isFinalTestInProgress={isFinalTestInProgress}
            disabled={
              (ongoingTest && !isFinalTestInProgress) || disabledFinalTest
            }
          />
        )}
      </div>
    </div>
  );
};

export default RankingInfoAndBtn;
