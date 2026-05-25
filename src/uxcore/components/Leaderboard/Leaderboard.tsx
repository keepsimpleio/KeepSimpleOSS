import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import useMobile from '@uxcore/hooks/useMobile';

import leaderboardPlaceholder from '@uxcore/data/leaderboard';

import Tooltip from '@uxcore/components/Tooltip';
import UXCatPageTitle from '@uxcore/components/UXCatPageTitle';

import styles from './Leaderboard.module.scss';

type LeaderboardProps = {
  lastUpdated?: number;
  isLeaderboardAvailable?: boolean;
};
const Leaderboard: FC<LeaderboardProps> = ({
  lastUpdated = 19,
  isLeaderboardAvailable = false,
}) => {
  const router = useRouter();
  const { isMobile } = useMobile()[1];
  const { locale } = router as TRouter;
  const langEn = locale === 'en';

  const leaderboardDummyContent = leaderboardPlaceholder.en.tableContent;
  const leaderboardHeader = leaderboardPlaceholder.en.tableHeader;
  const { title, info, rankingInfo, leaderboardUnavailable, noData } =
    leaderboardPlaceholder[locale];

  const lastUpdatedTxt = langEn
    ? `(Last updated: ${lastUpdated} hours ago)`
    : ` (Последнее обновление ${lastUpdated} часов назад)`;

  const firstTopWinners = (ranking: number) => {
    if (ranking === 1) {
      return (
        <Image
          src={'/assets/uxcat/firstPlace.png'}
          width={18}
          height={18}
          className={styles.img}
          alt={'first place'}
        />
      );
    }
    if (ranking === 2) {
      return (
        <Image
          src={'/assets/uxcat/secondPlace.png'}
          width={18}
          height={18}
          className={styles.img}
          alt={'second place'}
        />
      );
    }
    if (ranking === 3) {
      return (
        <Image
          src={'/assets/uxcat/thirdPlace.png'}
          width={18}
          height={18}
          className={styles.img}
          alt={'third place'}
        />
      );
    }
  };

  const negativeOrPositive = (value: string) => {
    if (value.includes('-')) {
      return <span className={styles.negative}>{value}</span>;
    } else {
      return <span className={styles.positive}>{value}</span>;
    }
  };

  return (
    <>
      {!isLeaderboardAvailable && !isMobile && (
        <div className={styles.noData}>
          <div>
            <Image
              src={'/assets/uxcat/locker.png'}
              width={64}
              height={64}
              alt={'locker'}
            />
          </div>
          <span className={styles.noDataTxt}> {noData}</span>
        </div>
      )}
      <div
        className={cn(styles.leaderboardWrapper, {
          [styles.leaderboardUnavailable]: !isLeaderboardAvailable,
        })}
      >
        <div className={styles.mainInfo}>
          <UXCatPageTitle title={title} />
          {!isMobile && (
            <>
              <Tooltip content={info} containerClassName={styles.tooltip}>
                <Image
                  src={'/assets/icons/q-mark.svg'}
                  width={15}
                  height={15}
                  alt={'question mark'}
                />
              </Tooltip>
              <span className={styles.lastUpdate}>{lastUpdatedTxt}</span>
            </>
          )}
        </div>
        {isMobile ? (
          <div className={styles.unavailable}>
            <div className={styles.icon}>
              <Image
                src={'/assets/icons/warningSign.png'}
                width={24}
                height={24}
                alt={'warning sign'}
              />
            </div>
            <p className={styles.text}>{leaderboardUnavailable}</p>
          </div>
        ) : (
          <div className={styles.leaderboard}>
            <table>
              <thead className={styles.header}>
                <tr className={styles.headerWrapper}>
                  {leaderboardHeader.map((item, index) => {
                    return (
                      <th key={index} className={styles.title}>
                        {item === 'Quality Ratio' ? (
                          <div className={styles.qualityRationTitle}>
                            {item}
                            <Tooltip content={rankingInfo}>
                              <Image
                                src={'/assets/icons/q-mark.svg'}
                                width={15}
                                height={15}
                                alt={'question mark'}
                              />
                            </Tooltip>
                          </div>
                        ) : (
                          item
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {leaderboardDummyContent.map((board, index) => (
                  <tr className={styles.content} key={index}>
                    <td className={styles.ranking}>{board.ranking}</td>
                    <td className={styles.name}>
                      {firstTopWinners(board.ranking)}
                      <span> {board.name}</span>
                    </td>
                    <td className={styles.qualityRatio}>
                      {' '}
                      {board.qualityRatio}%
                    </td>
                    <td className={styles.testsTaken}>{board.testsTaken}</td>
                    <td className={styles.awarenessPoints}>
                      {board.awarenessPoints}
                    </td>
                    <td className={styles.position}>
                      {negativeOrPositive(board.position)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Leaderboard;
