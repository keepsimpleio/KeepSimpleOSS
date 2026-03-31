import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import { TArticle, TLocales, TPaths, TStaticProps } from '@local-types/data';

import useGlobals from '@hooks/useGlobals';

import {
  getArticleNewPaths,
  getArticles,
  getCurrentArticle,
  getRecommendedArticles,
} from '@api/strapi';

import pageNotFoundData from '@data/404';

import ArticleSection from '@components/ArticleSection';
import ContentHandler from '@components/ContentHandler';
import SeoGenerator from '@components/SeoGenerator';
import Spinner from '@components/Spinner';

import ArticleLayout from '@layouts/ArticleLayout';

import Custom404 from '../404';

import styles from './page.module.scss';

const HY_NOINDEX_SLUGS = [
  'table-of-contents',
  'why-study-management',
  'what-is-a-project',
  'project-artifacts-and-their-importance',
];

type ArticleProps = {
  data: TArticle;
  locale: TLocales;
  recommendedArticles: any[];
  hyNoIndex?: boolean;
  canonicalUrl?: string;
};

const Article = ({
  data,
  locale,
  recommendedArticles,
  hyNoIndex,
  canonicalUrl,
}: ArticleProps) => {
  const {
    seoDescription: description = '',
    seoTitle: title = '',
    keywords = [],
    pageTitle = '',
  } = data || {};

  const router = useRouter();
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const currentUrl = router.asPath;
  const [{}, { isDarkTheme }] = useGlobals();

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
        type={'Article'}
        ogTags={ogTags}
        createdDate={data.createdAt}
        modifiedDate={data.updatedAt}
        forceNoIndex={hyNoIndex}
        canonicalOverride={canonicalUrl}
      />
      <section ref={articleRef} className={styles.section}>
        <ArticleLayout>
          <ContentHandler data={data} locale={locale} />
        </ArticleLayout>
        {recommendedArticles?.length > 0 && (
          <ArticleSection
            isRecommended
            isFeatured={false}
            articles={recommendedArticles}
            title={
              locale === 'ru' ? 'Рекомендуемые статьи' : 'Recommended articles'
            }
            locale={locale}
            darkTheme={isDarkTheme}
          />
        )}
        {data?.footerImage?.data?.attributes?.url && (
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI}${data?.footerImage?.data?.attributes?.url}`}
            alt={data?.footerImage?.data?.attributes?.name}
            height={160}
            className={styles.footerImage}
            width={1920}
          />
        )}
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

  const recommendedArticles = getRecommendedArticles(articles, page);

  const hyNoIndex = locale === 'hy' && HY_NOINDEX_SLUGS.includes(page);
  const domain = process.env.NEXT_PUBLIC_DOMAIN ?? 'https://keepsimple.io';

  return {
    props: {
      data: article || {},
      locale,
      recommendedArticles,
      ...(hyNoIndex && {
        hyNoIndex: true,
        canonicalUrl: `${domain}/articles/${page}`,
      }),
    },
    revalidate: 10,
  };
};
