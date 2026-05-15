import { useRouter } from 'next/router';
import { useState } from 'react';

import rawContent from './ProcessingDifficulty.content';

import styles from './ProcessingDifficulty.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.icon}>!</div>
        <h4 className={styles.heading}>{c.before.heading}</h4>
        <p className={styles.body}>{c.before.body}</p>
        <div className={styles.actions}>
          <button className={styles.btn}>{c.before.cancel}</button>
          <button className={`${styles.btn} ${styles.btnDanger}`}>
            {c.before.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  const [typed, setTyped] = useState('');
  const confirmed = typed === c.after.confirmWord;

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.iconDanger}>&#9888;</div>
        <h4 className={styles.heading}>{c.after.heading}</h4>
        <div className={styles.impactBox}>
          {c.after.impact.map(row => (
            <div key={row.label} className={styles.impactRow}>
              <span className={styles.impactNum}>{row.num}</span>
              <span className={styles.impactLabel}>{row.label}</span>
            </div>
          ))}
        </div>
        <p className={styles.confirmLabel}>
          {c.after.confirmLabelPrefix} <strong>{c.after.confirmWord}</strong>{' '}
          {c.after.confirmLabelSuffix}
        </p>
        <input
          className={styles.confirmInput}
          type="text"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder={c.after.inputPlaceholder}
        />
        <div className={styles.actions}>
          <button className={styles.btn} onClick={() => setTyped('')}>
            {c.after.cancel}
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            disabled={!confirmed}
          >
            {c.after.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
