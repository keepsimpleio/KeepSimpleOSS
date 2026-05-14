import { useRouter } from 'next/router';
import { Fragment } from 'react';

import rawContent from './HardEasyEffect.content';

import styles from './HardEasyEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  const f = c.before.fields;
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.form}>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label>{f[0].label}</label>
            <input type="text" placeholder={f[0].placeholder} readOnly />
          </div>
          <div className={styles.field}>
            <label>{f[1].label}</label>
            <input type="text" placeholder={f[1].placeholder} readOnly />
          </div>
        </div>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label>{f[2].label}</label>
            <input type="text" placeholder={f[2].placeholder} readOnly />
          </div>
          <div className={styles.field}>
            <label>{f[3].label}</label>
            <select disabled>
              <option>{f[3].placeholder}</option>
            </select>
          </div>
        </div>
        <div className={styles.field}>
          <label>{f[4].label}</label>
          <input type="text" placeholder={f[4].placeholder} readOnly />
        </div>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label>{f[5].label}</label>
            <input type="text" placeholder={f[5].placeholder} readOnly />
          </div>
          <div className={styles.field}>
            <label>{f[6].label}</label>
            <input type="text" placeholder={f[6].placeholder} readOnly />
          </div>
        </div>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label>{f[7].label}</label>
            <input type="text" placeholder={f[7].placeholder} readOnly />
          </div>
          <div className={styles.field}>
            <label>{f[8].label}</label>
            <input type="text" placeholder={f[8].placeholder} readOnly />
          </div>
        </div>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label>{f[9].label}</label>
            <input type="text" placeholder={f[9].placeholder} readOnly />
          </div>
          <div className={styles.field}>
            <label>{f[10].label}</label>
            <input type="text" placeholder={f[10].placeholder} readOnly />
          </div>
        </div>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label>{f[11].label}</label>
            <select disabled>
              <option>{f[11].placeholder}</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>{f[12].label}</label>
            <input type="number" placeholder={f[12].placeholder} readOnly />
          </div>
        </div>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label>{f[13].label}</label>
            <input type="text" placeholder={f[13].placeholder} readOnly />
          </div>
          <div className={styles.field}>
            <label>{f[14].label}</label>
            <input type="text" placeholder={f[14].placeholder} readOnly />
          </div>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.before.cta}
        </button>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.progress}>
        {c.after.steps.map((step, i) => (
          <Fragment key={step.label}>
            {i > 0 && <div className={styles.stepLine} />}
            <div
              className={`${styles.step} ${step.done ? styles.done : ''} ${step.active ? styles.active : ''}`}
            >
              {step.label}
            </div>
          </Fragment>
        ))}
      </div>
      <div className={styles.stepCard}>
        <p className={styles.stepLabel}>{c.after.stepLabel}</p>
        <p className={styles.stepHint}>{c.after.stepHint}</p>
        {c.after.fields.map(field => (
          <div key={field.label} className={styles.field}>
            <label>
              {field.label} <span className={styles.tip}>{field.tip}</span>
            </label>
            <input type="text" placeholder={field.placeholder} readOnly />
          </div>
        ))}
        <div className={styles.actions}>
          <button className={styles.btn}>{c.after.back}</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            {c.after.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
