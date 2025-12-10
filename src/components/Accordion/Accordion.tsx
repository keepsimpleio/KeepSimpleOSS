import type { FC } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import ccordionIntl from '@data/accordion';

import type { TRouter } from '@local-types/global';

import useMobile from '@hooks/useMobile';

import styles from './Accordion.module.scss';

type AccordionProps = {
  dataId?: string | number;
  title: string;
  isOpen: boolean;
  file?: string;
  onToggleClick?: (e?: any) => void;
  isDarkTheme?: boolean;
  children?: any;
  isArticle?: boolean;
  className?: string;
};

const Accordion: FC<AccordionProps> = ({
  dataId,
  title,
  onToggleClick,
  isOpen,
  file,
  children,
  isDarkTheme,
  isArticle,
  className,
}) => {
  const router = useRouter();
  const { isMobile } = useMobile()[1];
  const { locale } = router as TRouter;
  const { downloadButtonLabel } = ccordionIntl[locale];

  const darkThemeIcon = isDarkTheme ? '-dark' : '';
  const downloadIcon = !!isMobile ? 'white' : 'blue';

  return (
    <div
      className={cn(styles.Accordion, className, {
        [styles.Opened]: isOpen,
        [styles.darkTheme]: isDarkTheme,
      })}
      data-cy="accordion"
    >
      <div
        data-id={dataId}
        className={styles.Title}
        onClick={isMobile ? null : onToggleClick}
        data-cy={'open-close-accordion-button'}
      >
        <img
          src={`/keepsimple_/assets/icons/caret${darkThemeIcon}.svg`}
          onClick={isMobile ? onToggleClick : null}
          alt="arrow down"
          width="7"
          height="12"
        />
        <span
          data-id={dataId}
          onClick={isMobile ? onToggleClick : null}
          className={cn(styles.Span, {
            [styles.articleTitle]: isArticle,
          })}
        >
          {title}
        </span>
        {file && (
          <a
            href={file}
            className={styles.DownloadButton}
            download
            onClick={e => e.stopPropagation()}
            target="_blank"
          >
            <img
              src={`/keepsimple_/assets/icons/download-${downloadIcon}.svg`}
              alt="download icon"
            />
            <span>{downloadButtonLabel}</span>
          </a>
        )}
      </div>
      <div className={styles.Content} data-cy={'accordion-content'}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
