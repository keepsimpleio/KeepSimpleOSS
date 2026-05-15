import Section from '@uxcore/components/Section';
import uxcpLocalization from '@uxcore/data/uxcp';
import useMobile from '@uxcore/hooks/useMobile';
import { SuggestedQuestionType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import Question from './Question';

import styles from './SuggestedQuestions.module.scss';

type SuggestedQuestionsProps = {
  suggestions: SuggestedQuestionType[];
  totalAppearing: number;
};

const SuggestedQuestions: FC<SuggestedQuestionsProps> = ({
  suggestions,
  totalAppearing,
}) => {
  const { isMobile } = useMobile()[1];

  const { locale } = useRouter() as TRouter;
  const { suggestedQuestionsTitle, suggestedQuestionsDescription, noData } =
    uxcpLocalization[locale];

  const sectionStyles = useMemo(() => {
    return {
      padding: isMobile ? '10px 12px 24px' : '10px 24px 24px',
      marginTop: 10,
    };
  }, [isMobile]);

  return (
    <Section style={sectionStyles}>
      <div className={styles.SectionTitle}>{suggestedQuestionsTitle}</div>
      <div className={styles.SectionDescription}>
        {suggestedQuestionsDescription}
      </div>
      <div className={styles.QuestionList}>
        {suggestions.length === 0 && (
          <div className={styles.NoData}>{noData}</div>
        )}
        {suggestions.slice(0, 10).map(question => (
          <Question
            key={question.number}
            question={question}
            totalAppearing={totalAppearing}
          />
        ))}
      </div>
    </Section>
  );
};

export default SuggestedQuestions;
