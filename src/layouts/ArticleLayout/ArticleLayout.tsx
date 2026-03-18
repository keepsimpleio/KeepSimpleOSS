import cn from 'classnames';
import Image from 'next/image';
import React, { FC } from 'react';

import useGlobals from '@hooks/useGlobals';

import PinBlock from '@components/PinBlock';
import ProgressBar from '@components/ProgressBar';
import ScrollToTop from '@components/ScrollToTop';
import ZoomBlock from '@components/ZoomBlock';

import { ArticleLayoutProps } from './ArticleLayout.types';

import styles from './ArticleLayout.module.scss';

const ArticleLayout: FC<ArticleLayoutProps> = ({ children }) => {
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
          // unoptimized
          priority
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

      <PinBlock />
      <ZoomBlock />
      <ScrollToTop />
    </div>
  );
};

export default ArticleLayout;
