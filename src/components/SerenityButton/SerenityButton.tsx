import { FC } from 'react';
import Image from 'next/image';

import type { SerenityButtonProps } from './SerenityButton.types';

import AudioPlayer from '@components/AudioPlayer';

import styles from './SerenityButton.module.scss';

const SerenityButton: FC<SerenityButtonProps> = ({
  handleFadeOut,
  handleFadeIn,
  serenityText,
  exitSerenityText,
  serenityModeStatus,
}) => {
  return (
    <div
      onClick={!serenityModeStatus ? handleFadeOut : null}
      className={styles.serenity}
    >
      {serenityModeStatus ? (
        <AudioPlayer
          loop
          isSerenity
          className={styles.leaf}
          audioSrc={'/keepsimple_/assets/serenity.mp3'}
          playIcon={'/keepsimple_/assets/leaf.svg'}
          pauseIcon={'/keepsimple_/assets/leaf.svg'}
          startSerenityMode={serenityModeStatus}
        />
      ) : (
        <Image
          src={'/keepsimple_/assets/leaf.svg'}
          width={12}
          height={18}
          className={styles.leaf}
          alt="leaf"
        />
      )}
      <span
        className={styles.serenityBtn}
        onClick={serenityModeStatus ? handleFadeIn : null}
      >
        {serenityModeStatus ? exitSerenityText : serenityText}{' '}
      </span>
    </div>
  );
};

export default SerenityButton;
