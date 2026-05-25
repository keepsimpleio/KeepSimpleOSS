import type { FC } from 'react';

import type { StrapiBiasType } from '@uxcore/local-types/data';

import useMobile from '@uxcore/hooks/useMobile';

import Desktop from './Desktop';
import Mobile from './Mobile';

interface AnswerBiasLinkProps {
  locale: 'en' | 'ru' | 'hy';
  linkClassName: string;
  biasData: StrapiBiasType;
  containerClassName: string;
}

const AnswerBiasLink: FC<AnswerBiasLinkProps> = ({
  locale,
  linkClassName,
  biasData,
  containerClassName,
}) => {
  const { isMobile } = useMobile()[1];
  const { number, title, description, slug } = biasData;
  const text = title;

  const props = {
    containerClassName,
    locale,
    description,
    number,
    linkClassName,
    text,
    slug,
  };

  const Component = isMobile ? Mobile : Desktop;
  // @ts-ignore
  return <Component {...props} />;
};

export default AnswerBiasLink;
