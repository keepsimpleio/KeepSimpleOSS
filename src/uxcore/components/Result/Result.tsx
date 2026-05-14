import cn from 'classnames';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import { getBiasNumber } from '@uxcore/lib/uxcat-helpers';

import BobIcon from '@icons/BobIcon';

import Tooltip from '@uxcore/components/Tooltip';

import styles from './Result.module.scss';

const QuestionAnalyse = dynamic(() => import('@uxcore/components/QuestionAnalyse'), {
  ssr: false,
});

interface QuestionTypes {
  bodyEn?: string;
  biasNumber?: number;
  bodyRu?: string;
  questionEn: string;
  questionRu: string;
  answers?: [];
  slugEn?: string;
  slugRu?: string;
}

type ResultProps = {
  correctQuestions: QuestionTypes[];
  incorrectQuestions: QuestionTypes[];
  failedQuestionsTxt: string;
  passedQuestionsTxt: string;
  clickMeTxt: string;
  betterLuckNextTimeTxt: string;
};

const Result: FC<ResultProps> = ({
  correctQuestions,
  incorrectQuestions,
  failedQuestionsTxt,
  passedQuestionsTxt,
  clickMeTxt,
  betterLuckNextTimeTxt,
}) => {
  const [openBobModal, setOpenBobModal] = useState(false);
  const [biasNumber, setBiasNumber] = useState<string>();
  const [correctAnswersInfo, setCorrectAnswersInfo] = useState<{
    questionEn: string;
    questionRu: string;
    answers: [];
  }>();
  const router = useRouter();
  const { locale } = router as TRouter;
  const urlLang = locale === 'ru' ? '/ru/' : '/';

  const openBobsModal = (
    number: string | '',
    answer: {
      questionEn: string;
      questionRu: string;
      answers: [];
    },
  ) => {
    setOpenBobModal(true);
    setBiasNumber(number);
    setCorrectAnswersInfo(answer);
  };

  /** Apply and show this to Wolf and Karen
   *   style={{
   *  '--random-delay': `${key}s`,
   *  '--play-state': 'paused',
   *  }}
   */

  return (
    <>
      <div className={styles.result}>
        <div className={styles.failedResult}>
          <div className={styles.titleWrapper}>
            <span className={styles.emoji}>❌</span>
            <h2 className={styles.title}> {failedQuestionsTxt} </h2>
          </div>
          {!!incorrectQuestions
            ? incorrectQuestions.map((question, key) => (
                <ul className={styles.resultList} key={key}>
                  <li className={cn(styles.list, styles.failed)}>
                    <a
                      className={styles.question}
                      // TODO - we have to add the slug here on the backend
                      href={`${urlLang}uxcore/${locale === 'ru' ? question.slugRu : question.slugEn} `}
                      target={'_blank'}
                    >
                      {locale === 'ru' ? question.bodyRu : question.bodyEn}
                    </a>
                  </li>
                </ul>
              ))
            : Array.from({ length: 5 }).map((_, key) => (
                <ul className={styles.resultList} key={key}>
                  <li className={cn(styles.list, styles.failed)}>
                    <span className={cn(styles.question, styles.skeleton)}>
                      {' '}
                    </span>
                  </li>
                </ul>
              ))}
        </div>
        <div className={styles.passedResult}>
          <div className={styles.titleWrapper}>
            <span className={styles.emoji}> ✅ </span>
            <h2 className={styles.title}> {passedQuestionsTxt} </h2>
          </div>
          {!!correctQuestions && correctQuestions.length === 0 ? (
            <div className={styles.ohTheDrama}>
              <span> 🥺 </span>
              <p> {betterLuckNextTimeTxt}</p>
            </div>
          ) : (
            correctQuestions?.map((question, key) => (
              <ul className={styles.resultList} key={key}>
                <li className={styles.list}>
                  <div
                    className={cn(styles.question, styles.correctQuestionHover)}
                    onClick={() => {
                      openBobsModal(question.biasNumber.toString(), {
                        questionEn: question.questionEn,
                        questionRu: question.questionRu,
                        answers: question.answers,
                      });
                    }}
                  >
                    <span>
                      {locale === 'ru' ? question.bodyRu : question.bodyEn}
                    </span>
                  </div>
                  <div
                    className={cn(styles.imgWrapper)}
                    onClick={() => {
                      openBobsModal(question.biasNumber.toString(), {
                        questionEn: question.questionEn,
                        questionRu: question.questionRu,
                        answers: question.answers,
                      });
                    }}
                  >
                    <Tooltip content={clickMeTxt}>
                      <div className={styles.bobIcon}>
                        <BobIcon />
                      </div>
                    </Tooltip>
                  </div>
                </li>
              </ul>
            ))
          )}

          {!correctQuestions &&
            Array.from({ length: 5 }).map((_, key) => (
              <ul className={styles.resultList} key={key}>
                <li className={styles.list}>
                  <span className={cn(styles.question, styles.skeleton)}>
                    {' '}
                  </span>
                </li>
              </ul>
            ))}
        </div>
      </div>
      {openBobModal && (
        <QuestionAnalyse
          setCloseModal={setOpenBobModal}
          biasNumber={biasNumber}
          correctAnswerInfo={correctAnswersInfo}
          extractFirstNumber={getBiasNumber}
        />
      )}
    </>
  );
};

export default Result;
