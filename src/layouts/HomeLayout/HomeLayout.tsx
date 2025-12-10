import React, { FC } from 'react';
import cn from 'classnames';
import Image from 'next/image';

import useGlobals from '@hooks/useGlobals';

import ProgressBar from '@components/ProgressBar';
import ZoomBlock from '@components/ZoomBlock';
import PinBlock from '@components/PinBlock';

import styles from './HomeLayout.module.scss';

type THomeLayout = {
  children?: any;
};

const HomeLayout: FC<THomeLayout> = ({ children }) => {
  const [{}, { isFullScreen, isDarkTheme }] = useGlobals();

  return (
    <div
      className={cn({
        [styles.darkBg]: isDarkTheme,
      })}
    >
      <ProgressBar />
      {children?.props?.data?.coverImage?.data?.attributes?.url && (
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI}${children?.props?.data?.coverImage?.data?.attributes?.url}`}
          alt={children?.props?.data?.coverImage?.data?.attributes?.name}
          height={314}
          className={styles.coverImage}
          width={1920}
          unoptimized
        />
      )}
      <main className={styles.main}>
        <article
          className={cn(styles.article, {
            [styles.fullscreen]: isFullScreen,
            [styles.darkTheme]: isDarkTheme,
          })}
        >
          <section className={styles.section}>{children}</section>
        </article>
      </main>
      {children?.props?.data?.footerImage?.data?.attributes?.url && (
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI}${children?.props?.data?.footerImage?.data?.attributes?.url}`}
          alt={children?.props?.data?.footerImage?.data?.attributes?.name}
          height={160}
          className={styles.footerImage}
          width={1920}
        />
      )}
      <PinBlock />
      <ZoomBlock />
    </div>
  );
};

export default HomeLayout;
