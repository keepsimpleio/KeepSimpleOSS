import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import uxcpLocalization from '@uxcore/data/uxcp';

import styles from './QuestionTooltip.module.scss';

type QuestionTooltipProps = {
  priority: 'high' | 'medium' | 'low';
  relevancy: number;
  percentOfAppearing: number;
  totalAppearing: number;
};

const QuestionTooltip: FC<QuestionTooltipProps> = ({
  priority,
  relevancy,
  percentOfAppearing,
  totalAppearing,
}) => {
  const { locale } = useRouter() as TRouter;
  const {
    questionHighRelevancyText,
    questionMediumRelevancyText,
    questionLowRelevancyText,
    appearsIn1,
    appearsInPersonaRelatedQuestions,
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

  return (
    <div className={styles.QuestionTooltip}>
      <div className={styles.Row}>
        <div className={styles.Image}>
          <img src={`/assets/icons/priority-${priority}.svg`} />
        </div>
        <div className={styles.Text}>{priorityText}</div>
      </div>
      <div className={styles.Row}>
        <div className={styles.Image}>
          <img src={`/assets/icons/graph.svg`} />
        </div>
        <div className={styles.Text}>
          {appearsIn1}
          {percentOfAppearing}
          {appearsInPersonaRelatedQuestions}
          {relevancy}
          {appearsIn2}
          {totalAppearing}
          {appearsIn3}
        </div>
      </div>
    </div>
  );
};

export default QuestionTooltip;
