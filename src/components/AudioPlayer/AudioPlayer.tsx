import { FC, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import styles from './AudioPlayer.module.scss';

type AudioPlayerProps = {
  audioSrc: string;
  playIcon?: string;
  pauseIcon?: string;
  isCompanyManagementPage?: boolean;
  loop?: boolean;
  className?: string;
  isSerenity?: boolean;
  startSerenityMode?: boolean;
};

const AudioPlayer: FC<AudioPlayerProps> = ({
  audioSrc,
  playIcon = '/keepsimple_/assets/icons/start-audio.svg',
  pauseIcon = '/keepsimple_/assets/icons/pause-audio.svg',
  isCompanyManagementPage,
  loop,
  className,
  isSerenity,
  startSerenityMode,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleAutoPlay = async () => {
      try {
        if (startSerenityMode) {
          await audio.play();
          setIsPlaying(true);
        } else {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('Error in automatic play/pause:', error);
      }
    };

    handleAutoPlay();
  }, [startSerenityMode]);

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        loop={loop}
      ></audio>
      <button
        onClick={togglePlayPause}
        className={cn(styles.playBtn, {
          [styles.playing]: isPlaying,
          [styles.paused]: !isPlaying,
        })}
        data-cy={'audio-player'}
      >
        {isCompanyManagementPage ? (
          <>
            <div className={cn(styles.play, className)}>
              <div className={styles.animatedBorder}></div>
              <div className={styles.imgWrapper}>
                <Image
                  src={playIcon}
                  width={37}
                  height={37}
                  alt={playIcon}
                  data-cy={'pyramid-play-icon'}
                />
              </div>
            </div>
            <div className={cn(styles.pause, styles.pauseShadows)}>
              <Image
                src={pauseIcon}
                width={40}
                height={40}
                alt={'Pause icon'}
                data-cy={'pyramid-pause-icon'}
              />
            </div>
          </>
        ) : (
          <>
            <div className={cn(styles.play, className)}>
              <Image
                src={playIcon}
                width={isSerenity ? 12 : 34}
                height={isSerenity ? 18 : 34}
                alt={'Play icon'}
                data-cy="play-icon"
              />
            </div>
            <div className={cn(styles.pause, className)}>
              <Image
                src={pauseIcon}
                width={isSerenity ? 12 : 34}
                height={isSerenity ? 18 : 34}
                alt={'Pause icon'}
                data-cy={'pause-icon'}
              />
            </div>
          </>
        )}
      </button>
    </>
  );
};

export default AudioPlayer;
