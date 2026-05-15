import cn from 'classnames';
import { FC } from 'react';

import styles from './OngoingAnswerLines.module.scss';

interface OngoingAnswerLinesProps {
  testLength: number;
  currentNumber: number;
}

const OngoingAnswerLines: FC<OngoingAnswerLinesProps> = ({
  testLength,
  currentNumber,
}) => {
  return (
    <div
      className={cn(styles.lines, {
        [styles.finalTestLines]: testLength === 30,
      })}
    >
      {Array.from({ length: testLength }, (_, index) => (
        <div
          key={index}
          className={cn(styles.line, {
            [styles.current]: index === currentNumber - 1,
            [styles.previous]: index < currentNumber - 1,
          })}
        ></div>
      ))}
    </div>
  );
};

export default OngoingAnswerLines;
