import cn from 'classnames';
import Image from 'next/image';
import { FC } from 'react';

import { sanitizeHtml } from '@lib/sanitizeHtml';

import Heading from '@components/Heading';
import { FlipCardProps } from '@components/longevity/FlipCard/FlipCard.types';

import styles from './FlipCard.module.scss';

const FlipCard: FC<FlipCardProps> = ({
  headline,
  subText,
  chartTitle,
  chart,
  painText,
  hacksQuote,
  quoteAuthor,
  isHacks,
  chartWidth,
  locale,
}) => {
  return (
    <div
      className={cn(styles.flipCard, {
        [styles.hacksFlipCard]: isHacks,
        [styles.flipCardRu]: locale === 'ru',
        [styles.hacksFlipCardRu]: isHacks && locale === 'ru',
      })}
    >
      {isHacks ? (
        <div>
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(hacksQuote) }}
            className={styles.quote}
          />
          <span className={styles.separator}> - </span>
          <Heading
            text={quoteAuthor || ''}
            Tag="h4"
            className={styles.quoteAuthor}
            showRightIcon={false}
            showLeftIcon={false}
          />
        </div>
      ) : (
        <div className={styles.content}>
          <Heading
            text={headline || ''}
            Tag="h4"
            className={styles.headline}
            showRightIcon={false}
            showLeftIcon={false}
          />
          <span className={styles.subText}>{subText}</span>
          <div className={styles.chartWrapper}>
            <span className={styles.chartTitle}> {chartTitle} </span>
            {chart && !chart.includes('undefined') ? (
              <Image
                src={chart}
                alt={chartTitle ?? 'chart'}
                width={chartWidth || 590}
                height={455}
                className={styles.chart}
                unoptimized
              />
            ) : null}
          </div>
          <Image
            src={'/keepsimple_/assets/longevity/study/line.svg'}
            alt={'divider'}
            width={868}
            height={2}
            className={styles.divider}
          />
          <div className={styles.painTextWrapper}>
            <div className={styles.diamond} />
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(painText) }}
              className={styles.painText}
            />
            <div className={styles.diamond} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FlipCard;
