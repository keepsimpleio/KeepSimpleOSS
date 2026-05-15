import Pagination from '@uxcore/components/_uxcp/Pagination';
import DynamicButton from '@uxcore/components/_uxcp/PersonaRelatedQuestions/DynamicButton';
import PriorityFilter from '@uxcore/components/_uxcp/PersonaRelatedQuestions/PriorityFilter';
import Section from '@uxcore/components/Section';
import uxcpLocalization from '@uxcore/data/uxcp';
import useMobile from '@uxcore/hooks/useMobile';
import type { RelevantQuestionType, TagType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo, useState } from 'react';

import RelatedQuestion from './RelatedQuestion';

import styles from './PersonaRelatedQuestions.module.scss';

type PersonaRelatedQuestionsProps = {
  stageIndex: number;
  relatedQuestions: RelevantQuestionType[];
  totalAppearing: number;
  tags: TagType[];
};

export type priorityLevel = 'all' | 'high' | 'medium' | 'low';

const itemsPerPage = 10;

const PersonaRelatedQuestions: FC<PersonaRelatedQuestionsProps> = ({
  stageIndex,
  relatedQuestions,
  totalAppearing,
  tags,
}) => {
  const { isMobile } = useMobile()[1];

  const { locale } = useRouter() as TRouter;
  const { personaRelatedQuestionsTitle, noData, pieChartPlaceholder } =
    uxcpLocalization[locale];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPriority, setSelectedPriority] =
    useState<priorityLevel>('all');
  const [hasUserOverridden, setHasUserOverridden] = useState(false);

  const defaultPriority = useMemo<priorityLevel>(() => {
    if (stageIndex === null) return 'all';

    const counts: Record<'high' | 'medium' | 'low', number> = {
      high: 0,
      medium: 0,
      low: 0,
    };
    relatedQuestions.forEach(({ tags, relevancyTitle }) => {
      if (tags.includes(stageIndex + 1)) counts[relevancyTitle] += 1;
    });

    if (counts.high + counts.medium + counts.low === 0) return 'all';
    if (counts.high >= counts.medium && counts.high >= counts.low)
      return 'high';
    if (counts.medium >= counts.low) return 'medium';
    return 'low';
  }, [relatedQuestions, stageIndex]);

  useEffect(() => {
    if (!hasUserOverridden) setSelectedPriority(defaultPriority);
  }, [defaultPriority, hasUserOverridden]);

  const handlePriorityChange = (priority: priorityLevel) => {
    setHasUserOverridden(true);
    setSelectedPriority(priority);
  };

  const filteredQuestions = useMemo(() => {
    if (stageIndex === null) return [];

    const filteredQuestions = relatedQuestions.filter(
      ({ tags, relevancyTitle }) => {
        const includesTag = tags.includes(stageIndex + 1);
        const matchesPriority =
          selectedPriority === 'all' || selectedPriority === relevancyTitle;

        return includesTag && matchesPriority;
      },
    );

    return filteredQuestions;
  }, [relatedQuestions, stageIndex, selectedPriority]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredQuestions.length / itemsPerPage);
  }, [filteredQuestions]);

  const visibleItems = useMemo(() => {
    return filteredQuestions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredQuestions, currentPage]);

  useEffect(() => {
    if (visibleItems.length === 0 && currentPage > 1) {
      setCurrentPage(prevState => prevState - 1);
    }
  }, [visibleItems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPriority]);

  return (
    <Section style={{ width: '100%', position: 'relative' }}>
      <div
        className={cn(styles.SectionTitle, {
          [styles.SectionTitleHy]: locale === 'hy',
        })}
      >
        <span>{personaRelatedQuestionsTitle}</span>
        {!isMobile && (
          <div className={styles.DynamicButtonWrapper}>
            <DynamicButton stageIndex={stageIndex} tags={tags} />
          </div>
        )}
      </div>
      <PriorityFilter
        selectedPriority={selectedPriority}
        onChange={handlePriorityChange}
      />
      {stageIndex !== null && (
        <>
          <div className={styles.Table}>
            {visibleItems.map(question => {
              const {
                relevantFor,
                relevancyTitle,
                relevancy,
                percentOfAppearing,
              } = question;

              return (
                <RelatedQuestion
                  locale={locale}
                  key={question.number}
                  question={question}
                  priority={relevancyTitle}
                  relevancy={relevancy}
                  percentOfAppearing={percentOfAppearing}
                  totalAppearing={totalAppearing}
                  relevantFor={relevantFor}
                />
              );
            })}
            {visibleItems.length === 0 && (
              <div className={styles.NoData}>
                <div>{noData}</div>
              </div>
            )}
          </div>
          {visibleItems.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          )}
        </>
      )}
      {stageIndex === null && (
        <div className={styles.Placeholder}>
          <Image
            src="/assets/icons/uxcp-arrow.svg"
            alt="arrows"
            width={79}
            height={19}
          />
          <div>{isMobile ? noData : pieChartPlaceholder}</div>
        </div>
      )}
    </Section>
  );
};

export default PersonaRelatedQuestions;
