import cn from 'classnames';
import useGlobals from '@hooks/useGlobals';
import { useRouter } from 'next/router';
import type { TRouter } from '@local-types/global';

import styles from './ArticleFooter.module.scss';

const ArticleFooter = () => {
  const { isDarkTheme, isFullScreen } = useGlobals()[1];
  const router = useRouter();
  const { locale } = router as TRouter;
  return (
    <footer
      className={cn(styles.articleFooter, {
        [styles.darkTheme]: isDarkTheme,
        [styles.hidden]: isFullScreen,
        [styles.russianView]: locale === 'ru',
      })}
    >
      <div className={styles.footerSection}>
        Copyright ©{' '}
        <span className="currentYear">2019 - {new Date().getFullYear()}</span>{' '}
        Wolf Alexanyan. Permission is granted to copy, distribute and/or modify
        this document under the terms of the{' '}
        <a
          className={styles.footerSectionLink}
          href="https://www.gnu.org/licenses/fdl-1.3.en.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          GNU Free Documentation License
        </a>
        , Version 1.3 or any later version published by the Free Software
        Foundation.
      </div>
    </footer>
  );
};

export default ArticleFooter;
