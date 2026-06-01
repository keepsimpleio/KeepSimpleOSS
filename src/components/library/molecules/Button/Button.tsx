import React from 'react';
import classNames from 'classnames';

import { ButtonProps, ButtonSize, ButtonType, IconPosition } from './Button.types';

import { TagType, Text, TypographyVariant } from '@/components/atoms/Text';

import styles from './Button.module.scss';

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    size = ButtonSize.Default,
    type = ButtonType.Primary,
    Icon,
    label,
    disabled,
    ariaLabel,
    className,
    labelClassName,
    buttonType = 'button',
    iconPosition = IconPosition.Left,
    onClick,
  } = props;

  return (
    <button
      role="button"
      type={buttonType}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={classNames(styles.button, styles[size], styles[type], className)}
    >
      {Icon && iconPosition === IconPosition.Left && Icon}
      {label && (
        <Text
          tag={TagType.Span}
          variant={TypographyVariant.TextBaseSemibold}
          className={classNames(styles.text, labelClassName)}
        >
          {label}
        </Text>
      )}
      {Icon && iconPosition === IconPosition.Right && Icon}
    </button>
  );
};

export default Button;
