import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useState } from 'react';

import { StrapiBiasType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';

import { mergeBiasesLocalization } from '@uxcore/lib/helpers';

import questionAnalyseData from '@data/uxcat/questionAnalyse';

import ContentParser from '@uxcore/components/ContentParser';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import Modal from '@uxcore/components/Modal';

import styles from './QuestionAnalyse.module.scss';

interface answers {
  isCorrect?: boolean;
  bodyEn?: string;
  bodyRu?: string;
  analysisBodyEn?: string;
  analysisBodyRu?: string;
}

type QuestionAnalyseProps = {
  setCloseModal: (closeModal: boolean) => void;
  extractFirstNumber?: (input: string) => void;
  biasNumber?: string;
  correctAnswerInfo?: {
    questionEn: string;
    questionRu: string;
    answers: answers[];
  };
};

const QuestionAnalyse: FC<QuestionAnalyseProps> = ({
  setCloseModal,
  biasNumber,
  correctAnswerInfo,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { uxCoreData } = useContext(GlobalContext);
  const prefixesEn = ['A) ', 'B) ', 'C) '];
  const prefixesRu = ['А) ', 'Б) ', 'В) '];
  const [biases, setBiases] = useState<StrapiBiasType[]>();
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const { analyseTxt, resultsTxt, descriptionLabel, questionLabel } =
    questionAnalyseData[currentLocale];
  const matchingBias = biases?.find(bias => bias.number === Number(biasNumber));
  const question =
    locale === 'ru'
      ? correctAnswerInfo?.questionRu
      : correctAnswerInfo?.questionEn;
  const descriptionEn = matchingBias?.descrEn;
  const descriptionRu = matchingBias?.descrRu;
  const description = locale === 'ru' ? descriptionRu : descriptionEn;

  const titleEn = matchingBias?.titleEn;
  const titleRu = matchingBias?.titleRu;
  const title = locale === 'ru' ? titleRu : titleEn;

  const handleClose = () => {
    setCloseModal(false);
  };

  useEffect(() => {
    if (uxCoreData) {
      setBiases(
        mergeBiasesLocalization(uxCoreData.en, uxCoreData.ru).sort(
          (a, b) => a.number - b.number,
        ),
      );
    }
  }, []);

  return (
    <Modal
      hasBorder
      onClick={handleClose}
      title={<span className={styles.title}>{`#${biasNumber} ${title}`}</span>}
      size="bob-modal"
      wrapperClassName={styles['modalWrapper']}
      bodyClassName={styles['modalBody']}
    >
      <div className={styles.bodyWrapper}>
        <div className={styles.description}>
          <label className={styles.label}>{descriptionLabel}</label>
          <ContentParser data={description} />
        </div>
        <label className={styles.label}> {questionLabel} </label>
        <legend className={styles.legend}>{question}</legend>
        <div className={styles.wrapper}>
          <span className={styles.answerResult}>{resultsTxt}</span>
          <div className={styles.answerWrapper}>
            <span className={styles.analyseTxt}> {analyseTxt}</span>
            {correctAnswerInfo.answers.map((answer, index) => {
              const prefix =
                locale === 'en' ? prefixesEn[index] : prefixesRu[index];
              return (
                <div key={index}>
                  <span
                    className={cn(styles.answer, {
                      [styles.isFalse]: !answer.isCorrect,
                    })}
                  >
                    {prefix} {locale === 'ru' ? answer.bodyRu : answer.bodyEn}
                  </span>
                  <p className={styles.analyze}>
                    {locale === 'ru'
                      ? answer.analysisBodyRu
                      : answer.analysisBodyEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuestionAnalyse;
