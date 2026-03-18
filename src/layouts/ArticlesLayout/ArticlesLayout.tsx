import cn from 'classnames';
import React, { FC, useEffect, useRef } from 'react';

import useGlobals from '@hooks/useGlobals';

import ArticleSection from '@components/ArticleSection';
import ArticlesHero from '@components/ArticlesHero';

import styles from './ArticlesLayout.module.scss';

type ArticlesProps = {
  description: string;
  title: string;
  articles?: any;
  categories: any;
  groupedArticles: any;
  featuredArticles: any;
  locale: string;
  isDarkTheme?: boolean;
  hasThoughtsArticles?: boolean;
};

const ArticlesLayout: FC<ArticlesProps> = ({
  description,
  title,
  categories,
  groupedArticles,
  featuredArticles,
  locale,
  isDarkTheme,
  hasThoughtsArticles,
}) => {
  const articleRef = useRef<HTMLElement>(null);

  const [{ initUseGlobals, unmountUseGlobals }] = useGlobals();

  useEffect(() => {
    initUseGlobals(articleRef.current);

    return () => {
      unmountUseGlobals();
    };
  }, []);

  return (
    <main className={styles.article} ref={articleRef}>
      <ArticlesHero
        description={description}
        title={title}
        categories={categories}
        isDarkTheme={isDarkTheme}
        locale={locale}
        hasThoughtsArticles={hasThoughtsArticles}
      />
      <div
        className={cn(styles.mainContent, {
          [styles.darkTheme]: isDarkTheme,
        })}
      >
        <ArticleSection
          isFeatured
          articles={featuredArticles}
          title={locale === 'ru' ? 'Рекомендуемые' : 'Featured'}
          locale={locale}
          darkTheme={isDarkTheme}
        />
        {groupedArticles.map((article, index) => (
          <ArticleSection
            key={index}
            isFeatured={false}
            articles={article.articles}
            title={article.category}
            ref={article.ref}
            locale={locale}
            darkTheme={isDarkTheme}
          />
        ))}
      </div>
    </main>
  );
};
export default ArticlesLayout;
