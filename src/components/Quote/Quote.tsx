import { FC } from 'react';
import cn from 'classnames';
import { useInView } from 'react-intersection-observer';
import quote from '@data/quote';

import styles from './Quote.module.scss';

type QuoteProps = {
  darkTheme?: boolean;
  locale: string;
};

const Quote: FC<QuoteProps> = ({ darkTheme, locale }) => {
  const russianView = locale === 'ru';
  const { firstSentence, highlightedSentence, secondSentence } = quote[locale];

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 1,
  });

  return (
    <section
      ref={ref}
      className={cn(styles.quoteSection, {
        [styles.darkTheme]: darkTheme,
        [styles.russianView]: russianView,
        [styles.visible]: inView,
      })}
    >
      <p className={styles.quote}>
        {firstSentence}
        <span
          className={cn(styles.highlight, {
            [styles.inViewHighlight]: inView,
          })}
        >
          {inView && (
            <span
              className={cn(styles.square, {
                [styles.inViewSquare]: inView,
              })}
            />
          )}
          <span className={styles.quoteText}>{highlightedSentence}</span>
        </span>
        <span className={styles.lastNote}>{secondSentence}</span>
      </p>
    </section>
  );
};

export default Quote;
