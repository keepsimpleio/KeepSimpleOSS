import Image from 'next/image';
import { useState } from 'react';
import styles from './ShinyStars.module.scss';

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

type Star = {
  id: number;
  left: string;
  bottom: string;
  delay: string;
  duration: string;
};

const STAR_COUNT = 4;

const makeStar = (id: number): Star => ({
  id,
  left: `${rand(2, 98).toFixed(2)}%`,
  bottom: `${rand(2, 85).toFixed(2)}%`,
  delay: `${rand(0, 1.5).toFixed(2)}s`, // stagger a bit
  duration: `${rand(1.8, 3.0).toFixed(2)}s`, // slight variety
});

export default function ShinyStars() {
  const [stars, setStars] = useState<Star[]>(() =>
    Array.from({ length: STAR_COUNT }, (_, i) => makeStar(i)),
  );

  const teleportStar = (id: number) => {
    setStars(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, left: makeStar(id).left, bottom: makeStar(id).bottom }
          : s,
      ),
    );
  };

  return (
    <>
      {stars.map(s => (
        <span
          key={s.id}
          className={styles.starWrap}
          style={{
            left: s.left,
            bottom: s.bottom,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
          onAnimationIteration={() => teleportStar(s.id)}
        >
          <Image
            src="/keepsimple_/assets/longevity/star-glow.png"
            width={20}
            height={20}
            alt="star"
            unoptimized
            className={styles.starImg}
          />
        </span>
      ))}
    </>
  );
}
