import { useRouter } from 'next/router';
import { useState } from 'react';

import rawContent from './IllusionOfTransparency.content';

import styles from './IllusionOfTransparency.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.form}>
        <div className={styles.field}>
          <label>{c.labels.webhookUrl}</label>
          <input
            type="text"
            placeholder={c.before.placeholders.webhookUrl}
            readOnly
          />
        </div>
        <div className={styles.field}>
          <label>{c.labels.authToken}</label>
          <input
            type="password"
            placeholder={c.before.placeholders.authToken}
            readOnly
          />
        </div>
        <div className={styles.field}>
          <label>{c.labels.retryPolicy}</label>
          <select disabled>
            <option>{c.before.retryOption}</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>{c.labels.timeout}</label>
          <input
            type="number"
            placeholder={c.before.placeholders.timeout}
            readOnly
          />
        </div>
        <div className={styles.field}>
          <label>{c.labels.eventFilter}</label>
          <input
            type="text"
            placeholder={c.before.placeholders.eventFilter}
            readOnly
          />
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.cta}
        </button>
      </div>
    </div>
  );
}

function HelpIcon({ tip, trigger }: { tip: string; trigger: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className={styles.helpWrap}>
      <button
        className={styles.helpIcon}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        type="button"
      >
        {trigger}
      </button>
      {open && <span className={styles.tooltip}>{tip}</span>}
    </span>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.form}>
        <div className={styles.field}>
          <label>
            {c.labels.webhookUrl}
            <HelpIcon tip={c.after.tips.webhookUrl} trigger={c.helpTrigger} />
          </label>
          <input
            type="text"
            placeholder={c.after.placeholders.webhookUrl}
            readOnly
          />
        </div>
        <div className={styles.field}>
          <label>
            {c.labels.authToken}
            <HelpIcon tip={c.after.tips.authToken} trigger={c.helpTrigger} />
          </label>
          <input
            type="password"
            placeholder={c.after.placeholders.authToken}
            readOnly
          />
        </div>
        <div className={styles.field}>
          <label>
            {c.labels.retryPolicy}
            <HelpIcon tip={c.after.tips.retryPolicy} trigger={c.helpTrigger} />
          </label>
          <select disabled>
            <option>{c.after.retryOption}</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>
            {c.labels.timeout}
            <HelpIcon tip={c.after.tips.timeout} trigger={c.helpTrigger} />
          </label>
          <input
            type="number"
            placeholder={c.after.placeholders.timeout}
            readOnly
          />
        </div>
        <div className={styles.field}>
          <label>
            {c.labels.eventFilter}
            <HelpIcon tip={c.after.tips.eventFilter} trigger={c.helpTrigger} />
          </label>
          <input
            type="text"
            placeholder={c.after.placeholders.eventFilter}
            readOnly
          />
        </div>
        <a className={styles.guideLink} href="#">
          {c.after.guideLink}
        </a>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          {c.cta}
        </button>
      </div>
    </div>
  );
}
