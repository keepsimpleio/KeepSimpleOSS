import testResultData from '@uxcore/data/uxcat/testResult';
import { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import styles from './CalculatingResults.module.scss';

type ProgressItem = {
  isFilled: boolean;
  duration: number;
  showCheckmark: boolean;
  title?: string;
};

type CalculatingResultsProps = {
  setIsAnalyzingInProgress: (isAnalyzingInProgress: boolean) => void;
};
const CalculatingResults: FC<CalculatingResultsProps> = ({
  setIsAnalyzingInProgress,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;

  const {
    calculatingTitle,
    analyzingAnswers,
    consultingWithBob,
    recommendationTxt,
    achievementProgress,
  } = testResultData[locale];

  const [progress, setProgress] = useState<ProgressItem[]>([
    {
      title: analyzingAnswers,
      isFilled: false,
      duration: 0,
      showCheckmark: false,
    },
    {
      title: consultingWithBob,
      isFilled: false,
      duration: 0,
      showCheckmark: false,
    },
    {
      title: achievementProgress,
      isFilled: false,
      duration: 0,
      showCheckmark: false,
    },
    {
      title: recommendationTxt,
      isFilled: false,
      duration: 0,
      showCheckmark: false,
    },
  ]);
  const titles = [
    analyzingAnswers,
    consultingWithBob,
    achievementProgress,
    recommendationTxt,
  ];

  function generateRandomDurations(totalTime: number, count: number): number[] {
    const times = Array(count)
      .fill(0)
      .map(() => Math.random());
    const sum = times.reduce((a, b) => a + b);
    return times.map(time => (time / sum) * totalTime);
  }
  useEffect(() => {
    const updatedProgress = progress.map((item, index) => ({
      ...item,
      title: titles[index],
    }));
    setProgress(updatedProgress);
  }, [locale]);

  useEffect(() => {
    const randomDurations =
      progress && generateRandomDurations(8, progress.length);
    const progressWithDurations =
      progress &&
      progress.map((progressItem, index) => ({
        ...progressItem,
        duration: randomDurations[index] * 1000,
      }));

    setProgress(progressWithDurations);

    progressWithDurations.forEach((progressItem, index) => {
      setTimeout(
        () => {
          setProgress(prevProgress =>
            prevProgress.map((prevItem, i) =>
              i === index ? { ...prevItem, isFilled: true } : prevItem,
            ),
          );

          setTimeout(() => {
            setProgress(prevProgress =>
              prevProgress.map((prevItem, i) =>
                i === index ? { ...prevItem, showCheckmark: true } : prevItem,
              ),
            );

            if (index === progressWithDurations.length - 1) {
              setTimeout(() => {
                localStorage.removeItem('lastQuestionClicked');
                setIsAnalyzingInProgress(false);
              }, progressItem.duration);
            }
          }, progressItem.duration);
        },
        randomDurations
          .slice(0, index)
          .reduce((acc, current) => acc + current, 0) * 1000,
      );
    });
  }, []);

  return (
    <div className={styles.calculatingResults}>
      <div className={styles.loaderWrapper}>
        <span className={styles.title}>{calculatingTitle} </span>
        <div className={styles.loader}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={styles.info}>
        {progress.map((item, index) => (
          <div className={styles.progress} key={index}>
            <div className={styles.txtAndCheckmark}>
              <span className={styles.progressTxt}>{item.title}</span>
              {item.showCheckmark && (
                <span className={styles.checkmark}>✔</span>
              )}
            </div>

            <div className={styles.progressItem}>
              <div
                className={styles.progressBar}
                style={{
                  animationDuration: `${item.duration}ms`,
                  animationPlayState: item.isFilled ? 'running' : 'paused',
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatingResults;
