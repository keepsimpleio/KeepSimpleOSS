import { useRouter } from 'next/router';

import rawContent from './HotHandFallacy.content';

import styles from './HotHandFallacy.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.header}>{c.before.header}</div>
      <div className={styles.playerCard}>
        <div className={styles.rank}>{c.rank}</div>
        <div className={styles.playerInfo}>
          <div className={styles.playerName}>{c.playerName}</div>
          <div className={styles.playerMeta}>{c.playerMeta}</div>
        </div>
        <div className={styles.wins}>
          <div className={styles.winsNum}>{c.winsNum}</div>
          <div className={styles.winsLabel}>{c.before.winsLabel}</div>
        </div>
      </div>
      <div className={styles.statRow}>
        {c.before.stats.map(s => (
          <div key={s.lbl} className={styles.stat}>
            <div className={styles.statVal}>{s.val}</div>
            <div className={styles.statLbl}>{s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.fireBanner}>
        <span className={styles.flames}>&#128293;&#128293;&#128293;</span>
        <div className={styles.fireText}>{c.after.fireText}</div>
        <div className={styles.fireSub}>{c.after.fireSub}</div>
      </div>
      <div className={styles.playerCard}>
        <div className={`${styles.rank} ${styles.rankHot}`}>{c.rank}</div>
        <div className={styles.playerInfo}>
          <div className={styles.playerName}>{c.playerName}</div>
          <div className={styles.playerMeta}>{c.playerMeta}</div>
        </div>
        <div className={styles.wins}>
          <div className={`${styles.winsNum} ${styles.winsHot}`}>
            {c.winsNum}
          </div>
          <div className={styles.winsLabel}>{c.after.winsLabel}</div>
        </div>
      </div>
      <div className={styles.bonusBanner}>
        <span className={styles.bonusIcon}>&#9889;</span>
        <div>
          <div className={styles.bonusTitle}>{c.after.bonusTitle}</div>
          <div className={styles.bonusSub}>{c.after.bonusSub}</div>
        </div>
      </div>
    </div>
  );
}
