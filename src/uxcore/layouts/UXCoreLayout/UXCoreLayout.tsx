import CoreIcon from '@uxcore/assets/icons/CoreIcon';
import FolderIcon from '@uxcore/assets/icons/FolderIcon';
import { HRIconBlue } from '@uxcore/assets/icons/HRIconBlue';
import { HRIconGrey } from '@uxcore/assets/icons/HRIconGrey';
import { OffSecIcon, OffSecIconGrey } from '@uxcore/assets/icons/OffSecIcon';
import { PMIcon } from '@uxcore/assets/icons/PMIcon';
import { PMIconGrey } from '@uxcore/assets/icons/PMIconGrey';
import Search from '@uxcore/components/_biases/Search';
import Logos from '@uxcore/components/Logos';
import Spinner from '@uxcore/components/Spinner';
import ToolFooter from '@uxcore/components/ToolFooter';
import biasesLocalization from '@uxcore/data/biases';
import biasesMobile from '@uxcore/data/biasesMobile';
import useUXCoreGlobals from '@uxcore/hooks/useUXCoreGlobals';
import useUCoreMobile from '@uxcore/hooks/uxcoreMobile';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';

import type { UXCoreLayoutProps } from './UXCoreLayout.types';

import styles from './UXCoreLayout.module.scss';

const FolderViewLayout = dynamic(
  () => import('@uxcore/layouts/FolderViewLayout'),
  {
    ssr: false,
  },
);
const CoreViewLayout = dynamic(() => import('@uxcore/layouts/CoreViewLayout'), {
  ssr: false,
});

const UXCorePopup = dynamic(() => import('@uxcore/components/UXCorePopup'), {
  ssr: false,
});

const UXCoreSnackbar = dynamic(
  () => import('@uxcore/components/UXCoreSnackbar'),
  {
    ssr: false,
  },
);

const ViewSwitcher = dynamic(
  () => import('@uxcore/components/_biases/ViewSwitcher'),
  {
    ssr: false,
  },
);
const MobileView = dynamic(
  () => import('@uxcore/components/_biases/MobileView'),
  {
    ssr: false,
  },
);

