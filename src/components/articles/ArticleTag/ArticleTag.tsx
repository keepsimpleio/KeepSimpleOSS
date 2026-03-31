import Image from 'next/image';
import { FC } from 'react';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import { ArticleTagBg } from '@icons/ArticleTagBg';
import ArticleTagBgMobile from '@icons/ArticleTagBgMobile';

import { ArticleTagProps } from './ArticleTag.types';

import styles from './ArticleTag.module.scss';

const TAG_COLORS: Record<string, string> = {
  Research: '#4F6B4F',
  Social: '#A65A3A',
  Career: '#2F3E5B',
  Oxford: '#C2A56B',
};

const DEFAULT_COLOR = '#4F6B4F';

export const ArticleTag: FC<ArticleTagProps> = ({ title }) => {
  const color = TAG_COLORS[title] ?? DEFAULT_COLOR;
  const isSmallScreen = useIsWidthLessThan(768);
  const isOxford = title === 'Oxford';

  return (
    <div className={styles.tag}>
      {isSmallScreen ? (
        <ArticleTagBgMobile className={styles.bgMobile} color={color} />
      ) : (
        <ArticleTagBg className={styles.bg} color={color} />
      )}
      {isOxford ? (
        <span className={styles.content}>
          <span className={`${styles.title} ${styles.titleOxford}`}>
            {title}
          </span>
          <span className={styles.oxfordIcon}>
            <Image
              src="/keepsimple_/assets/icons/oxford.svg"
              alt="Oxford icon"
              width={20}
              height={23}
            />
          </span>
        </span>
      ) : (
        <span className={styles.title}>{title}</span>
      )}
    </div>
  );
};
export default ArticleTag;
