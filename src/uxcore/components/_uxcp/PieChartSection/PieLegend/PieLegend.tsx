import { useRouter } from 'next/router';
import { FC, useCallback, useMemo } from 'react';

import type { TagType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';

import uxcpLocalization from '@data/uxcp';

import Tooltip from '@uxcore/components/Tooltip';

import styles from './PieLegend.module.scss';

type PieLegendProps = {
  tagRelevancy: { [key: string]: number };
  tags: TagType[];
};

const PieLegend: FC<PieLegendProps> = ({ tagRelevancy, tags }) => {
  const { locale } = useRouter() as TRouter;
  const { questionLabel, stage } = uxcpLocalization[locale];

  const isEng = locale === 'en';

  const getPostFix = useCallback(
    questionCount => {
      if (questionCount === 1) return '';
      const postFixes = {
        en: 's',
        ru: 'ов',
        hy: 'եր',
      };
      const postfix = postFixes[locale];

      return postfix;
    },
    [locale],
  );

  const data = useMemo(() => {
    return tags.map(({ title, id, tooltip }) => ({
      id,
      label: isEng ? `${title['en']} ${stage}` : title[locale],
      tooltip,
    }));
  }, [isEng]);

  return (
    <div className={styles.SectionLegend}>
      {data.map(({ label, id, tooltip }, index) => (
        <div key={index} className={styles.LegendRow}>
          <b>
            <Tooltip content={tooltip[locale]}>{label}</Tooltip>:
          </b>
          {` ${tagRelevancy[id]} ${questionLabel}${getPostFix(
            tagRelevancy[id],
          )}`}
        </div>
      ))}
    </div>
  );
};

export default PieLegend;
