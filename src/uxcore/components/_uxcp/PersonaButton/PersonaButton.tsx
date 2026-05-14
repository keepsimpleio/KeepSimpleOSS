import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useCallback, useRef, useState } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import styles from './PersonaButton.module.scss';

type PersonaButtonProps = {
  label: string;
  invertedColors?: boolean;
  disabled?: boolean;
  icon?: 'copy' | 'check';
  onClick: () => void;
  animate?: boolean;
  animationText?: string;
  style?: any;
};

const PersonaButton: FC<PersonaButtonProps> = ({
  label,
  disabled,
  icon,
  invertedColors,
  onClick,
  animate,
  animationText,
  style,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);
  const router = useRouter();
  const { locale } = router as TRouter;

  const handleClick = useCallback(() => {
    if (animate && !isAnimating) {
      setIsAnimating(true);

      timerRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 2500);
    }
    if (!disabled) onClick();
  }, [onClick, disabled, animate, isAnimating]);

  return (
    <button
      className={cn(styles.PersonaButton, {
        [styles.Inverted]: invertedColors,
        [styles.Disabled]: disabled || isAnimating,
        [styles.PersonaButtonHy]: locale === 'hy',
      })}
      onClick={handleClick}
      style={style}
    >
      <div
        className={cn(styles.Countdowner, {
          [styles.Animate]: isAnimating,
        })}
      />
      {icon === 'copy' && (
        <svg
          type="copy"
          width="10"
          height="12"
          viewBox="0 0 10 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.28565 0H2.10707C2.04814 0 1.99993 0.0482143 1.99993 0.107143V0.857143C1.99993 0.916071 2.04814 0.964286 2.10707 0.964286H8.74993V10.1786C8.74993 10.2375 8.79815 10.2857 8.85707 10.2857H9.60707C9.666 10.2857 9.71422 10.2375 9.71422 10.1786V0.428571C9.71422 0.191518 9.5227 0 9.28565 0ZM7.57136 1.71429H0.714216C0.477162 1.71429 0.285645 1.9058 0.285645 2.14286V9.25045C0.285645 9.36429 0.33118 9.47277 0.411537 9.55313L2.73252 11.8741C2.76198 11.9036 2.79547 11.9277 2.83163 11.9478V11.9732H2.88788C2.93475 11.9906 2.98431 12 3.0352 12H7.57136C7.80841 12 7.99993 11.8085 7.99993 11.5714V2.14286C7.99993 1.9058 7.80841 1.71429 7.57136 1.71429ZM2.83029 10.6098L1.67716 9.45536H2.83029V10.6098ZM7.03565 11.0357H3.68743V9.13393C3.68743 8.83795 3.4477 8.59821 3.15172 8.59821H1.24993V2.67857H7.03565V11.0357Z" />
        </svg>
      )}
      <span>{isAnimating && !!animationText ? animationText : label}</span>
      {icon === 'check' && (
        <svg
          type="check"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="7" cy="7" r="7" fill="white" />
          <path d="M4 7L6 9L10 5" stroke="#28587B" />
        </svg>
      )}
    </button>
  );
};

export default PersonaButton;
