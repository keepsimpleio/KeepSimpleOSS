import cn from 'classnames';
import Link from 'next/link';
import { FC } from 'react';

import useMobile from '@uxcore/hooks/useMobile';

import biasPopupIntl from '@uxcore/data/biasPopup';

import ContentParser from '@uxcore/components/ContentParser';

import UxCoreStyle from '../../UXCoreModal/UXCoreModal.module.scss';
import styles from './BiasPopupContent.module.scss';

interface BiasPopupContentProps {
  title?: string;
  locale: 'en' | 'ru' | 'hy';
  description: string;
  customTip?: string;
  onClose?: () => void;
  slug?: string;
  number?: number;
}

const BiasPopupContent: FC<BiasPopupContentProps> = ({
  title,
  locale,
  description,
  customTip,
  onClose,
  slug,
}) => {
  const { isMobile } = useMobile()[1];
  const { text, tip } = biasPopupIntl[locale];

  return (
    <div
      className={cn(styles.BiasPopupContent, {
        [styles.Mobile]: !!isMobile,
      })}
    >
      {!!isMobile && <div className={styles.Title}>{title}</div>}
      <div className={styles.Description}>
        <ContentParser data={description} styles={UxCoreStyle} />
      </div>
      <div
        className={cn(styles.LinkSection, {
          [styles.LinkSectionHy]: locale === 'hy',
        })}
      >
        {!customTip && (
          <Link href={`/uxcore/${slug}`} legacyBehavior>
            <a target="_blank" data-cy={'open-bias'}>
              {text}
            </a>
          </Link>
        )}
        <div className={styles.Tip}>{customTip || `(${tip})`}</div>
        {!!isMobile && <div className={styles.CloseButton} onClick={onClose} />}
      </div>
    </div>
  );
};

export default BiasPopupContent;
