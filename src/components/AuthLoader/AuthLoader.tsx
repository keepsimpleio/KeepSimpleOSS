import type { FC } from 'react';

import styles from './AuthLoader.module.scss';

/**
 * Full-screen cover for the auth round-trip (/auth, magic link, email change).
 * Those pages carry almost no markup, so without a cover the visitor watches a
 * bare document while the provider handshake runs. This paints the KeepSimple
 * paper surface over the whole viewport and runs the house brain loader on it,
 * so every entry point — keepsimple.io or UX Core — hands off the same way.
 */
const AuthLoader: FC = () => (
  <div className={styles.screen} role="status" aria-label="Loading">
    <span className={styles.brain}>
      <img src="/keepsimple_/assets/spinner/brain.svg" alt="" />
      <img src="/keepsimple_/assets/spinner/brain circle.svg" alt="" />
      <img src="/keepsimple_/assets/spinner/brain gears.svg" alt="" />
    </span>
  </div>
);

export default AuthLoader;
