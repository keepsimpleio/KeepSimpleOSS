import cn from 'classnames';
import { FC } from 'react';

import styles from './EmojiFall.module.scss';

type SnowfallProps = {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
};
const EmojiFall: FC<SnowfallProps> = ({ className }) => {
  const emojiList = ['🍬', '🍭', '🎉', '🍫', '🍬', '🎁'];
  const emojiCount = 50;
  const emojiFallArray = Array.from(
    { length: emojiCount },
    () => emojiList[Math.floor(Math.random() * emojiList.length)],
  );

  return (
    <div className={cn(styles.container, className)}>
      {emojiFallArray.map((emoji, index) => (
        <span key={index} className={styles.emoji}>
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default EmojiFall;
