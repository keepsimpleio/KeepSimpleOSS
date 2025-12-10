import React, { FC } from 'react';
import cn from 'classnames';

import styles from './ArticleCategoryButton.module.scss';

type ArticleCategoryButtonProps = {
  text: string;
  scrollToRef?: React.RefObject<HTMLElement>;
  locale?: string;
  darkTheme?: boolean;
};
const ArticleCategoryButton: FC<ArticleCategoryButtonProps> = ({
  text,
  scrollToRef,
  locale,
  darkTheme,
}) => {
  const handleClick = () => {
    if (!scrollToRef.current) return;

    const elementTop = scrollToRef.current.getBoundingClientRect().top;
    const offsetPosition = window.scrollY + elementTop - 48;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className={cn(styles.categoryButton, {
        [styles.russianVersion]: locale === 'ru',
        [styles.darkTheme]: darkTheme,
      })}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ArticleCategoryButton;
