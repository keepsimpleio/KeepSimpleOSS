import { useRouter } from 'next/router';

import rawContent from './HumorEffect.content';

import styles from './HumorEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.errorCode}>{c.before.errorCode}</div>
      <h4 className={styles.title}>{c.before.title}</h4>
      <p className={styles.body}>{c.before.body}</p>
      <a className={styles.linkBtn} href="#">
        {c.before.link}
      </a>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.illustration}>
        <div className={styles.character}>&#128123;</div>
        <div className={styles.trail}>&#183;&#183;&#183;</div>
      </div>
      <h4 className={styles.title}>{c.after.title}</h4>
      <p className={styles.body}>{c.after.body}</p>
      <div className={styles.suggestions}>
        {c.after.suggestions.map(s => (
          <a key={s.label} className={styles.suggestion} href="#">
            {s.icon} {s.label}
          </a>
        ))}
      </div>
      <a className={styles.linkBtnSoft} href="#">
        {c.after.link}
      </a>
    </div>
  );
}
