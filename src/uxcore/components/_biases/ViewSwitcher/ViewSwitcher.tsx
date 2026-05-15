import biasesViewSwitcherIntl from '@uxcore/data/biasesViewSwitcher';
import { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { memo, useCallback } from 'react';

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

  // First button is the "active" side when isSecondView=true (the
  // .FolderView class is applied then), second button is active when
  // isSecondView=false. Toggle only when the inactive side is clicked.
  const handleFirstClick = useCallback(() => {
    if (!isSecondView) toggleIsCoreView?.();
  }, [isSecondView, toggleIsCoreView]);

  const handleSecondClick = useCallback(() => {
    if (isSecondView) toggleIsCoreView?.();
  }, [isSecondView, toggleIsCoreView]);

  const switchATeamView = () => {
    if (
      (defaultViewLabel === 'Product' || secondViewLabel === 'hr') &&
      handleSnackbarOpening
    ) {
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
          onClick={() => {
            handleFirstClick();
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
          onClick={() => {
            handleSecondClick();
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
