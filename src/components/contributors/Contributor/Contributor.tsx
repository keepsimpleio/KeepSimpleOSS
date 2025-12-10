import { FC } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

import type { ContributorProps } from '@components/contributors/Contributor/Contributor.types';

import styles from './Contributor.module.scss';

const Contributor: FC<ContributorProps> = ({
  name,
  role,
  japaneseLetter,
  isActive,
  socialLink,
  isDarkTheme,
  isMobile,
  socialLinkTxt,
}) => {
  return (
    <div
      className={cn(styles.contributorCard, {
        [styles.active]: isActive,
        [styles.inactive]: !isActive,
        [styles.dark]: isDarkTheme,
        [styles.darkInactive]: isDarkTheme && !isActive,
        [styles.translators]: japaneseLetter?.includes('子供たち'),
      })}
    >
      <h3 className={styles.japaneseLetter}> {japaneseLetter} </h3>
      <h3 className={styles.name}> {name} </h3>
      <p className={styles.role}> {role} </p>
      {isMobile && socialLink && (
        <div className={styles.socialLinkWrapper}>
          <Link
            href={socialLink}
            target={'_blank'}
            className={styles.socialLink}
          >
            {socialLinkTxt}
          </Link>
        </div>
      )}
      {!isMobile && (
        <div
          className={cn(styles.socialMedia, {
            [styles.inactiveSocialMedia]: !isActive,
          })}
        >
          <Link
            href={socialLink || ''}
            target={'_blank'}
            className={styles.socialLink}
          >
            <Image
              src={
                isDarkTheme
                  ? '/keepsimple_/assets/contributors/link-icon-dark.png'
                  : '/keepsimple_/assets/contributors/link-icon.png'
              }
              alt={'link icon'}
              width={64}
              height={64}
              className={styles.linkIcon}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contributor;
