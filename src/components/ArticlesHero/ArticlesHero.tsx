import cn from 'classnames';
import { FC } from 'react';

import ArticleCategoryButton from '@components/ArticleCategoryButton';
import ContentParser from '@components/ContentParser';
import Heading from '@components/Heading';

import styles from './ArticlesHero.module.scss';

type ArticlesHeroProps = {
  title: string;
  description: string;
  categories?: any;
  isDarkTheme?: boolean;
  locale?: string;
  hasThoughtsArticles?: boolean;
  hasAIArticles?: boolean;
};
const ArticlesHero: FC<ArticlesHeroProps> = ({
  title,
  description,
  categories,
  isDarkTheme,
  locale,
  hasThoughtsArticles,
  hasAIArticles,
}) => {
  const visibleCategories = categories.filter(category => {
    if (category.tagId === 'Thoughts') return hasThoughtsArticles;
    if (category.tagId === 'AI') return hasAIArticles;
    return true;
  });

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
