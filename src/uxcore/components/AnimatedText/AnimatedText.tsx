import React, { FC, useEffect } from 'react';

import styles from './AnimatedText.module.scss';

type AnimatedTextProps = {
  text: string;
  delay?: number;
  codeIsActivated?: boolean;
};

const AnimatedText: FC<AnimatedTextProps> = ({ text, delay = 0 }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      decodeText();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay]);

  const decodeText = () => {
    const textElements = Array.from(
      document.getElementsByClassName(styles.textAnimation),
    );
    const state = textElements.map((_, i) => i);
    const shuffled = shuffle(state);

    shuffled.forEach(index => {
      const element = textElements[index];
      const state1Time = Math.round(Math.random() * (1500 - 300)) + 50;

      setTimeout(() => firstStages(element), state1Time);
    });
  };

  const firstStages = element => {
    if (element.classList.contains(styles.state2)) {
      element.classList.add(styles.state3);
    } else if (element.classList.contains(styles.state1)) {
      element.classList.add(styles.state2);
    } else {
      element.classList.add(styles.state1);
      setTimeout(() => secondStages(element), 65);
    }
  };

  const secondStages = element => {
    if (element.classList.contains(styles.state1)) {
      element.classList.add(styles.state2);
      setTimeout(() => thirdStages(element), 65);
    } else {
      element.classList.add(styles.state1);
    }
  };

  const thirdStages = element => {
    if (element.classList.contains(styles.state2)) {
      element.classList.add(styles.state3);
    }
  };

  const shuffle = array => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  return (
    <div className={styles.decodeText}>
      {!!text &&
        text.split('').map((char, index) =>
          char === ' ' ? (
            <div key={index} className={styles.space}></div>
          ) : (
            <div key={index} className={styles.textAnimation}>
              {char}
            </div>
          ),
        )}
    </div>
  );
};

export default AnimatedText;
