import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';

import uxcpLocalization from '@uxcore/data/uxcp';

import styles from './RelatedQuestionTooltip.module.scss';

type RelatedQuestionTooltipProps = {
  priority: 'high' | 'medium' | 'low';
  totalAppearing: number;
  relevancy: number;
  percentOfAppearing: number;
  relevantFor: StrapiBiasType[];
};

const RelatedQuestionTooltip: FC<RelatedQuestionTooltipProps> = ({
  priority,
  totalAppearing,
  relevancy,
  percentOfAppearing,
  relevantFor,
}) => {
  const { locale } = useRouter() as TRouter;
  const {
    questionHighRelevancyText,
    questionMediumRelevancyText,
    questionLowRelevancyText,
    and,
    other,
    appearsIn1,
    appearsInSelectedBiases,
    appearsIn2,
    appearsIn3,
  } = uxcpLocalization[locale];

  const priorityText = useMemo(() => {
    switch (priority) {
      case 'high':
        return questionHighRelevancyText;
      case 'medium':
        return questionMediumRelevancyText;
      case 'low':
        return questionLowRelevancyText;
      default:
        return '';
    }
  }, [
    priority,
    questionHighRelevancyText,
    questionMediumRelevancyText,
    questionLowRelevancyText,
  ]);

  const { relatedBiases, remain } = useMemo(() => {
    const biases = relevantFor.map(({ number, title }) => ({
      number,
      title,
    }));

    return {
      relatedBiases: biases.sort().slice(0, 4),
      remain: biases.length > 4 ? biases.length - 4 : 0,
    };
  }, [relevantFor, locale]);

  return (
    <div className={styles.RelatedQuestionTooltip}>
      <div className={styles.Row}>
        <div className={styles.Image}>
          <img
            src={`/assets/icons/priority-${priority}.svg`}
            alt="priority levels"
          />
        </div>
        <div className={styles.Text}>{priorityText}</div>
      </div>
      <div className={styles.Row}>
        <div className={styles.Image}>
          <img src={`/assets/icons/graph.svg`} alt="graph" />
        </div>
        <div className={styles.Text}>
          {appearsIn1}
          {percentOfAppearing}
          {appearsInSelectedBiases}
          {relevancy}
          {appearsIn2}
          {totalAppearing}
          {appearsIn3}
        </div>
      </div>
      <div className={styles.BiasList}>
        {relatedBiases.map(({ number, title }) => (
          <div key={number} className={styles.Bias}>
            #{number} {title}
          </div>
        ))}
        {remain !== 0 && (
          <div
            className={styles.OtherBiases}
          >{`${and} ${remain} ${other}`}</div>
        )}
      </div>
    </div>
  );
};

export default RelatedQuestionTooltip;
