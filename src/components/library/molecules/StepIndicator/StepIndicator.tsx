import classNames from 'classnames';
import React, { Fragment,JSX } from 'react';

import { CheckIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';

import type { StepIndicatorProps } from './StepIndicator.types';

import styles from './StepIndicator.module.scss';

export function StepIndicator(props: StepIndicatorProps): JSX.Element {
  const { steps, currentStep, className } = props;

  return (
    <div className={classNames(className, styles.wrapper)} role="list">
      {steps.map((step, idx) => {
        const stepNumber = idx + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isLast = idx === steps.length - 1;
        const alignment = idx === 0 ? styles.alignStart : styles.alignEnd;

        return (
          <Fragment key={step.label}>
            <div
              role="listitem"
              className={classNames(styles.step, alignment, {
                [styles.active]: isActive,
                [styles.completed]: isCompleted,
              })}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className={styles.circle}>
                {isCompleted ? (
                  <CheckIcon width={14} height={14} />
                ) : (
                  <Text
                    variant={TypographyVariant.TextSmall}
                    className={styles.number}
                  >
                    {stepNumber}
                  </Text>
                )}
              </div>
              <div className={styles.labels}>
                <Text
                  variant={TypographyVariant.TextTiny}
                  className={styles.stepLabel}
                >
                  STEP {stepNumber}
                </Text>
                <Text
                  variant={TypographyVariant.TextBaseSemibold}
                  className={styles.titleLabel}
                >
                  {step.label}
                </Text>
              </div>
            </div>
            {!isLast && (
              <div className={styles.connector} aria-hidden="true">
                <div
                  className={classNames(styles.connectorFill, {
                    [styles.filled]: stepNumber < currentStep,
                  })}
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
