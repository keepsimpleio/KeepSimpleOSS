import CustomModal from '@uxcore/components/CustomModal';
import toolFooterData from '@uxcore/data/toolFooter';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, Fragment, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import styles from './ToolFooter.module.scss';

const releaseIndexes = {
  uxcore: 0,
  uxcg: 1,
  uxcp: 2,
  api: 3,
};

type TToolFooter = {
  page: 'uxcore' | 'uxcg' | 'uxcp' | 'api';
};

const ToolFooter: FC<TToolFooter> = ({ page }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { release, contactUs, contributors, tooltipTxt } =
    toolFooterData[locale];
  const [openedModal, setOpenedModal] = useState(null);

  const toggleModal = (modalValue?: string) => {
    setOpenedModal(modalValue || null);
  };

  const isUXCore = page === 'uxcore';
  const isUXCG = page === 'uxcg';
  const isUXCP = page === 'uxcp';
  const isAPI = page === 'api';

  return (
    <Fragment>
      <footer
        className={cn(styles.ToolFooter, {
          [styles.UXCore]: isUXCore,
          [styles.UXCG]: isUXCG,
          [styles.UXCP]: isUXCP,
          [styles.API]: isAPI,
          [styles.hyLang]: locale === 'hy',
        })}
      >
        <div className={styles.AdvancedLinks}>
          <Link
            href={'/contributors'}
            target={'_blank'}
            data-cy={'contributors-open-button'}
          >
            {contributors.title}
          </Link>
          <span
            onClick={() => toggleModal('contactUs')}
            data-cy={'contact-us-modal'}
          >
            {contactUs.title}
          </span>
        </div>
        <ReactTooltip
          id={release[releaseIndexes[page]]}
          place={'top'}
          className={styles.tooltipContainer}
        >
          {tooltipTxt}
        </ReactTooltip>
        <span
          className={styles.Release}
          data-tooltip-id={release[releaseIndexes[page]]}
        >
          {release[releaseIndexes[page]]}
        </span>
      </footer>
      <CustomModal
        isVisible={!!openedModal}
        contentType={openedModal}
        onClose={() => toggleModal()}
      />
    </Fragment>
  );
};

export default ToolFooter;
