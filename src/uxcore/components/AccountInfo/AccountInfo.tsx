import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { TRouter } from '@uxcore/local-types/global';

import { useClickOutside } from '@uxcore/hooks/useClickOutside';

import { isLevelMilestone } from '@uxcore/lib/uxcat-helpers';

import uxcatData from '@uxcore/data/uxcat';

import styles from './AccountInfo.module.scss';

type AccountInfoProps = {
  username?: string;
  level?: number;
  levelTitle?: string;
  awarenessPoints?: number;
  email?: string;
  linkedIn?: string;
  description?: string;
  userBadge?: string;
  linkedinUsername?: string;
  title?: string;
  lvlShort?: string;
  achievementTooltipTxt?: string;
  yourPointsUserPage?: string;
  levelDetails?: any;
  exceptionUsername?: string;
};

const AccountInfo: FC<AccountInfoProps> = ({
  username,
  email,
  level,
  levelTitle,
  linkedIn,
  awarenessPoints,
  description,
  linkedinUsername,
  userBadge,
  title,
  lvlShort,
  achievementTooltipTxt,
  yourPointsUserPage,
  levelDetails,
  exceptionUsername,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { certificate } = uxcatData[locale];
  const descriptionText = description || 'No description';
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const ref = useClickOutside(handleBackgroundClick);

  const handleTooltipToggle = () => {
    setTooltipOpen(prevState => !prevState);
  };
  const openCertificate = () => {
    router.push(`/user/${username}/certificate`);
  };

  function handleBackgroundClick() {
    setTooltipOpen(false);
  }

  return (
    <div className={styles.accountInfo}>
      {!!userBadge ? (
        <>
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI}${userBadge}`}
            alt="profile image"
            width={146}
            height={146}
            className={styles.badge}
            data-tooltip-id={'badge'}
          />
          <ReactTooltip
            id={'badge'}
            place="bottom"
            opacity={1}
            className={styles.badgeTooltip}
          >
            <span> {levelDetails.attributes.description}</span>
          </ReactTooltip>
        </>
      ) : (
        <Skeleton
          width={136}
          height={146}
          circle
          className={styles.badgeSkeleton}
        />
      )}
      <div>
        <div
          className={cn(styles.nameAndTitle, {
            [styles.withGap]: title,
          })}
        >
          <span className={styles.title}> {title} </span>
          {!!exceptionUsername ? (
            <h1 className={styles.username}> {exceptionUsername}</h1>
          ) : !!username ? (
            <h1 className={styles.username}> {username}</h1>
          ) : (
            <Skeleton width={150} height={22} />
          )}
        </div>
        {!!levelTitle ? (
          <span className={styles.levelTitle}>
            {levelTitle} ({lvlShort} {level})
          </span>
        ) : (
          <Skeleton width={100} height={22} className={styles.levelSkeleton} />
        )}
        <p className={styles.description}>{descriptionText} </p>
        <p className={styles.awarenessPoints}>
          {yourPointsUserPage}
          <span> {awarenessPoints ? awarenessPoints : 0}</span>
        </p>
        <div className={styles.wrapper}>
          <div className={styles.txtAndImage}>
            <Image
              src={'/assets/uxcat/certificate.png'}
              alt="certificate"
              width={18}
              height={18}
              unoptimized
            />
            {isLevelMilestone(level, level) ? (
              <div
                className={styles.tooltipContent}
                data-tooltip-id={'certificate'}
                onClick={openCertificate}
                ref={ref}
              >
                <span>{certificate} </span>
                <Image
                  className={styles.QuestionMarkIcon}
                  src="/assets/uxcat/infoTooltip.png"
                  alt="infoTooltip"
                  width={14}
                  height={14}
                  unoptimized
                />
              </div>
            ) : (
              <>
                <div
                  className={styles.tooltipContent}
                  data-tooltip-id={'certificate'}
                  onClick={handleTooltipToggle}
                  ref={ref}
                >
                  <span>{certificate} </span>
                  <Image
                    className={styles.QuestionMarkIcon}
                    src="/assets/uxcat/infoTooltip.png"
                    alt="infoTooltip"
                    width={14}
                    height={14}
                    unoptimized
                  />
                </div>
                <ReactTooltip
                  isOpen={tooltipOpen}
                  openOnClick
                  afterShow={() => setTooltipOpen(true)}
                  afterHide={() => setTooltipOpen(false)}
                  className={cn(styles.certificateInfo, {
                    [styles.open]: tooltipOpen,
                    [styles.closed]: !tooltipOpen,
                  })}
                  id={'certificate'}
                  place={'top'}
                >
                  <span> {achievementTooltipTxt}</span>
                </ReactTooltip>
              </>
            )}
          </div>
          {!!email ? (
            <div className={styles.txtAndImage}>
              <Image
                src={'/assets/uxcat/mail.png'}
                alt="linkedIn"
                width={18}
                height={18}
                unoptimized
              />
              {email}
            </div>
          ) : email === undefined ? (
            <div className={styles.txtAndImage}>
              <Image
                src={'/assets/uxcat/mail.png'}
                alt="linkedIn"
                width={18}
                height={18}
                unoptimized
              />
              <Skeleton width={150} height={22} />
            </div>
          ) : null}
          {!!linkedIn ? (
            <div className={styles.txtAndImage}>
              <Image
                src={'/assets/uxcat/linkedin.png'}
                alt="linkedIn"
                width={18}
                height={18}
                unoptimized
              />
              <a href={linkedIn} target={'_blank'} className={styles.linkedin}>
                {linkedinUsername || ''}
              </a>
            </div>
          ) : email === undefined ? (
            <div className={styles.txtAndImage}>
              <Image
                src={'/assets/uxcat/linkedin.png'}
                alt="linkedIn"
                width={18}
                height={18}
                unoptimized
              />
              {<Skeleton width={150} height={22} />}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
