import { FC } from 'react';

import Heading from '@components/Heading';

import { WhyDoThisTooltipProps } from './WhyDoThisTooltip.types';

import styles from './WhyDoThisTooltip.module.scss';
import Image from 'next/image';

const WhyDoThisTooltip: FC<WhyDoThisTooltipProps> = ({
  whatDamagesText,
  headline,
  locale,
}) => {
  // TODO: This is very temporary workaround for strapi data
  const looksLikeHtml = (s: string) => /<\/?[a-z][\s\S]*>/i.test(s);
  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const textToHtml = (input: string) => {
    let s = escapeHtml(input);

    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    const paragraphs = s
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(Boolean);

    return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('');
  };
  function RichText({ value }: { value?: string | null }) {
    if (!value) return null;

    const html = looksLikeHtml(value) ? value : textToHtml(value);

    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className={styles.content}
      />
    );
  }

  return (
    <div className={styles.whyDoThisTooltip}>
      <div>
        <Image
          src={'/keepsimple_/assets/longevity/habits/what-is-this-bg.webp'}
          alt="Background"
          width={700}
          height={300}
          priority
          className={styles.img}
        />
        {headline && (
          <Heading
            text={headline ? headline : ''}
            Tag={'h4'}
            showLeftIcon={false}
            showRightIcon={false}
            className={styles.heading}
          />
        )}
        <RichText value={whatDamagesText} />
      </div>
    </div>
  );
};
export default WhyDoThisTooltip;
