import { useRouter } from 'next/router';

import rawContent from './ImplicitStereotypes.content';

import styles from './ImplicitStereotypes.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.stage}>{c.stage}</div>
      <div className={styles.candidateCard}>
        <div className={styles.avatar}>{c.before.initials}</div>
        <div className={styles.identity}>
          <div className={styles.name}>{c.before.name}</div>
          <div className={styles.meta}>{c.before.meta}</div>
        </div>
      </div>
      <div className={styles.workSample}>
        <div className={styles.workLabel}>{c.workLabel}</div>
        <div className={styles.workBody}>{c.workSample}</div>
      </div>
      <div className={styles.metric}>
        <span>{c.callbackLabel}</span>
        <span className={styles.metricBad}>{c.before.callback}</span>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.stage}>{c.stage}</div>
      <div className={styles.candidateCard}>
        <div className={`${styles.avatar} ${styles.avatarBlur}`}>?</div>
        <div className={styles.identity}>
          <div className={`${styles.name} ${styles.nameMasked}`}>
            {c.after.maskName}
          </div>
          <div className={styles.meta}>{c.after.maskMeta}</div>
        </div>
      </div>
      <div className={styles.workSample}>
        <div className={styles.workLabel}>{c.workLabel}</div>
        <div className={styles.workBody}>{c.workSample}</div>
      </div>
      <div className={styles.toggle}>
        <span className={styles.toggleDot} />
        <span>{c.after.toggle}</span>
      </div>
      <div className={styles.metric}>
        <span>{c.callbackLabel}</span>
        <span className={styles.metricGood}>{c.after.callback}</span>
      </div>
    </div>
  );
}
