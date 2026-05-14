import cn from 'classnames';
import { useRouter } from 'next/router';
import { memo, useCallback } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import biasesViewSwitcherIntl from '@data/biasesViewSwitcher';

import styles from './ViewSwitcher.module.scss';

type PropTypes = {
  isSecondView?: boolean;
  toggleIsCoreView?: () => void;
  defaultViewLabel?: string;
  defaultVieWIcon?: JSX.Element;
  secondViewIcon?: JSX.Element;
  secondViewLabel?: string;
  className?: string;
  setIsHrView?: (isHrView: boolean) => void;
  isHrView?: boolean;
  toggleIsHrView?: () => void;
  labelViewType?: boolean;
  setIsSwitched?: (isSwitched: boolean) => void;
  isSwitched?: boolean;
  handleSnackbarOpening?: () => void;
  hrText?: string;
  secondText?: string;
  dataCy?: string;
  dataCySecondView?: string;
};

const ViewSwitcher = ({
  isSecondView,
  toggleIsCoreView,
  defaultVieWIcon,
  defaultViewLabel,
  secondViewLabel,
  secondText,
  secondViewIcon,
  className,
  labelViewType,
  handleSnackbarOpening,
  dataCy,
  dataCySecondView,
}: PropTypes) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { label, labelViewerTeam } = biasesViewSwitcherIntl[locale];

  const handlePageViewChange = useCallback(
    e => {
      const { type } = e.currentTarget.dataset;
      if ((type === defaultViewLabel) !== isSecondView) {
        toggleIsCoreView();
      }
    },

    [isSecondView, toggleIsCoreView, defaultViewLabel],
  );

  const switchATeamView = () => {
    if (defaultViewLabel === 'Product' || secondViewLabel === 'hr') {
      handleSnackbarOpening();
    }
  };

  return (
    <div
      className={cn(styles.ViewSwitcher, {
        [styles.FolderView]: isSecondView,
        [styles.CoreView]: !isSecondView,
        [className]: className,
      })}
    >
      <p className={styles.Label}>{labelViewType ? label : labelViewerTeam}</p>
      <div className={styles.ViewSwitcherButtons}>
        <div
          data-cy={dataCy}
          className={styles.ViewSwitcherButton}
          data-type={defaultViewLabel}
          onClick={e => {
            handlePageViewChange(e);
            switchATeamView();
          }}
        >
          {defaultVieWIcon}
          {defaultViewLabel && (
            <span className={styles.ViewSwitcherText}>{defaultViewLabel}</span>
          )}
        </div>
        <div
          data-cy={dataCySecondView}
          className={styles.ViewSwitcherButton}
          data-type={secondViewLabel}
          onClick={e => {
            handlePageViewChange(e);
            switchATeamView();
          }}
        >
          {secondViewIcon}
          {secondText && (
            <span className={styles.ViewSwitcherText}>{secondText}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ViewSwitcher);
