import Link from '@uxcore/components/NextLink';
import Tooltip from '@uxcore/components/Tooltip';
import { QuestionType, StrapiBiasType } from '@uxcore/local-types/data';
import cn from 'classnames';
import { FC } from 'react';

import RelatedQuestionTooltip from './RelatedQuestionTooltip';

import styles from './RelatedQuestion.module.scss';

type RelatedQuestionProps = {
  question: QuestionType;
  priority: 'high' | 'medium' | 'low';
  totalAppearing: number;
  relevancy: number;
  percentOfAppearing: number;
  relevantFor: StrapiBiasType[];
  locale: 'en' | 'ru' | 'hy';
};

const RelatedQuestion: FC<RelatedQuestionProps> = ({
  question,
  priority,
  totalAppearing,
  relevancy,
  percentOfAppearing,
  relevantFor,
}) => {
  const { number, title, slug } = question;

  return (
    <div className={styles.RelatedQuestionContainer}>
      <Tooltip
        isOnBottom
        content={
          <RelatedQuestionTooltip
            priority={priority}
            totalAppearing={totalAppearing}
            relevancy={relevancy}
            percentOfAppearing={percentOfAppearing}
            relevantFor={relevantFor}
          />
        }
      >
        <div className={styles.RelatedQuestion}>
          <div className={styles.Number}>#{number}.</div>
          <Link href={`/uxcg/${slug}`} target="_blank" legacyBehavior>
            <a target="_blank" className={styles.Text}>
              {title}
            </a>
          </Link>
        </div>
      </Tooltip>
      <div
        className={cn(styles.Priority, {
          [styles[priority]]: true,
        })}
      >
        <img
          src={`/assets/icons/priority-${priority}.svg`}
          alt="priority levels"
        />
      </div>
    </div>
  );
};

export default RelatedQuestion;
