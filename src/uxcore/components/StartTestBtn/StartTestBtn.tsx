import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import uxcatData from '@uxcore/data/uxcat';

import Button from '@uxcore/components/Button';

type StartTestBtnProps = {
  ongoingTest: boolean;
  nextTestTime: number | null;
  handleOpenTest: () => void;
  className?: string;
  finalTestPermission?: boolean;
  isFinalTestInProgress?: boolean;
  isRegularTestBtn?: boolean;
  disabled?: boolean;
  buttonType: 'orange' | 'orange_outline';
  isButtonBig?: boolean;
  dataCy?: string;
};

const StartTestBtn: FC<StartTestBtnProps> = ({
  ongoingTest,
  nextTestTime,
  handleOpenTest,
  className,
  finalTestPermission,
  isFinalTestInProgress,
  isRegularTestBtn,
  disabled,
  buttonType,
  isButtonBig,
  dataCy,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const [nextTest, setNextTest] = useState('');
  const [isFinalTest, setIsFinalTest] = useState(false);

  const {
    startBtn,
    nextTestIn,
    minutesTxtShort,
    hoursTxtShort,
    secondsTxtShort,
    continueTest,
    finalTestTxt,
  } = uxcatData[locale];

  useEffect(() => {
    const updateTimeString = () => {
      const hourByMinutes = 60;
      const nextTestDate = new Date(nextTestTime);
      const currentDate = new Date();
      const differenceInMilliseconds =
        nextTestDate.getTime() - currentDate.getTime();
      if (differenceInMilliseconds < 0 || !nextTestTime) {
        setNextTest(startBtn);
        return;
      }

      const minutesTotal = Math.floor(
        differenceInMilliseconds / (1000 * hourByMinutes),
      );
      const hours = Math.floor(minutesTotal / hourByMinutes);
      const minutes = minutesTotal % hourByMinutes;
      const seconds = Math.floor(
        (differenceInMilliseconds / 1000) % hourByMinutes,
      );

      let newTimeString = '';
      if (hours > 0) {
        newTimeString += `${nextTestIn} ${hours} ${hoursTxtShort} ${minutes} ${minutesTxtShort}`;
      } else if (minutesTotal > 0) {
        newTimeString = `${nextTestIn} ${minutes} ${minutesTxtShort} ${seconds} ${secondsTxtShort}`;
      } else {
        newTimeString = `${nextTestIn} ${seconds} ${secondsTxtShort}`;
      }

      setNextTest(newTimeString.trim());
    };

    updateTimeString();

    const interval = setInterval(updateTimeString, 1000);
    return () => clearInterval(interval);
  }, [nextTestTime, locale]);

  const saveFinalTestPermission = () => {
    localStorage.setItem('finalTestPermission', 'true');
  };

  let buttonTxt = '';
  switch (true) {
    case !isRegularTestBtn && isFinalTestInProgress:
      buttonTxt = continueTest;
      break;
    case isFinalTestInProgress && isRegularTestBtn:
      buttonTxt = startBtn;
      break;
    case finalTestPermission && !!nextTestTime:
      buttonTxt = nextTest;
      break;
    case finalTestPermission:
      buttonTxt = finalTestTxt;
      break;
    case ongoingTest:
      buttonTxt = continueTest;
      break;
    default:
      buttonTxt = nextTest;
  }

  const handleButtonClick = () => {
    if (
      buttonTxt === continueTest ||
      buttonTxt === startBtn ||
      buttonTxt === finalTestTxt
    ) {
      handleOpenTest();
      setIsFinalTest(finalTestPermission && true);
    } else {
      // do nothing
    }
    finalTestPermission && saveFinalTestPermission();
  };

  useEffect(() => {
    if (isFinalTest) {
      localStorage.setItem('finalTestPermission', 'true');
    } else {
      localStorage.setItem('finalTestPermission', 'false');
    }
  }, [isFinalTest]);

  return (
    <Button
      dataCy={dataCy}
      label={buttonTxt}
      onClick={handleButtonClick}
      type={buttonType}
      className={className}
      disabled={disabled}
      isBig={isButtonBig}
    />
  );
};

export default StartTestBtn;
