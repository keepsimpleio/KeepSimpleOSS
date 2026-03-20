import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';

import type { TRouter } from '@local-types/global';

import longevityData from '@data/longevity';

import { GlobalContext } from '@components/Context/GlobalContext';
import Heading from '@components/Heading';

import styles from './Hero.module.scss';

const Hero: FC = ({}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { mainTitle } = longevityData[locale];
  const { audioRef, isAudioPlaying, setIsAudioPlaying } =
    useContext(GlobalContext) || {};

  const handleTogglePlay = () => {
    if (!audioRef?.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  const getButtonLetterIdx = (title: string): number => {
    if (locale === 'ru') {
      const lastWord = title.split(' ').pop() ?? '';
      return title.length - lastWord.length + 1;
    }
    return title.length - 2;
  };

  const buttonLetterIdx = getButtonLetterIdx(mainTitle);
  const titleWithButton = (
    <>
      {mainTitle.slice(0, buttonLetterIdx)}
      <span className={styles.letterWithButton}>
        {mainTitle[buttonLetterIdx]}
        <button
          className={styles.playButton}
          onClick={handleTogglePlay}
          aria-label={isAudioPlaying ? 'Pause' : 'Play'}
        >
          <Image
            width={20}
            height={20}
            src={
              isAudioPlaying
                ? '/keepsimple_/assets/longevity/pause-button.svg'
                : '/keepsimple_/assets/longevity/play-button.svg'
            }
            alt={isAudioPlaying ? 'Pause' : 'Play'}
          />
        </button>
      </span>
      {mainTitle.slice(buttonLetterIdx + 1)}
    </>
  );

  return (
    <section
      className={cn(styles.hero, {
        [styles.heroRu]: locale === 'ru',
      })}
    >
      <Heading text={titleWithButton} />
      <Heading
        text={'BY WOLF ALEXANYAN'}
        Tag={'h2'}
        showRightIcon={false}
        showLeftIcon={false}
        className={styles.author}
      />
    </section>
  );
};

export default Hero;
