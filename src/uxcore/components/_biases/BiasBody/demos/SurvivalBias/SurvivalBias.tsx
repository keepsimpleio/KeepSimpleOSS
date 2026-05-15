import { useRouter } from 'next/router';

import rawContent from './SurvivalBias.content';

import styles from './SurvivalBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{c.title}</div>
      <div className={styles.cards}>
        {c.before.cards.map(card => (
          <div key={card.name} className={styles.card}>
            <div className={styles.companyName}>{card.name}</div>
            <div className={styles.metric}>
              <span className={styles.metricArrow}>&#8599;</span>
              {card.metric}
            </div>
            <div className={styles.quote}>&ldquo;{card.quote}&rdquo;</div>
          </div>
        ))}
      </div>
      <div className={styles.takeaway}>{c.before.takeaway}</div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{c.title}</div>
      <div className={styles.distRow}>
        {c.after.distribution.map(d => (
          <div key={d.label} className={styles.distItem}>
            <div className={styles.distBar}>
              <div
                className={styles.distFill}
                style={{ height: `${d.percent}%`, background: d.color }}
              />
            </div>
            <div className={styles.distPct}>{d.percent}%</div>
            <div className={styles.distLabel}>{d.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.honestSection}>
        <div className={styles.honestHead}>{c.after.honestTitle}</div>
        <div className={styles.honestBody}>{c.after.honestBody}</div>
      </div>
    </div>
  );
}
