import cn from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useRef } from 'react';

import { TRouter } from '@local-types/global';

import useGlobals from '@hooks/useGlobals';

import landingPage from '@data/landingPage';

import AboutProjects from '@components/AboutProjects';
import ArticleFooter from '@components/ArticleFooter';
import Headline from '@components/Headline';
import OurTools from '@components/OurTools';
import ProgressBar from '@components/ProgressBar';
import Quote from '@components/Quote';
import SeoGenerator from '@components/SeoGenerator';
import Supporters from '@components/Supporters';
import UsedBy from '@components/UsedBy';

import type { LandingLayoutTypes } from './LandingLayout.types';

import styles from './LandingLayout.module.scss';

type LandingLayoutProps = {
  children?: any;
  homeData?: LandingLayoutTypes;
  darkTheme?: boolean;
};

const LandingLayout: FC<LandingLayoutProps> = ({ homeData, darkTheme }) => {
  const {
    seoDescription: description = '',
    seoTitle: title = '',
    keywords = [],
    pageTitle = '',
  } = homeData?.pageSeo || {};
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const { ourTools, supportedBy, usedBy } = landingPage[currentLocale];

  const articleRef = useRef<HTMLElement>(null);

  const [{ initUseGlobals, unmountUseGlobals }] = useGlobals();

  useEffect(() => {
    initUseGlobals(articleRef.current);

    return () => {
      unmountUseGlobals();
    };
  }, []);

  return (
    <>
      <Head>
        <link
          rel="preload"
          as="image"
          href="/keepsimple_/assets/landingPage/landing-bg.webp"
          fetchPriority="high"
          type="image/webp"
        />
      </Head>
      <SeoGenerator
        strapiSEO={{ description, title, keywords, pageTitle }}
        ogTags={homeData?.OGTags}
        createdDate={homeData?.createdAt}
        modifiedDate={homeData?.updatedAt}
      />
      <ProgressBar />
      <section ref={articleRef} className={styles.main}>
        <Headline
          headline={homeData?.headline}
          darkTheme={darkTheme}
          russianView={locale === 'ru'}
        />
        <div
          className={cn(styles.mainSections, {
            [styles.darkTheme]: darkTheme,
            [styles.russianView]: locale === 'ru',
          })}
        >
          <Quote darkTheme={darkTheme} locale={locale} />
          <OurTools
            tools={homeData?.tools}
            darkTheme={darkTheme}
            title={ourTools}
            russianView={locale === 'ru'}
          />
          <UsedBy
            usedBy={homeData?.sliderImage}
            darkTheme={darkTheme}
            title={usedBy}
          />
          <Supporters
            supporters={homeData?.supporters}
            darkTheme={darkTheme}
            title={supportedBy}
          />
          <AboutProjects projects={homeData?.projects} darkTheme={darkTheme} />
          <ArticleFooter />
        </div>
      </section>
    </>
  );
};
export default LandingLayout;
