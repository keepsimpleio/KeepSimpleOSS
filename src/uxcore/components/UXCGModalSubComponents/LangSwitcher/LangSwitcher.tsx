import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import styles from './LangSwitcher.module.scss';

const LangSwitcher: FC = () => {
  const router = useRouter();
  const { locale, locales } = router as TRouter;

  return (
    <div className={styles.ModalLanguage}>
      {locale === 'en' ? (
        <Link
          shallow={false}
          href={router.asPath}
          locale={locales[1]}
          legacyBehavior
        >
          <a className={styles.LanguageTitle}>{locales[1]}</a>
        </Link>
      ) : (
        <Link shallow={false} href={router.asPath} locale={locales[0]}>
          <a className={styles.LanguageTitle}>{locales[0]}</a>
        </Link>
      )}
    </div>
  );
};

export default LangSwitcher;
