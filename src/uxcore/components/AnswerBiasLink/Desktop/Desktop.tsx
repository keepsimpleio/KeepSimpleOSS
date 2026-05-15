import BiasPopupContent from '@uxcore/components/AnswerBiasLink/BiasPopupContent';
import Tooltip from '@uxcore/components/Tooltip';
import type { FC } from 'react';

interface DesktopProps {
  containerClassName: string;
  locale: 'en' | 'ru' | 'hy';
  description: string;
  number: number;
  linkClassName: string;
  text: string;
  slug: string;
}

const Desktop: FC<DesktopProps> = ({
  containerClassName,
  locale,
  description,
  number,
  linkClassName,
  text,
  slug,
}) => {
  return (
    <Tooltip
      isUnique
      clickable
      isOnBottom
      containerClassName={containerClassName}
      content={
        <BiasPopupContent
          locale={locale}
          description={description}
          number={number}
          slug={slug}
        />
      }
    >
      <span
        data-cy={'uxcg-bias'}
        className={linkClassName}
      >{`#${number} ${text}`}</span>
    </Tooltip>
  );
};

export default Desktop;
