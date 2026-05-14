import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import biasesLogoDescription from '@uxcore/data/biasesLogoDescription';

import AmazonLogo from '@uxcore/assets/icons/AmazonLogo';
import DukeLogo from '@uxcore/assets/icons/DukeLogo';
import GoogleLogo from '@uxcore/assets/icons/GoogleLogo';
import HarvardBusinessSchoolLogo from '@uxcore/assets/icons/HarvardBusinessSchoolLogo';
import XLogo from '@uxcore/assets/icons/XLogo';

import styles from './Logos.module.scss';

type LogoProps = {
  className?: string;
};
const Logos: FC<LogoProps> = ({ className }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const description = biasesLogoDescription[locale]?.description;

  return (
    <div
      className={cn(styles.logoWrapper, {
        [className]: !!className,
      })}
    >
      <span className={styles.title}>{description}</span>
      <div className={styles.flexWrapper}>
        <div className={styles.flex1}>
          <div className={styles.logos}>
            <GoogleLogo />
          </div>
          <div className={styles.logos}>
            <XLogo />
          </div>
          <div className={styles.logos}>
            <AmazonLogo />
          </div>
        </div>
        <div className={styles.flex2}>
          <div className={styles.logos}>
            <DukeLogo />
          </div>
          <div className={styles.logos}>
            <HarvardBusinessSchoolLogo />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Logos;
