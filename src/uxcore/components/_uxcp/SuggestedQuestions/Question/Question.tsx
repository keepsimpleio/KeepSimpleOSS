import Link from '@uxcore/components/NextLink';
import Tooltip from '@uxcore/components/Tooltip';
import { SuggestedQuestionType } from '@uxcore/local-types/data';
import { FC } from 'react';

import QuestionTooltip from './QuestionTooltip';

import styles from './Question.module.scss';

type QuestionProps = {
  question: SuggestedQuestionType;
  totalAppearing: number;
};

const Question: FC<QuestionProps> = ({ question, totalAppearing }) => {
  const { relevancyTitle, title, number, relevancy, percentOfAppearing, slug } =
    question;

  return (
    <div className={styles.Question} data-cy={'suggested-question'}>
      <div className={styles.Priority}>
        <img src={`/assets/icons/priority-${relevancyTitle}.svg`} alt="" />
      </div>
      <div className={styles.Link}>
        <Tooltip
          isOnBottom
          content={
            <QuestionTooltip
              priority={relevancyTitle}
              totalAppearing={totalAppearing}
              relevancy={relevancy}
              percentOfAppearing={percentOfAppearing}
            />
          }
        >
          <Link href={`/uxcg/${slug}`} legacyBehavior>
            <a target="_blank">
              <span>
                #{number}. {title}
              </span>
            </a>
          </Link>
        </Tooltip>
      </div>
    </div>
  );
};

export default Question;
