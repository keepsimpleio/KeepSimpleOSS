import podcast from '@uxcore/data/podcast';
import type { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { Player } from 'react-simple-player/lib/components/Player';

import styles from './UXCorePopup.module.scss';

type UXCorePopupTypes = {
  setOpenPodcast?: {
    (updater: (prev: boolean) => boolean): void;
    (value: boolean): void;
  };
  openPodcast?: boolean;
};

const UXCorePopup: FC<UXCorePopupTypes> = ({ setOpenPodcast, openPodcast }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { title, source, link, podcastLink } = podcast[locale];
  const closePopUp = () => {
    setOpenPodcast(false);
  };

  return (
    locale !== 'hy' &&
    openPodcast && (
      <div className={styles.popup} data-cy="uxcore-podcast-popup">
        <div className={styles.iconWrapper}>
          <img
            src="/assets/biases/cross.svg"
            onClick={closePopUp}
            alt="modal close button"
            className={styles.closeIcon}
            data-cy="uxcore-podcast-close-icon"
          />
        </div>
        <div>
          <>
            <p className={styles.title}>
              {title}
              <br />
              <a href={link} className={styles.link} target={'_blank'}>
                {source}
              </a>
            </p>
            <Player src={podcastLink} height={40} key={'key-' + 1} />
          </>
        </div>
      </div>
    )
  );
};
export default UXCorePopup;
