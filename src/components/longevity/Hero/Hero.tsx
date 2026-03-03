import { FC } from 'react';
import { useRouter } from 'next/router';

import Heading from '@components/Heading';

import type { TRouter } from '@local-types/global';

import longevityData from '@data/longevity';

import styles from './Hero.module.scss';
import cn from 'classnames';

const Hero: FC = ({}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { mainTitle } = longevityData[locale];

  return (
    <section
      className={cn(styles.hero, {
        [styles.heroRu]: locale === 'ru',
      })}
    >
      <Heading text={mainTitle} />
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
