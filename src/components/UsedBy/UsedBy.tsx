import { FC } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import type { TRouter } from '@local-types/global';

import styles from './UsedBy.module.scss';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

type UsedByProps = {
  darkTheme?: boolean;
  title?: string;
  usedBy: {
    icon: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    name: string;
  }[];
};

const UsedBy: FC<UsedByProps> = ({ usedBy, darkTheme, title }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      className={cn(styles.usedBy, {
        [styles.darkTheme]: darkTheme,
        [styles.russianView]: locale === 'ru',
      })}
    >
      <h2
        className={cn(styles.title, {
          [styles.inViewTitle]: inView,
        })}
      >
        {title}
      </h2>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselTrack}>
          <div className={styles.usedByItem}>
            <Image
              width={1920}
              height={250}
              className={styles.img}
              src={
                darkTheme
                  ? '/keepsimple_/assets/logos-line-large-dark.png'
                  : '/keepsimple_/assets/logos-line-large.png'
              }
              alt={'Logos'}
            />
          </div>
          <div className={styles.usedByItem}>
            <Image
              height={250}
              width={1920}
              alt={'Logos'}
              className={styles.img}
              src={
                darkTheme
                  ? '/keepsimple_/assets/logos-line-large-dark.png'
                  : '/keepsimple_/assets/logos-line-large.png'
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsedBy;
