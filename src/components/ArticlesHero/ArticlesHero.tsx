import { FC } from 'react';
import cn from 'classnames';

import Heading from '@components/Heading';
import ArticleCategoryButton from '@components/ArticleCategoryButton';
import ContentParser from '@components/ContentParser';

import styles from './ArticlesHero.module.scss';

type ArticlesHeroProps = {
  title: string;
  description: string;
  categories?: any;
  isDarkTheme?: boolean;
  locale?: string;
  hasThoughtsArticles?: boolean;
};
const ArticlesHero: FC<ArticlesHeroProps> = ({
  title,
  description,
  categories,
  isDarkTheme,
  locale,
  hasThoughtsArticles,
}) => {
  const visibleCategories = hasThoughtsArticles
    ? categories
    : categories.filter(category => category.tagId !== 'Thoughts');

  return (
    <section
      className={cn(styles.heroSection, {
        [styles.darkTheme]: isDarkTheme,
        [styles.russianVersion]: locale === 'ru',
      })}
    >
      <div className={styles.heroContent}>
        <Heading
          text={title}
          textAlign={'center'}
          className={styles.title}
          isDarkTheme={isDarkTheme}
          locale={locale}
        />
        <ContentParser data={description} styles={styles} />
        <div className={styles.categories}>
          {visibleCategories.map(category => (
            <ArticleCategoryButton
              key={category.name}
              text={category.name}
              scrollToRef={category.scrollToRef}
              locale={locale}
              darkTheme={isDarkTheme}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesHero;
