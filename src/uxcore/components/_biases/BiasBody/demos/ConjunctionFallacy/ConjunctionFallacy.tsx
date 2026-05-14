import { useRouter } from 'next/router';

import rawContent from './ConjunctionFallacy.content';

import styles from './ConjunctionFallacy.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.team}>
        {c.before.members.map(m => (
          <div key={m.name} className={styles.member}>
            <div className={styles.avatar}>{m.initials}</div>
            <div className={styles.name}>{m.name}</div>
            <div className={styles.role}>{m.role}</div>
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
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.team}>
        {c.after.members.map(m => (
          <div key={m.name} className={styles.memberCard}>
            <div className={styles.avatar}>{m.initials}</div>
            <div className={styles.info}>
              <div className={styles.name}>{m.name}</div>
              <div className={styles.bio}>{m.bio}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
