import { getAchievement } from '@uxcore/api/uxcat/get-achievement';
import { getUXCatSubmitTest } from '@uxcore/api/uxcat/submit-test';
import ArrowRight from '@uxcore/assets/icons/ArrowRight';
import Button from '@uxcore/components/Button';
import ContentParser from '@uxcore/components/ContentParser';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import OngoingAnswerLines from '@uxcore/components/OngoingAnswerLines';
import OngoingHeader from '@uxcore/components/OngoingHeader';
import Toasts from '@uxcore/components/Toasts';
import ongoingTestData from '@uxcore/data/uxcat/ongoingTest';
import { mergeBiasesLocalization } from '@uxcore/lib/helpers';
import { StrapiBiasType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import 'react-loading-skeleton/dist/skeleton.css';
import styles from './OngoingLayout.module.scss';

type OngoingProps = {
  startTest?: {
    testId: number;
    questions: {
      id: number;
      bodyEn: string;
      bodyRu: string;
      questionEn: string;
      questionRu: string;
      bias: number;
      isEaster: boolean;
      answers: {
        id: number;
        bodyEn: string;
        bodyRu: string;
      }[];
    }[];
  };
  remainingTime?: { hours: number; minutes: number; seconds: number };
  finalTestPermission?: boolean;
  accessToken?: string;
  userAchievements?: any;
  achievementSlugs?: any;
  testLength?: number;
};

const OngoingLayout: FC<OngoingProps> = ({
  startTest,
  remainingTime,
  finalTestPermission,
  accessToken,
  userAchievements,
  testLength,
  achievementSlugs,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submittedBiasNumber, setSubmittedBiasNumber] = useState<number | null>(
    null,
  );
  const [defaultDisabled, setDefaultDisabled] = useState(true);
  const [slideDown, setSlideDown] = useState(true);
  const [scaleAnimation, setScaleInAnimation] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [testResult, setTestResult] = useState<
    { isEaster: boolean } | undefined
  >();
  const [achievement, setAchievement] = useState(null);
  const [biasList, setBiasList] = useState<StrapiBiasType[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [achievementSlug, setAchievementSlug] = useState<string | null>(null);
  const [timesUp, setTimesUp] = useState(false);
  const [fiveScsLeft, setFiveScsLeft] = useState(false);
  const { uxCoreData } = useContext(GlobalContext);
  const [token, setToken] = useState(undefined);
  const [finishTestClicked, setFinishTestClicked] = useState(false);
  const [lastQuestionClicked, setLastQuestionClicked] = useState(false);
  const [fade, setFade] = useState(null);
  const [fadeAnswer, setFadeAnswer] = useState(null);
  // Ref (not state) so two rapid clicks/Enter presses can't both pass the
  // guard before a re-render lands.
  const isSubmittingRef = useRef(false);
  const [submitError, setSubmitError] = useState(false);

  const {
    title,
    nextQuestionTxt,
    finishTestTxt,
    containsAchievement,
    message,
    pickAnswer,
    skipQuestionTxt,
    submitFailed,
  } = ongoingTestData[currentLocale];

  const questionsLeft = startTest?.questions?.length;
  const currentQuestionNumber = testLength - questionsLeft;

  const testId = startTest?.testId;
  const questionId = startTest?.questions?.[currentQuestionIndex]?.id;
  const answerId =
    startTest?.questions[currentQuestionIndex]?.answers[selectedAnswer]?.id;
  const biasId = startTest?.questions[currentQuestionIndex]?.bias;

  const findMatchingBias = biasList?.find(bias => bias.number === biasId);
  const biasDescription =
    locale === 'ru' ? findMatchingBias?.descrRu : findMatchingBias?.descrEn;
  const biasTitle =
    locale === 'ru'
      ? startTest?.questions[currentQuestionIndex]?.bodyRu
      : startTest?.questions[currentQuestionIndex]?.bodyEn;

  const question =
    locale === 'ru'
      ? `${startTest?.questions[currentQuestionIndex]?.questionRu}`
      : `${startTest?.questions[currentQuestionIndex]?.questionEn}`;

  function underlineStandaloneNegation(text: string) {
    const negationWordRegex =
      locale === 'ru'
        ? /(?<!\p{L})не(?!\p{L})/giu
        : /(?<![A-Za-z])not(?![A-Za-z])/gi;

    const pieces: React.ReactNode[] = [];
    let cursor = 0;
    let match: RegExpExecArray | null;

    while ((match = negationWordRegex.exec(text)) !== null) {
      const startIndex = match.index;
      pieces.push(text.slice(cursor, startIndex));
      pieces.push(<u key={startIndex}>{match[0]}</u>);
      cursor = startIndex + match[0].length;
    }

    pieces.push(text.slice(cursor));
    return pieces;
  }

  const hasAchievement = startTest?.questions[currentQuestionIndex]?.isEaster;

  const prefixesEn = ['A ', 'B ', 'C '];
  const prefixesRu = ['А ', 'Б ', 'В '];

  const showSkeleton =
    isNaN(remainingTime?.hours) ||
    isNaN(remainingTime?.minutes) ||
    isNaN(remainingTime?.seconds);

  const handleAnswerSelection = (index: number) => {
    setSelectedAnswer(index);
    setDefaultDisabled(false);
  };

  useEffect(() => {
    setCurrentNumber(currentQuestionNumber + 1);
  }, [currentQuestionNumber]);

  const handleAnswerSubmit = () => {
    if (currentNumber < testLength) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentNumber(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  // Returns whether the answer actually reached the server; the caller must
  // not advance the test on a dropped request, or the answer is silently
  // lost and the score is wrong.
  const submittedAnswer = async (testId, questionId, answerId) => {
    const response = await getUXCatSubmitTest(
      testId,
      questionId,
      answerId,
      token,
    );
    if (!response) {
      return false;
    }
    setTestResult(response);
    if (currentNumber === testLength) {
      router.push('/uxcat/test-result');
    }
    return true;
  };

  const handleSubmit = () => {
    setFade(true);
    setTimeout(() => {
      setFade(false);
      handleButtonClick();
    }, 0);
  };

  const handleSkip = () => {
    setFade(true);
    setTimeout(() => {
      setFade(false);
      handleSkipButtonClick();
    }, 0);
  };

  const handleAnswerAnimation = () => {
    setFadeAnswer(true);
    setTimeout(() => {
      setFadeAnswer(false);
    }, 0);
  };

  useEffect(() => {
    const token =
      (typeof window !== undefined && localStorage.getItem('accessToken')) ||
      localStorage.getItem('googleToken');
    setToken(token);
  }, []);

  useEffect(() => {
    const biasNumber = 79;

    const hasSeriousAchievement = userAchievements?.some(
      achievement => achievement.name === 'SERIOUSLY',
    );

    const hasDiscountAchievement = userAchievements?.some(
      achievement => achievement.name === 'DISCOUNT_NEEDED',
    );

    if (submittedBiasNumber === biasNumber) {
      const hasEaster = testResult?.isEaster;

      if (hasEaster) {
        if (!hasSeriousAchievement) {
          setAchievementSlug('SERIOUSLY');
        }
      } else {
        if (!hasDiscountAchievement) {
          setAchievementSlug('DISCOUNT_NEEDED');
        }
      }
    }
  }, [submittedBiasNumber, userAchievements, testResult]);

  useEffect(() => {
    if (userAchievements && achievementSlugs) {
      const unmatchedAchievements = achievementSlugs.filter(
        achievementSlug =>
          !userAchievements.some(
            userAchievement => userAchievement.name === achievementSlug.name,
          ),
      );
      if (testResult?.isEaster) {
        const matchingNumberAchievement = unmatchedAchievements.find(
          achievement => achievement.number === submittedBiasNumber,
        );

        if (matchingNumberAchievement) {
          setAchievementSlug(matchingNumberAchievement.name);
        }
      }
    }
  }, [userAchievements, achievementSlugs, submittedBiasNumber, testResult]);

  useEffect(() => {
    if (achievementSlug) {
      const fetchAllAchievements = async () => {
        try {
          const getMatchingAchievement = await getAchievement(
            achievementSlug,
            locale,
          );
          setAchievement(getMatchingAchievement);
        } catch (error) {
          console.error('Error fetching achievements:', error);
        }
      };

      fetchAllAchievements().then(r => r);
    }
  }, [testResult, achievementSlug]);

  useEffect(() => {
    const fetchData = async () => {
      if (uxCoreData) {
        try {
          const result = mergeBiasesLocalization(
            uxCoreData?.en || {},
            uxCoreData?.ru || {},
          );
          setBiasList(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [uxCoreData]);

  useEffect(() => {
    if (timesUp !== true) {
      const handleBeforeUnload = e => {
        if (window.performance && performance.navigation.type === 1) {
          return;
        }

        const isLanguageChange = locale === 'ru';

        if (!isLanguageChange) {
          e.returnValue = message;
          return message;
        }
      };

      const handleRouteChangeStart = url => {
        const isOngoingPage =
          url.includes('/uxcat/ongoing') || url.includes('/ru/uxcat/ongoing');
        const isTestResultPage = url.includes('/uxcat/test-result');

        if (finishTestClicked && isTestResultPage) {
          setFinishTestClicked(false);
          return;
        }

        if (!isOngoingPage) {
          const confirmation = window.confirm(message);
          if (!confirmation) {
            router.events.emit('routeChangeError');
            throw 'Route change cancelled';
          }
        }
      };

      const handlePopState = () => {
        if (window.performance && performance.navigation.type === 1) {
          return;
        }

        const confirmation = window.confirm(message);
        if (!confirmation) {
          window.history.pushState(null, '', window.location.href);
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      router.events.on('routeChangeStart', handleRouteChangeStart);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
        router.events.off('routeChangeStart', handleRouteChangeStart);
      };
    }
  }, [router, locale, finishTestClicked, timesUp]);

  useEffect(() => {
    if (lastQuestionClicked) {
      localStorage.setItem('lastQuestionClicked', 'true');
    }
  }, [lastQuestionClicked]);

  const sendAnswer = async (submittedAnswerId: number) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmitError(false);

    if (fiveScsLeft && finishTestClicked) {
      const audio = new Audio('/audio/bomb.mp3');
      audio.play();
    }

    const delivered = await submittedAnswer(
      testId,
      questionId,
      submittedAnswerId,
    );
    isSubmittingRef.current = false;

    if (!delivered) {
      // Stay on the question and let the user retry.
      setSubmitError(true);
      setDefaultDisabled(false);
      return;
    }

    setLastQuestionClicked(currentNumber === testLength);
    handleAnswerSubmit();
    setSubmittedBiasNumber(findMatchingBias?.number);
    setFinishTestClicked(true);
  };

  const handleButtonClick = () => sendAnswer(answerId);

  const handleSkipButtonClick = () => sendAnswer(0);

  const handleScaleAnimation = () => {
    setScaleInAnimation(false);
    setTimeout(() => {
      setScaleInAnimation(true);
    }, 0);
  };

  useEffect(() => {
    const handleKeyPress = event => {
      // Mirror the Next button's disabled state, otherwise Enter submits
      // the same question twice before React clears the selection.
      if (
        event.key === 'Enter' &&
        selectedAnswer !== null &&
        !defaultDisabled
      ) {
        handleSubmit();
        handleAnswerAnimation();
        setDefaultDisabled(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedAnswer, defaultDisabled]);

  return (
    <div
      className={cn(styles.ongoing, {
        [styles.timesUp]: timesUp,
      })}
    >
      <OngoingHeader
        setTimesUp={setTimesUp}
        remainingTime={remainingTime}
        accessToken={accessToken}
        showSkeleton={showSkeleton}
        setFiveScsLeft={setFiveScsLeft}
        fiveScsLeft={fiveScsLeft}
        lastQuestionClicked={lastQuestionClicked}
        setLastQuestionClicked={setLastQuestionClicked}
        lastNumberClicked={lastQuestionClicked}
      />
      <div className={styles.questionWrapper}>
        <div className={styles.sectionHeader}>
          <OngoingAnswerLines
            testLength={testLength}
            currentNumber={currentNumber}
          />
          <div className={styles.titleWrapper}>
            <h1
              className={cn(styles.questionTxt, {
                [styles.fadeInQuestionTxt]: fade === false,
                [styles.fadeOutQuestionTxt]: fade,
              })}
            >
              {`${title} #${currentNumber ? currentNumber : ''}`}
            </h1>
            {hasAchievement && (
              <>
                <div data-tooltip-id={'1'}>
                  <Image
                    src={'/assets/icons/containsAchievement.svg'}
                    width={20}
                    height={20}
                    alt={'Contains achievement'}
                    unoptimized
                  />
                </div>
                <ReactTooltip
                  id={'1'}
                  opacity={1}
                  place={'top'}
                  className={styles.hasAchievement}
                >
                  <object className={styles.firstStar}>✨</object>
                  <label className={styles.txt}> {containsAchievement}</label>
                  <object className={styles.secondStar}>✨</object>
                </ReactTooltip>
              </>
            )}
          </div>
          {biasTitle ? (
            <div
              className={cn(styles.quizQuestion, {
                [styles.fadeInquizQuestion]:
                  fade === false && !lastQuestionClicked,
                [styles.fadeOutquizQuestion]: fade && !lastQuestionClicked,
              })}
            >
              <Image
                src={'/assets/uxcat/question-mark.svg'}
                alt={'Question mark'}
                width={24}
                height={24}
                className={styles.questionMark}
                unoptimized
              />
              <p className={styles.quizQuestionTxt}>
                {underlineStandaloneNegation(question)}
              </p>
            </div>
          ) : (
            <div className={styles.questionSkeleton}>
              <Skeleton count={1} width={200} className={styles.quizQuestion} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.questionAnswers}>
        <div className={styles.iconAndBias}>
          <div>
            <Image
              src={'/assets/uxcat/information-icon.svg'}
              alt={'Information Icon'}
              width={24}
              height={24}
              className={styles.infoIcon}
            />
          </div>

          <div className={styles.question}>
            {biasTitle ? (
              <h2
                className={cn(styles.biasTitle, {
                  [styles.fadeInBiasTitle]:
                    fade === false && currentNumber !== 10,
                  [styles.fadeOutBiasTitle]: fade && currentNumber !== 10,
                })}
              >
                {biasTitle}
              </h2>
            ) : (
              <Skeleton count={1} width={200} />
            )}
            {biasDescription ? (
              <div
                className={cn(styles.description, {
                  [styles.fadeInDescription]:
                    fade === false && !lastQuestionClicked,
                  [styles.fadeOutDescription]: fade && !lastQuestionClicked,
                })}
              >
                <ContentParser data={biasDescription} />
              </div>
            ) : (
              <Skeleton count={4} />
            )}
          </div>
        </div>
        {!!startTest ? (
          startTest.questions[currentQuestionIndex]?.answers.map(
            (answer, index) => {
              const prefix =
                locale === 'en' ? prefixesEn[index] : prefixesRu[index];
              const totalItems =
                startTest.questions[currentQuestionIndex]?.answers.length;
              return (
                <div
                  key={index}
                  className={cn(styles.answerWrapper, {
                    [styles.selected]: selectedAnswer === index,
                    [styles.slideDown]: slideDown && currentNumber !== 10,
                    [styles.scaleInAnimation]:
                      scaleAnimation && selectedAnswer === index,
                    [styles.fadeInAnswerWrapper]:
                      fadeAnswer === false && !lastQuestionClicked,
                    [styles.fadeOutAnswerWrapper]:
                      fadeAnswer && !lastQuestionClicked,
                  })}
                  style={{
                    animationDelay:
                      slideDown && `${(totalItems - 1 - index) * 0.3}s`,
                  }}
                >
                  <input
                    type="radio"
                    id={`answer_${index}`}
                    name="answer"
                    value={index}
                    onChange={() => handleAnswerSelection(index)}
                    onClick={() => {
                      handleScaleAnimation();
                      setSlideDown(false);
                      setFadeAnswer(null);
                    }}
                    checked={selectedAnswer === index}
                    className={styles.input}
                  />
                  <span className={styles.prefix}> {prefix}</span>
                  <label htmlFor={`answer_${index}`}>
                    {locale === 'ru' ? answer.bodyRu : answer.bodyEn}
                  </label>
                </div>
              );
            },
          )
        ) : (
          <Skeleton count={3} className={styles.skeleton} />
        )}
        {submitError && <p className={styles.submitError}>{submitFailed}</p>}
        <div className={styles.btnWrapper}>
          <Button
            isBig
            type={'blue_outline'}
            label={skipQuestionTxt}
            onClick={() => {
              handleSkip();
              setDefaultDisabled(true);
              handleAnswerAnimation();
            }}
          />
          <Button
            label={
              currentNumber === testLength ? finishTestTxt : nextQuestionTxt
            }
            hoveredLabel={pickAnswer}
            setIsHovered={setIsBtnHovered}
            isHovered={isBtnHovered}
            className={cn(styles['btn'], {
              [styles['btnRu']]: locale === 'ru',
            })}
            rightIcon={<ArrowRight />}
            rightIconClassName={styles['btnIcon']}
            type="primary"
            disabled={defaultDisabled}
            onClick={() => {
              handleSubmit();
              setDefaultDisabled(true);
              handleAnswerAnimation();
            }}
            isBig
          />
        </div>
      </div>
      {achievement && (
        <Toasts
          accessToken={accessToken}
          notificationsData={[achievement?.data]}
        />
      )}
    </div>
  );
};

export default OngoingLayout;
