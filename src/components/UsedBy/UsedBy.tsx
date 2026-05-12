import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useInView } from 'react-intersection-observer';

import type { TRouter } from '@local-types/global';

import styles from './UsedBy.module.scss';

type StrapiImage = {
  data?: {
    attributes: {
      url: string;
    };
  };
};

type UsedByProps = {
  darkTheme?: boolean;
  title?: string;
  usedBy?: {
    dark_image?: StrapiImage;
    image?: StrapiImage;
  };
};

const UsedBy: FC<UsedByProps> = ({ usedBy, darkTheme, title }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI;
  const darkImageUrl = usedBy?.dark_image?.data?.attributes?.url;
  const imageUrl = usedBy?.image?.data?.attributes?.url;
  const src =
    darkTheme && darkImageUrl
      ? `${strapiUrl}${darkImageUrl}`
      : imageUrl
        ? `${strapiUrl}${imageUrl}`
        : '';

  if (!src) return null;

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
              src={src}
              alt={'Logos'}
            />
          </div>
          <div className={styles.usedByItem}>
            <Image
              height={250}
              width={1920}
              alt={'Logos'}
              className={styles.img}
              src={src}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsedBy;
