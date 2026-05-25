import { FC } from 'react';

import AudioPlayer from '@uxcore/components/AudioPlayer';
import Timer from '@uxcore/components/Timer';

import styles from './OngoingHeader.module.scss';

interface OngoingHeaderProps {
  setTimesUp: (value: boolean) => void;
  remainingTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  accessToken: string;
  showSkeleton: boolean;
  setFiveScsLeft: (value: boolean) => void;
  fiveScsLeft: boolean;
  lastQuestionClicked: boolean;
  setLastQuestionClicked?: (value: boolean) => void;
  lastNumberClicked?: boolean;
}

const OngoingHeader: FC<OngoingHeaderProps> = ({
  setTimesUp,
  remainingTime,
  accessToken,
  showSkeleton,
  setFiveScsLeft,
  fiveScsLeft,
  setLastQuestionClicked,
  lastNumberClicked,
}) => {
  return (
    <div className={styles.timeAndAudioWrapper}>
      <div className={styles.audioWrapper}>
        <AudioPlayer audioSrc={'/audio/synthwave.mp4'} loop />
      </div>
      <div className={styles.timerWrapper}>
        <Timer
          setTimesUp={setTimesUp}
          // @ts-ignore
          remainingTime={isNaN(remainingTime) ? remainingTime : '20:00'}
          accessToken={accessToken}
          showSkeleton={showSkeleton}
          setFiveScsLeft={setFiveScsLeft}
          isFiveSecsLeft={
            remainingTime?.minutes === 0 && remainingTime?.seconds < 5
          }
          fiveScsLeft={fiveScsLeft}
          lastNumberClicked={lastNumberClicked}
          setLastQuestionClicked={setLastQuestionClicked}
        />
      </div>
    </div>
  );
};
export default OngoingHeader;