const UXCoreLayout: FC<UXCoreLayoutProps> = ({
  strapiBiases,
  isOpen,
  biasSelected,
  openPodcast,
  setOpenPodcast,
  userInfo,
  setUserInfo,
  blockLanguageSwitcher,
  mounted,
}) => {
  const [{ toggleIsCoreView }, { isCoreView }] = useUXCoreGlobals();
  const [{ toggleIsProductView }, { isProductView }] = useUXCoreGlobals();
  const [{ toggleIsOffsecView }, { isOffsecView }] = useUXCoreGlobals();
  const router = useRouter();
  const { asPath } = router as TRouter;
  const { isUxcoreMobile } = useUCoreMobile()[1];
  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarText, setSnackBarText] = useState('');
  const [isSwitched, setIsSwitched] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [headerPodcastOpen, setHeaderPodcastOpen] = useState(false);
  const { locale } = router as TRouter;
  const data = biasesLocalization[locale];
  const { browsingAsProduct, browsingAsHR, browsingAsOffsec } = data;
  const { description } = biasesMobile[locale];

  useEffect(() => {
    if (!mounted) return;

    const hash = window.location.hash;

    if (hash === '#hr' && isProductView) {
      toggleIsProductView();
    }
    if (hash === '#offsec' && !isOffsecView) {
      toggleIsOffsecView();
    }
  }, [mounted]);

  useEffect(() => {
    setIsLoaded(true);
  }, [router.events, asPath]);

  useEffect(() => {
    if (!mounted) return;

    const localePrefix = router.locale === 'en' ? '' : `/${router.locale}`;

    const basePath = `${localePrefix}/uxcore`;

    const shouldBeHash = isOffsecView ? '#offsec' : isProductView ? '' : '#hr';

    const targetUrl = `${basePath}${shouldBeHash}`;

    const currentUrl = window.location.pathname + window.location.hash;

    if (currentUrl === targetUrl) return;

    window.history.replaceState(null, '', targetUrl);
  }, [mounted, isProductView, isOffsecView, router.locale]);

  useEffect(() => {
    if (isSwitched !== undefined) {
      if (isOffsecView) {
        setSnackBarText(browsingAsOffsec);
      } else if (isProductView) {
        setSnackBarText(browsingAsProduct);
      } else {
        setSnackBarText(browsingAsHR);
      }
    }
  }, [isSwitched, isProductView, isOffsecView, locale]);

  const handleOffsecClick = () => {
    // Pre-set the snackbar text from the next state — the global hook's
    // listener updates asynchronously, so reading isOffsecView in the
    // text-effect alone briefly flashes the previous PM/HR label.
    if (!isOffsecView) {
      setSnackBarText(browsingAsOffsec);
    } else {
      setSnackBarText(isProductView ? browsingAsProduct : browsingAsHR);
    }
    toggleIsOffsecView();
    setIsSwitched(prev => !prev);
    handleSnackbarOpening();
  };

  let snackbarTimeout: NodeJS.Timeout;
  const handleSnackbarOpening = () => {
    clearTimeout(snackbarTimeout);

    setShowSnackbar(true);
    snackbarTimeout = setTimeout(() => {
      setShowSnackbar(false);
    }, 2000);
    return () => clearTimeout(snackbarTimeout);
  };

  if (!isLoaded) {
    return <Spinner visible={true} />;
  }
  return (
    <>
      <section
        className={cn(styles.body, {
          [styles.openedModal]: biasSelected,
          [styles.hyLang]: locale === 'hy',
        })}
      >
        {!isUxcoreMobile && (
          <>
            <ViewSwitcher
              isSecondView={isCoreView}
              toggleIsCoreView={toggleIsCoreView}
              defaultVieWIcon={<CoreIcon />}
              secondViewLabel={'folder'}
              secondViewIcon={<FolderIcon />}
              className={styles.viewTypeSwitcher}
              labelViewType
              dataCy={'core-view-switcher'}
              dataCySecondView={'folder-view-switcher'}
            />
            <ViewSwitcher
              isSecondView={isProductView}
              toggleIsCoreView={toggleIsProductView}
              defaultViewLabel={'PM'}
              defaultVieWIcon={isProductView ? <PMIcon /> : <PMIconGrey />}
              secondViewIcon={isProductView ? <HRIconGrey /> : <HRIconBlue />}
              secondViewLabel={'hr'}
              secondText={'HR'}
              className={cn(styles.viewTeamSwitcher, {
                [styles.dimmed]: isOffsecView,
              })}
              setIsSwitched={setIsSwitched}
              isSwitched={isSwitched}
              handleSnackbarOpening={handleSnackbarOpening}
              dataCy={'switch-product'}
              dataCySecondView={'switch-hr'}
            />
            <div
              className={cn(styles.useCaseSwitcher, {
                [styles.dimmed]: !isOffsecView,
              })}
            >
              <div
                data-cy="switch-offsec"
                onClick={handleOffsecClick}
                className={cn(styles.useCaseButton, {
                  [styles.active]: isOffsecView,
                })}
              >
                {isOffsecView ? <OffSecIcon /> : <OffSecIconGrey />}
                <span>Cybersecurity</span>
              </div>
            </div>
            {isCoreView && <Search biases={strapiBiases} />}
            {isCoreView && (
              <>
                <CoreViewLayout biases={strapiBiases} />
                {locale !== 'hy' && openPodcast && (
                  <UXCorePopup
                    setOpenPodcast={setOpenPodcast}
                    openPodcast={openPodcast}
                  />
                )}

                <Logos className={styles.Logos} />
              </>
            )}
            {!isCoreView && (
              <FolderViewLayout biases={strapiBiases} isOpen={isOpen} />
            )}
          </>
        )}
        <div className={styles.MobileView}>
          <MobileView
            isSecondView={isProductView}
            toggleIsCoreView={toggleIsProductView}
            defaultViewLabel={'PM'}
            secondViewLabel={'hr'}
            strapiBiases={strapiBiases}
            containerClassName={styles.body}
            setIsSwitched={setIsSwitched}
            isSwitched={isSwitched}
            isOpen={isOpen}
            hrText={'HR'}
            biasSelected={biasSelected}
            headerPodcastOpen={setHeaderPodcastOpen}
            isPodcastOpen={headerPodcastOpen}
            handleSnackbarOpening={handleSnackbarOpening}
            description={description}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            blockLanguageSwitcher={blockLanguageSwitcher}
          />
        </div>
        <ToolFooter page="uxcore" />
        {!!snackBarText && (
          <UXCoreSnackbar
            text={snackBarText}
            showSnackbar={showSnackbar}
            isHy={locale === 'hy'}
          />
        )}
      </section>
    </>
  );
};

export default UXCoreLayout;
