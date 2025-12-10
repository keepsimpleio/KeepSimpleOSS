import React, { FC, Fragment } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import type { GetStaticProps } from 'next';
import cn from 'classnames';

import pageNotFoundData from '@data/404';

import styles from '../styles/404.module.scss';

interface Custom404Props {
  intl: any;
  locale: 'en' | 'ru' | 'hy';
}

const Custom404: FC<Custom404Props> = ({ intl, locale }) => {
  const { title } = intl;
  const errorPage = process.env.NEXT_PUBLIC_DOMAIN + '/404';
  const errorPageImage =
    process.env.NEXT_PUBLIC_DOMAIN + '/keepsimple_/assets/favicon.svg';

  return (
    <Fragment>
      <Head>
        <meta name="robots" content={'index, follow'} />
        <title>Keepsimple | Error Page</title>
        <link rel="shortcut icon" href={'/keepsimple_/assets/favicon.svg'} />
        <meta name="description" content={'404 page - page not found'} />
        <meta name="keywords" content={'404 page - page not found'} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=2"
        />
        {/* GOOGLE */}
        <meta itemProp="name" content={'404 page'} />
        <meta itemProp="description" content={'404 page - page not found'} />

        {/* FACEBOOK */}
        <meta property="og:title" content={'404 page'} />
        <meta property="og:description" content={'404 page - page not found'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={errorPage} />
        <meta property="og:image" content={errorPageImage} />
      </Head>
      <section
        className={cn(styles.pageNotFound, {
          [styles.ruPageNotFound]: locale === 'ru',
        })}
      >
        <div className={styles.content}>
          <Image
            src={'/keepsimple_/assets/404.png'}
            alt={'404 page'}
            width={741}
            height={800}
            className={styles.image}
          />
          <h1 className={styles.title}> {title}</h1>
        </div>
      </section>
    </Fragment>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  // @ts-ignore
  const intl = pageNotFoundData[currentLocale];

  return {
    props: {
      intl,
      locale,
    },
  };
};

export default Custom404;
