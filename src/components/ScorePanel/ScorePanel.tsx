import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Confetti from 'react-confetti';
import cn from 'classnames';

import styles from './ScorePanel.module.scss';

type ScorePanelProps = {
  points?: number;
  greatJobTxt: string;
  pointsTxt?: string;
  finalTestResultHeader: boolean;
  finalTestPassed?: boolean;
  isMilestoneReached?: boolean;
  passedFinalTestTxt?: string;
  failedFinalTestTxt?: string;
  encouragementTxt?: string;
  passedFinalTestSubtext?: string;
  failedFinalTestSubtext?: string;
  loading?: boolean;
  greatJobFor100?: string;
};

const ScorePanel: FC<ScorePanelProps> = ({
  points,
  greatJobTxt,
  pointsTxt,
  finalTestResultHeader,
  finalTestPassed,
  isMilestoneReached,
  passedFinalTestTxt,
  failedFinalTestTxt,
  passedFinalTestSubtext,
  failedFinalTestSubtext,
  encouragementTxt,
  loading,
  greatJobFor100,
}) => {
  const [displayPoints, setDisplayPoints] = useState(0);
  const [displayConfetti, setDisplayConfetti] = useState(false);

  const txtFinalTest = !finalTestPassed
    ? failedFinalTestSubtext
    : passedFinalTestSubtext;

  const successText = !finalTestPassed
    ? failedFinalTestTxt
    : passedFinalTestTxt;

  const scoredPoints = points === 0 ? points : `+${displayPoints}`;
  const passedEncouragement = points === 100 ? greatJobFor100 : greatJobTxt;
  const encouragement = points === 0 ? encouragementTxt : passedEncouragement;

  useEffect(() => {
    if (points > 0) {
      const duration = 1000;
      const startTime = performance.now();

      const animatePoints = currentTime => {
        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);
        const currentPoints = Math.floor(progress * points);

        setDisplayPoints(currentPoints);

        if (progress < 1) {
          requestAnimationFrame(animatePoints);
        } else {
          setDisplayPoints(points);
        }
      };

      requestAnimationFrame(animatePoints);
    } else {
      setDisplayPoints(points);
    }
  }, [points]);

  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      if (finalTestPassed ?? points > 0) {
        setDisplayConfetti(true);
      } else {
        setDisplayConfetti(false);
      }
    }, 1000);

    return () => clearTimeout(confettiTimer);
  }, [finalTestPassed, points]);

  return (
    <div
      className={cn(styles.wrapper, {
        [styles.finalTestWrapper]: finalTestResultHeader,
      })}
    >
      <div
        className={cn(styles.pointsWrapper, {
          [styles.finalTestPointsWrapper]: finalTestResultHeader,
        })}
      >
        {finalTestResultHeader ? (
          !finalTestPassed ? (
            <div className={styles.imgWrapper}>
              <Image
                src={'/assets/uxcat/enlightened.png'}
                width={110}
                height={100}
                alt={'Enlightened'}
              />
            </div>
          ) : null
        ) : (
          points > 0 && <span className={styles.emoji}> 🎉 </span>
        )}
        <span
          className={cn(styles.points, {
            [styles.milestone]: finalTestResultHeader,
            [styles.milestoneReached]: isMilestoneReached,
          })}
        >
          {finalTestResultHeader ? successText : scoredPoints}
        </span>
        {!finalTestResultHeader && (
          <span
            className={cn(styles.pointsTxt, {
              [styles.milestoneReached]: isMilestoneReached,
            })}
          >
            {pointsTxt}
          </span>
        )}
      </div>
      {displayConfetti && (
        <Confetti
          width={216}
          height={180}
          gravity={0.02}
          className={cn(styles.canves, {
            [styles.finalTestCanvas]: finalTestResultHeader,
          })}
          colors={[
            '#87c58d',
            '#ffec9f',
            '#aebafa',
            '#e4879b',
            '#ffffff',
            '#ff9900',
            '#d253ff',
          ]}
        />
      )}
      {!loading && (
        <h1
          className={cn(styles.title, {
            [styles.finalTestTitle]: finalTestResultHeader,
            [styles.encouragement]: points === 0,
            [styles.encouragementMilestone]: points === 0 && isMilestoneReached,
          })}
        >
          {finalTestResultHeader ? txtFinalTest : encouragement}
        </h1>
      )}
    </div>
  );
};

export default ScorePanel;
