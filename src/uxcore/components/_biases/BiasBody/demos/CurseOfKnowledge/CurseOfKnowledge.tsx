import { useRouter } from 'next/router';

import rawContent from './CurseOfKnowledge.content';

import styles from './CurseOfKnowledge.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.before.title}</h4>
      <p className={styles.sub}>{c.before.sub}</p>
      <div className={styles.codeBlock}>
        {c.before.code.map(line => (
          <div key={line.key} className={styles.codeLine}>
            {line.indent && <span className={styles.indent} />}
            <span className={styles.key}>{line.key}</span>
            {line.val && (
              <>
                {' '}
                <span className={styles.val}>{line.val}</span>
              </>
            )}
          </div>
        ))}
      </div>
      <p className={styles.jargon}>{c.before.jargon}</p>
      <button className={styles.btnPrimary}>{c.before.cta}</button>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.after.title}</h4>
      <p className={styles.sub}>{c.after.sub}</p>
      <div className={styles.optionList}>
        <label className={`${styles.option} ${styles.optionSelected}`}>
          <input type="checkbox" defaultChecked readOnly />
          <span className={styles.optionIcon}>&#9654;</span>
          <div>
            <div className={styles.optionTitle}>{c.after.options[0].title}</div>
            <div className={styles.optionDesc}>{c.after.options[0].desc}</div>
          </div>
        </label>
        <label className={styles.option}>
          <input type="checkbox" readOnly />
          <span className={styles.optionIcon}>&#8686;</span>
          <div>
            <div className={styles.optionTitle}>{c.after.options[1].title}</div>
            <div className={styles.optionDesc}>{c.after.options[1].desc}</div>
          </div>
        </label>
        <label className={styles.option}>
          <input type="checkbox" readOnly />
          <span className={styles.optionIcon}>&#128274;</span>
          <div>
            <div className={styles.optionTitle}>{c.after.options[2].title}</div>
            <div className={styles.optionDesc}>{c.after.options[2].desc}</div>
          </div>
        </label>
      </div>
      <button className={styles.btnPrimary}>{c.after.cta}</button>
    </div>
  );
}
