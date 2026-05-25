import { useRouter } from 'next/router';

import rawContent from './BaseRateFallacy.content';

import styles from './BaseRateFallacy.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.reviewList}>
        {c.negativeReviews.map(r => (
          <div key={r.author} className={styles.review}>
            <div className={styles.reviewStars}>
              {'★'.repeat(r.stars)}
              {'☆'.repeat(5 - r.stars)}
            </div>
            <div className={styles.reviewText}>{r.text}</div>
            <div className={styles.reviewAuthor}>{r.author}</div>
          </div>
        ))}
        <div className={styles.overallSmall}>{c.before.overallSmall}</div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.summary}>
        <div className={styles.summaryScore}>{c.after.summaryScore}</div>
        <div className={styles.summaryRight}>
          <div className={styles.summaryStars}>{c.after.summaryStars}</div>
          <div className={styles.summaryCount}>{c.after.summaryCount}</div>
          <div className={styles.barChart}>
            {c.after.bars.map(b => (
              <div key={b.stars} className={styles.barRow}>
                <span className={styles.barLabel}>{b.stars}★</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${b.pct}%` }}
                  />
                </div>
                <span className={styles.barPct}>{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.reviewList}>
        {c.negativeReviews.map(r => (
          <div key={r.author} className={styles.review}>
            <div className={styles.reviewStars}>
              {'★'.repeat(r.stars)}
              {'☆'.repeat(5 - r.stars)}
            </div>
            <div className={styles.reviewText}>{r.text}</div>
            <div className={styles.reviewAuthor}>{r.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
