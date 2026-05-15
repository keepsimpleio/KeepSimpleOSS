import { getForceStop } from '@uxcore/api/uxcat/force-stop';
import Modal from '@uxcore/components/Modal';
import ModalBody from '@uxcore/components/Timer/ModalBody';
import timerData from '@uxcore/data/uxcat/timeIsUp';
import useMobile from '@uxcore/hooks/useMobile';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import styles from './Timer.module.scss';

type TimerProps = {
  setTimesUp?: (timesUp: boolean) => void;
  accessToken?: string;
  remainingTime?: { hours: number; minutes: number; seconds: number };
  showSkeleton?: boolean;
  setFiveScsLeft?: (fiveScsLeft: boolean) => void;
  fiveScsLeft?: boolean;
  setLastQuestionClicked?: (value: boolean) => void;
  lastNumberClicked?: boolean;
};

const Timer: FC<TimerProps> = ({
  setTimesUp,
  remainingTime,
  accessToken,
  showSkeleton,
  setFiveScsLeft,
  fiveScsLeft,
  setLastQuestionClicked,
  lastNumberClicked,
}) => {
  const { isMobile } = useMobile()[1];

  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const [timeLeft, setTimeLeft] = useState<number>();
  const [color, setColor] = useState<string>('green');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { showResults, timeIsUp, timeLeftTxt } = timerData[currentLocale];

  const toggleBodyOverflow = (isOpen: boolean) => {
    if (typeof window !== 'undefined') {
      const overflowDefaultValue = 'auto';
      document.documentElement.style.overflowY = isOpen
        ? 'hidden'
        : overflowDefaultValue;
    }
  };

  const goToResultsPage = () => {
    router.push('/uxcat/test-result');
    setLastQuestionClicked(true);
  };

  const formatTime = (time: number) => {
    const hours: number = Math.floor(time / 3600);
    time -= hours * 3600;
    const minutes: number = Math.floor(time / 60);
    const seconds: number = time % 60;
    return `${hours ? `${hours}:` : ''}${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  useEffect(() => {
    const initialTimeInSeconds =
      remainingTime.hours * 3600 +
      remainingTime.minutes * 60 +
      remainingTime.seconds;
    const endTime = Date.now() + initialTimeInSeconds * 1000;
    setTimeLeft(initialTimeInSeconds);

    const updateRemainingTime = () => {
      const currentTime = Date.now();
      const remainingTimeInSeconds = Math.max(
        Math.floor((endTime - currentTime) / 1000),
        0,
      );
      setTimeLeft(remainingTimeInSeconds);

      if (remainingTimeInSeconds > 0) {
        requestAnimationFrame(updateRemainingTime);
      }
    };

    updateRemainingTime();

    // @ts-ignore
    return () => cancelAnimationFrame(updateRemainingTime);
  }, [remainingTime]);

  useEffect(() => {
    if (timeLeft <= 120) {
      setColor('red');
    } else if (timeLeft <= 300) {
      setColor('orange');
    } else {
      setColor('green');
    }
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      const forceStop = async () => {
        return await getForceStop(accessToken);
      };

      forceStop();
      setTimesUp(true);
    }
  }, [timeLeft, setTimesUp, accessToken]);

  useEffect(() => {
    if (isMobile && timeLeft === 0) {
      setIsModalOpen(true);
    }
  }, [isMobile, timeLeft]);

  useEffect(() => {
    toggleBodyOverflow(isModalOpen);
    return () => toggleBodyOverflow(false);
  }, [isModalOpen]);

  useEffect(() => {
    if (timeLeft <= 5) {
      setFiveScsLeft(true);
    }
  }, [timeLeft, lastNumberClicked]);

  return (
    <>
      <div className={cn(styles.timerContainer, styles[`changed-${color}`])}>
        <span className={styles.timeLeftTxt}> {timeLeftTxt}</span>
        {showSkeleton ? (
          <Skeleton width={67} height={31} />
        ) : (
          <div className={cn(styles[color], styles.timer)}>
            {formatTime(timeLeft)}
          </div>
        )}
      </div>
      {timeLeft === 0 || false ? (
        isMobile ? (
          <div className={styles.mobileTimeIsUp}>
            <ModalBody
              timeIsUp={timeIsUp}
              showResults={showResults}
              goToResultsPage={goToResultsPage}
            />
          </div>
        ) : (
          <Modal
            className={styles.timeIsUp}
            removeHeader
            size="small"
            wrapperClassName={styles['wrapper']}
          >
            <ModalBody
              timeIsUp={timeIsUp}
              showResults={showResults}
              goToResultsPage={goToResultsPage}
            />
          </Modal>
        )
      ) : null}
    </>
  );
};

export default Timer;
