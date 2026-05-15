import LastTestResultIcon from '@uxcore/assets/icons/LastTestResultIcon';
import UXCatPageTitle from '@uxcore/components/UXCatPageTitle';
import statisticsData from '@uxcore/data/statistics';
import { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import { FC } from 'react';

import styles from './Statistics.module.scss';

type StatisticsProps = {
  statistics: any;
  lastTestExisted: boolean;
  isPrivateMode: boolean;
};

const Statistics: FC<StatisticsProps> = ({
  statistics,
  lastTestExisted,
  isPrivateMode,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const lang = locale === 'ru' ? '/ru' : '';
  const currentLang = locale === 'ru' ? 'ru' : 'en';
  const totalTestCount = statistics?.totalTestCount || 0;

  const averageCorrectAnswersPerTest =
    Math.floor(statistics?.allTest?.averageCorrectAnswersPerTest * 10) / 10;

  const averagePercentageCorrectPerTest =
    Math.floor(statistics?.allTest?.averagePercentageCorrectPerTest * 10) / 10;

  const averageCorrectAnswersOfLastTenTests = statistics?.lastTenTests
    ?.averageCorrectAnswersPerTest
    ? statistics?.lastTenTests?.averageCorrectAnswersPerTest
    : statistics?.lastNTests?.averageCorrectAnswersPerTest;

  const averagePercentageCorrectOfLastTenTests = statistics?.lastTenTests
    ?.averagePercentageCorrectPerTest
    ? statistics?.lastTenTests?.averagePercentageCorrectPerTest
    : statistics?.lastNTests?.averagePercentageCorrectPerTest;

  const lastNTestsCount = statistics?.lastNTestsCount || 10;
  const lastTenTestsCorrectAnswersEn = `Average correct answers in last ${lastNTestsCount} tests`;
  const lastTenTestsCorrectAnswersRu = `Среднее количество правильных ответов за последние ${lastNTestsCount} тестов`;

  const lastTenTestsCorrectAnswers =
    locale === 'ru'
      ? lastTenTestsCorrectAnswersRu
      : lastTenTestsCorrectAnswersEn;

  const {
    title,
    myStatistics,
    showLastTestResults,
    totalTestsTaken,
    averageCorrectAnswers,
  } = statisticsData[currentLang];

  const statisticsArray = [
    {
      title: totalTestsTaken,
      value: totalTestCount || 0,
    },
    {
      title: averageCorrectAnswers,
      value: averageCorrectAnswersPerTest || 0,
      percentage: `${averagePercentageCorrectPerTest.toFixed(1)}%`,
    },
    {
      title: lastTenTestsCorrectAnswers,
      value: averageCorrectAnswersOfLastTenTests || 0,
      percentage: `${averagePercentageCorrectOfLastTenTests}%`,
    },
  ];

  return (
    <div>
      <UXCatPageTitle
        title={isPrivateMode ? myStatistics : title}
        bigFont
        className={styles['mainTitle']}
      />
      <div className={styles.wrapper}>
        {lastTestExisted ? (
          <a href={`${lang}/uxcat/test-result`} className={styles.testResults}>
            <LastTestResultIcon />
            <span>{showLastTestResults}</span>
          </a>
        ) : (
          <span className={styles.testResultsDisabled}>
            <LastTestResultIcon />
            <span>{showLastTestResults}</span>
          </span>
        )}

        <div className={styles.statisticsWrapper}>
          {statisticsArray.map((item, index) => (
            <div key={index} className={styles.statisticsItem}>
              <h4 className={styles.title}>{item.title}</h4>
              <div className={styles.valueWrapper}>
                <span className={styles.value}>{item.value}</span>
                <span className={styles.percentage}>{item.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
