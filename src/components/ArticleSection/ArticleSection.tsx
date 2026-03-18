import cn from 'classnames';
import Image from 'next/image';
import React, { forwardRef, useState } from 'react';

import buttonText from '@data/buttonText';

import ArticleInfo from '@components/ArticleInfo';
import Heading from '@components/Heading';

import styles from './ArticleSection.module.scss';

type ArticleSectionProps = {
  isFeatured?: boolean;
  articles: any;
  title: string;
  ref?: React.RefObject<HTMLElement>;
  locale?: string;
  darkTheme?: boolean;
  isRecommended?: boolean;
};

// eslint-disable-next-line react/display-name
const ArticleSection = forwardRef<HTMLElement, ArticleSectionProps>(
  ({ isFeatured, articles, title, locale, darkTheme, isRecommended }, ref) => {
    const currentLocale = locale === 'ru' ? 'ru' : 'en';
    const isRecommendedOrFeatured = isRecommended || isFeatured;
    const [showAll, setShowAll] = useState(true);
    const visibleArticles = !showAll ? articles : articles.slice(0, 8);
    const { showMore, showLess } = buttonText[currentLocale];
    const buttonLineDark =
      locale === 'ru'
        ? '/keepsimple_/assets/articles-blog/dark-button-line-ru.svg'
        : '/keepsimple_/assets/articles-blog/dark-button-line.svg';
    const buttonLineLight =
      locale === 'ru'
        ? '/keepsimple_/assets/articles-blog/button-line-ru.svg'
        : '/keepsimple_/assets/articles-blog/button-line.svg';

    return (
      articles.length >= 1 && (
        <section
          className={cn(styles.articlesSection, {
            [styles.featured]: isFeatured && darkTheme,
            [styles.darkTheme]: darkTheme,
            [styles.recommended]: isRecommended,
          })}
          ref={ref}
        >
          {isRecommended && (
            <Image
              src={'/keepsimple_/assets/articles-blog/line.svg'}
              alt={'line'}
              width={1920}
              height={2}
              className={styles.underline}
            />
          )}
          <div className={styles.wrapper}>
            <Heading
              text={title}
              showLeftIcon={isFeatured}
              showRightIcon={false}
              Tag={'h2'}
              hasUnderline
              locale={locale}
              isDarkTheme={darkTheme}
            />
            <div className={styles.articlesWrapper}>
              {visibleArticles.map(article => (
                <ArticleInfo
                  darkTheme={darkTheme}
                  key={article.id}
                  title={article.title}
                  tags={article.tags}
                  description={article.shortDescription}
                  slug={article.newUrl}
                  locale={locale}
                  bgImage={
                    article?.coverImage
                      ? isRecommendedOrFeatured
                        ? `${process.env.NEXT_PUBLIC_STRAPI}${article?.coverImage.data.attributes.url}`
                        : `${process.env.NEXT_PUBLIC_STRAPI}${article?.coverImage?.url}`
                      : ''
                  }
                />
              ))}
            </div>
            {articles.length > 8 && (
              <div className={styles.showMoreButtonWrapper}>
                <button
                  data-cy="show more-less button"
                  className={cn(styles.showMore, {
                    [styles.showMoreRu]: locale === 'ru',
                  })}
                  onClick={() => setShowAll(prev => !prev)}
                >
                  {!showAll ? showLess : showMore}
                </button>
                <Image
                  src={darkTheme ? buttonLineDark : buttonLineLight}
                  alt={'line'}
                  width={130}
                  height={2}
                  className={cn(styles.buttonLine, {
                    [styles.darkButtonLine]: darkTheme,
                  })}
                />
              </div>
            )}
          </div>
        </section>
      )
    );
  },
);

export default ArticleSection;
