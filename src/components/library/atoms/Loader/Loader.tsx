import LibraryRune from '@components/library/atoms/LibraryRune';

import styles from './Loader.module.scss';

export function Loader() {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.status}>Loading</span>
      <div className={styles.constellation} aria-hidden="true">
        {Array.from('LIBRARY').map((initial, index) => (
          <div className={styles.rune} key={index}>
            <LibraryRune initial={initial} isOwner={index === 3} />
          </div>
        ))}
      </div>
    </div>
  );
}
