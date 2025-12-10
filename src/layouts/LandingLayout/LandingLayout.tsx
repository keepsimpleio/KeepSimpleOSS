import React, { FC, useEffect, useRef } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import Quote from '@components/Quote';
import UsedBy from '@components/UsedBy';
import OurTools from '@components/OurTools';
import Headline from '@components/Headline';
import Supporters from '@components/Supporters';
import ProgressBar from '@components/ProgressBar';
import SeoGenerator from '@components/SeoGenerator';
import AboutProjects from '@components/AboutProjects';
import ArticleFooter from '@components/ArticleFooter';

import useGlobals from '@hooks/useGlobals';
import { TRouter } from '@local-types/global';

import type { LandingLayoutTypes } from './LandingLayout.types';

import landingPage from '@data/landingPage';

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
            usedBy={homeData?.usedBy}
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
