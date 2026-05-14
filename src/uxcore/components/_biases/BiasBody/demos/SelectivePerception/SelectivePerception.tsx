import { useRouter } from 'next/router';

import rawContent from './SelectivePerception.content';

import styles from './SelectivePerception.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.toolbar}>
        {c.before.tools.map(tool => (
          <button key={tool.title} className={styles.tool} title={tool.title}>
            {tool.label}
          </button>
        ))}
        <div className={styles.divider} />
        {c.before.alignTools.map((tool, i) => (
          <button
            key={`${tool.title}-${i}`}
            className={styles.tool}
            title={tool.title}
          >
            {tool.label}
          </button>
        ))}
        <div className={styles.divider} />
        <button className={styles.toolMore}>{c.before.more}</button>
      </div>
      <div className={styles.editorBody}>
        <p className={styles.placeholder}>{c.placeholder}</p>
        <p className={styles.hint}>{c.before.hint}</p>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{c.title}</h4>
      <div className={styles.toolbar}>
        <button
          className={`${styles.tool} ${styles.toolBold}`}
          title={c.after.boldTitle}
        >
          <strong>B</strong>
        </button>
        <button
          className={`${styles.tool} ${styles.toolItalic}`}
          title={c.after.italicTitle}
        >
          <em>I</em>
        </button>
        <button
          className={`${styles.tool} ${styles.toolUnderline}`}
          title={c.after.underlineTitle}
        >
          <u>U</u>
        </button>
        <div className={styles.divider} />
        {c.after.alignTools.map((tool, i) => (
          <button
            key={`${tool.title}-${i}`}
            className={styles.tool}
            title={tool.title}
          >
            {tool.label}
          </button>
        ))}
        <div className={styles.divider} />
        <button className={styles.tool} title={c.after.bulletTitle}>
          {c.after.bulletLabel}
        </button>
        <div className={styles.divider} />
        <button className={styles.toolMore}>{c.after.more}</button>
      </div>
      <div className={styles.editorBody}>
        <p className={styles.placeholder}>{c.placeholder}</p>
        <p className={styles.hint}>{c.after.hint}</p>
      </div>
    </div>
  );
}
