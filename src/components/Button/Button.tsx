import { FC, useCallback } from 'react';
import cn from 'classnames';
import Image from 'next/image';

import Loader from '@icons/Loader';

import styles from './Button.module.scss';

type TButton = {
  variant?: 'default' | 'primary' | 'secondary' | 'grey';
  type?: 'submit' | 'button' | 'reset';
  label: string;
  disabled?: boolean;
  onClick: () => void;
  leftIcon?: any;
  leftIconClassName?: string;
  className?: string;
  loading?: boolean;
  rightIconClassName?: string;
  rightIcon?: any;
  hoveredLabel?: string;
  isHovered?: boolean;
  setIsHovered?: (value: boolean) => void;
  isBig?: boolean;
  dataCy?: string;
  iconWidth?: number;
  iconHeight?: number;
};

const Button: FC<TButton> = ({
  type = 'button',
  label,
  disabled,
  onClick,
  leftIcon,
  leftIconClassName,
  className,
  loading,
  rightIcon,
  rightIconClassName,
  hoveredLabel,
  isHovered,
  setIsHovered,
  variant,
  dataCy,
  iconWidth = 15,
  iconHeight = 15,
}) => {
  /**
   * className: example of usage - {styles["startBtn"]
   */

  const handleMouseEnter = () => {
    if (disabled) {
      setIsHovered && setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered && setIsHovered(false);
  };

  const handleClick = useCallback(() => {
    if (!disabled) onClick();
  }, [onClick, disabled]);

  return (
    <button
      type={type}
      data-cy={dataCy}
      className={cn(styles.button, className, {
        [styles.primary]: variant === 'primary',
        [styles.disabled]: disabled,
        [styles.grey]: variant === 'grey',
        [styles.secondary]: variant === 'secondary',
      })}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading && <Loader className={styles.Loader} />}
      {!!leftIcon && (
        <span className={cn(leftIconClassName, styles.iconWrapper)}>
          <Image
            src={leftIcon}
            alt={'Button icon'}
            width={iconWidth}
            height={iconHeight}
          />
        </span>
      )}
      {loading && 'Loading...'}
      {!loading && !isHovered && label}
      {!loading && (isHovered && disabled && hoveredLabel ? hoveredLabel : '')}
      {!!rightIcon && (
        <span className={cn(rightIconClassName, styles.iconWrapper)}>
          <Image
            src={rightIcon}
            alt={'Button icon'}
            width={iconWidth}
            height={iconHeight}
          />
        </span>
      )}
    </button>
  );
};

export default Button;
