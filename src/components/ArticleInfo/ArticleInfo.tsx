import { FC, useContext } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import cn from 'classnames';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import styles from './ArticleInfo.module.scss';
import { useIsWidthLessThan } from '@hooks/useScreenSize';
import { GlobalContext } from '@components/Context/GlobalContext';
import { useRouter } from 'next/router';

type ArticleInfoProps = {
  title: string;
  description: string;
  bgImage: string;
  slug?: string;
  locale?: string;
  darkTheme: boolean;
};

const ArticleInfo: FC<ArticleInfoProps> = ({
  title,
  description,
  bgImage,
  slug,
  locale,
  darkTheme,
}) => {
  const router = useRouter();
  const { setShowLoader, videoRef } = useContext(GlobalContext);

  const titleLineCount = title.length > 26 ? 2 : 1;
  const descLineCount = titleLineCount === 2 ? 1 : 2;
  const oneLineDescription = description?.toString().length >= 32;
  const twoLineDescription = description?.toString().length >= 70;
  const isSmallScreen = useIsWidthLessThan(768);

  const descLineCountForDesc =
    descLineCount === 2 ? twoLineDescription : oneLineDescription;

  const handleClick = e => {
    e.preventDefault();
    flushSync(() => {
      setShowLoader(true);
    });
    requestAnimationFrame(() => {
      videoRef.current?.play();
    });

    setTimeout(() => {
      router.push(`/articles/${slug}`);
    }, 300);

    setTimeout(() => {
      videoRef.current?.pause();
      setShowLoader(false);
    }, 800);
  };

  return (
    <Link
      href={`/articles/${slug}`}
      onClick={e => {
        e.preventDefault();
        handleClick(e);
      }}
      rel="noopener noreferrer"
      className={cn(styles.articleInfoLink, {
        [styles.russianVersion]: locale === 'ru',
        [styles.darkTheme]: darkTheme,
      })}
      data-cy={'article-link'}
    >
      <div className={styles.articleInfo}>
        <div className={styles.imgWrapper}>
          <Image
            src={bgImage}
            width={264}
            height={154}
            alt={title}
            className={styles.img}
            unoptimized
          />
        </div>
        <div className={styles.titleAndDescription}>
          {title.length >= 56 && !isSmallScreen ? (
            <>
              <h3
                className={styles.h3}
                data-tooltip-id={title}
                style={
                  {
                    '--title-lines': title.length > 28 ? 2 : 1,
                  } as React.CSSProperties
                }
              >
                {title}
              </h3>
              <ReactTooltip
                id={title}
                place={'top'}
                className={cn(styles.tooltip, {
                  [styles.darkThemeTooltip]: darkTheme,
                })}
                opacity={1}
              >
                <span> {title}</span>
              </ReactTooltip>
            </>
          ) : (
            <h3
              className={styles.h3}
              style={
                {
                  '--title-lines': title.length > 28 ? 2 : 1,
                } as React.CSSProperties
              }
            >
              {title}
            </h3>
          )}
          <div
            // @ts-ignore
            style={{ '--desc-lines': descLineCount }}
            dangerouslySetInnerHTML={{ __html: description }}
            className={styles.p}
            data-tooltip-id={description}
          />
          {descLineCountForDesc && !isSmallScreen ? (
            <ReactTooltip
              opacity={1}
              id={description}
              place={'top'}
              className={cn(styles.tooltip, {
                [styles.darkThemeTooltip]: darkTheme,
              })}
            >
              <span
                dangerouslySetInnerHTML={{ __html: description }}
                className={styles.p}
              />
            </ReactTooltip>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default ArticleInfo;
