import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { FC, useRef } from 'react';

import type { TRouter } from '@local-types/global';

import { getArticleBlog } from '@api/articleBlog';

import articlesBlog from '@data/articlesBlog';

import SeoGenerator from '@components/SeoGenerator';

import ArticlesLayout from '@layouts/ArticlesLayout';

import useGlobals from '../hooks/useGlobals';

type ArticleProps = {
  articleBlog: {
    attributes: {
      title: string;
      description: string;
      createdAt: string;
      updatedAt: string;
      Seo: {
        pageTitle: string;
        keywords: string;
        seoDescription: string;
        seoTitle: string;
      };
      OGTags: {
        ogDescription: string;
        ogTitle: string;
        ogType: string;
        ogImageAlt?: string;
        ogImage?: {
          data: {
            attributes: {
              url: string;
            };
          };
        };
      };
      featuredArticles: {
        data: {
          attributes: {
            tags: {
              data: {
                attributes: {
                  title: string;
                };
              }[];
            };
            title: string;
            description: string;
            coverImage: {
              data: {
                attributes: {
                  url: string;
                };
              };
            };
          };
        }[];
      };
    };
    articles: {
      id: number;
      title: string;
      description: string;
      type: string;
      isFeatured: boolean;
    }[];
  };
};
const Articles: FC<ArticleProps> = ({ articleBlog }) => {
  const uxCoreRef = useRef<HTMLElement>(null);
  const aiRef = useRef<HTMLElement>(null);
  const thoughtsRef = useRef<HTMLElement>(null);
  const pmRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const { locale } = router as TRouter;
  const chosenLocale = locale === 'ru' ? 'ru' : 'en';
  const [{}, { isDarkTheme }] = useGlobals();

  const { uxcore, ai, thoughts, pm, thoughtsId, uxcoreId, aiId, pmId } =
    articlesBlog[chosenLocale];
  const { title, description } = articleBlog.attributes;
  const { pageTitle, keywords, seoDescription, seoTitle } =
    articleBlog.attributes.Seo;
  const featuredArticles = articleBlog.attributes.featuredArticles.data;
  const featured = featuredArticles.map(item => ({
    ...item.attributes,
    tags:
      item.attributes?.tags?.data?.map((tag: any) => tag.attributes) ??
      item.attributes?.tags ??
      [],
  }));

  const allArticles = articleBlog.articles;
  const categories = [
    { id: 1, name: uxcore, scrollToRef: uxCoreRef, tagId: uxcoreId },
    { id: 2, name: ai, scrollToRef: aiRef, tagId: aiId },
    { id: 3, name: thoughts, scrollToRef: thoughtsRef, tagId: thoughtsId },
    { id: 4, name: pm, scrollToRef: pmRef, tagId: pmId },
  ];

  const groupedArticles = categories.map(category => ({
    category: category.name,
    articles: allArticles.filter(article => article.type === category.tagId),
    ref: category.scrollToRef,
    tagId: category.tagId,
  }));

  const hasArticlesForTag = (tagId: string) =>
    groupedArticles.some(
      category =>
        category.tagId === tagId &&
        Array.isArray(category.articles) &&
        category.articles.length > 0,
    );

  const hasThoughtsArticles = hasArticlesForTag('Thoughts');
  const hasAIArticles = hasArticlesForTag('AI');

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: seoDescription,
          title: pageTitle,
          keywords,
          seoTitle,
        }}
        type={'CollectionPage'}
        ogTags={articleBlog.attributes?.OGTags}
        createdDate={articleBlog.attributes.createdAt}
        modifiedDate={articleBlog.attributes.updatedAt}
      />
      <ArticlesLayout
        title={title}
        hasThoughtsArticles={hasThoughtsArticles}
        hasAIArticles={hasAIArticles}
        categories={categories}
        description={description}
        groupedArticles={groupedArticles}
        featuredArticles={featured}
        locale={locale}
        isDarkTheme={isDarkTheme}
      />
    </>
  );
};
export default Articles;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const articleBlog = await getArticleBlog(locale);

  return {
    props: {
      articleBlog,
    },
    revalidate: 10,
  };
};
