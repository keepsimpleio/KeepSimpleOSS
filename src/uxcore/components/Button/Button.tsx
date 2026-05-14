import cn from 'classnames';
import { FC, useCallback } from 'react';

import Loader from '@icons/Loader';

import styles from './Button.module.scss';

type TButton = {
  type?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'orange'
    | 'orange_outline'
    | 'blue_outline'
    | 'text';
  label: string;
  disabled?: boolean;
  onClick: () => void;
  icon?: any;
  iconClassName?: string;
  className?: string;
  loading?: boolean;
  rightIconClassName?: string;
  rightIcon?: any;
  hoveredLabel?: string;
  isHovered?: boolean;
  setIsHovered?: (value: boolean) => void;
  isBig?: boolean;
  dataCy?: string;
};

const Button: FC<TButton> = ({
  type,
  label,
  disabled,
  onClick,
  icon,
  iconClassName,
  className,
  loading,
  rightIcon,
  rightIconClassName,
  hoveredLabel,
  isHovered,
  setIsHovered,
  isBig,
  dataCy,
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
      data-cy={dataCy}
      className={cn(styles.Button, className, {
        [styles.Primary]: type === 'primary',
        [styles.Disabled]: disabled,
        [styles.DisabledOrange]: disabled && type === 'orange',
        [styles.DisabledOrange]: disabled && type === 'orange_outline',
        [styles.Secondary]: type === 'secondary',
        [styles.Orange]: type === 'orange',
        [styles.OrangeOutline]: type === 'orange_outline',
        [styles.BlueOutline]: type === 'blue_outline',
        [styles.Text]: type === 'text',
        [styles.Big]: isBig,
      })}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading && <Loader className={styles.Loader} />}
      {!!icon && (
        <span className={cn(iconClassName, styles.iconWrapper)}>{icon}</span>
      )}
      {loading && 'Loading...'}
      {!loading && !isHovered && label}
      {!loading && (isHovered && disabled && hoveredLabel ? hoveredLabel : '')}
      {!!rightIcon && (
        <span className={cn(rightIconClassName, styles.iconWrapper)}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
