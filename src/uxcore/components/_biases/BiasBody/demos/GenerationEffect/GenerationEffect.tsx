import { useRouter } from 'next/router';

import rawContent from './GenerationEffect.content';

import styles from './GenerationEffect.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.badge}>{c.badge}</div>
      <div className={styles.card}>
        <div className={styles.cardLang}>{c.before.lang}</div>
        <div className={styles.cardWord}>{c.before.word}</div>
        <div className={styles.cardExample}>
          {c.before.exampleStart}
          <strong>{c.before.exampleBoldWord}</strong>
          {c.before.exampleEnd}
        </div>
      </div>
      <div className={styles.cardActions}>
        <button className={styles.btnWrong}>{c.before.btnWrong}</button>
        <button className={styles.btnRight}>{c.before.btnRight}</button>
      </div>
      <p className={styles.hint}>{c.before.hint}</p>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.badge}>{c.badge}</div>
      <div className={styles.card}>
        <div className={styles.cardLang}>{c.after.lang}</div>
        <div className={styles.cardWord}>{c.after.word}</div>
        <div className={styles.cardExample}>
          {c.after.exampleStart}
          <strong>{c.after.exampleBoldWord}</strong>
          {c.after.exampleEnd}
        </div>
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.answerInput}
          type="text"
          placeholder={c.after.inputPlaceholder}
          readOnly
        />
        <button className={styles.btnCheck}>{c.after.btnCheck}</button>
      </div>
      <p className={styles.hint}>{c.after.hint}</p>
    </div>
  );
}
