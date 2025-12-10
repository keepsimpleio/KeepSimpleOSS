import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';

import ContentHandler from '@components/ContentHandler';
import SeoGenerator from '@components/SeoGenerator';
import Spinner from '@components/Spinner';
import Custom404 from '../404';

import HomeLayout from '@layouts/HomeLayout';

import {
  getArticleNewPaths,
  getArticles,
  getCurrentArticle,
} from '@api/strapi';

import { TArticle, TLocales, TPaths, TStaticProps } from '@local-types/data';

import pageNotFoundData from '@data/404';

import useGlobals from '@hooks/useGlobals';

import styles from './page.module.scss';

type ArticleProps = {
  data: TArticle;
  locale: TLocales;
};

const Article = ({ data, locale }: ArticleProps) => {
  const {
    seoDescription: description = '',
    seoTitle: title = '',
    keywords = [],
    pageTitle = '',
  } = data || {};

  const router = useRouter();
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const currentUrl = router.asPath;

  const articleRef = useRef<HTMLElement>(null);
  const [{ initUseGlobals, unmountUseGlobals }] = useGlobals();

  const [link, setLink] = useState(currentUrl);

  const ogTags = {
    ogDescription: data?.OGTags?.ogDescription,
    ogTitle: data?.OGTags?.ogTitle,
    ogType: data?.OGTags?.ogType,
    ogImageAlt: data?.OGTags?.ogImageAlt,
    ogImage: {
      data: {
        attributes: {
          url: data?.OGTags?.ogImage?.data?.attributes?.url,
          staticUrl: '/keepsimple_/assets/ogImages/Articles.png',
        },
      },
    },
  };
  useEffect(() => {
    const hash = currentUrl.split('?' || '#')[1];

    if (hash) {
      setLink('/');
    } else {
      setLink(currentUrl);
    }
  }, [currentUrl, link]);

  useEffect(() => {
    if (articleRef.current) {
      initUseGlobals(articleRef.current);

      return () => {
        unmountUseGlobals();
      };
    }
  }, [articleRef]);

  if (!Object.keys(data).length) {
    return <Custom404 intl={pageNotFoundData[locale]} locale={currentLocale} />;
  }

  return (
    <>
      <SeoGenerator
        strapiSEO={{ description, title, keywords, pageTitle }}
        ogTags={ogTags}
        createdDate={data.createdAt}
        modifiedDate={data.updatedAt}
      />
      <section ref={articleRef} className={styles.section}>
        <HomeLayout>
          <ContentHandler data={data} locale={locale} />
        </HomeLayout>
        <Spinner />
      </section>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const strapiPaths: TPaths[] = await getArticleNewPaths();

  return {
    paths: [...strapiPaths],
    fallback: 'blocking',
  };
};

export default Article;

export const getStaticProps: GetStaticProps = async ({
  params: { page },
  locale,
}: TStaticProps) => {
  const articles: TArticle[] = await getArticles(locale === 'ru' ? 'ru' : 'en');
  const article = page && getCurrentArticle(articles, page);

  if (!article) {
    return { notFound: true };
  }

  return {
    props: {
      data: article || {},
      locale,
    },
    revalidate: 10,
  };
};
