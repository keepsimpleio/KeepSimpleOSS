import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { TRouter } from '@uxcore/local-types/global';

import { sanitizeHtml } from '@uxcore/lib/sanitizeHtml';

import ourProjectsData from '@uxcore/data/ourProjects';

import Button from '@uxcore/components/Button';
import Modal from '@uxcore/components/Modal';

import type { OurProjectsModalProps } from './OurProjectsModal.types';

import styles from './OurProjectsModal.module.scss';

const OurProjectsModal: FC<OurProjectsModalProps> = ({
  onClose,
  title,
  projects,
  github,
  api,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { inDevTxt, doneTxt } = ourProjectsData[locale || 'en'];

  const sortedProjects = [...(projects || [])].sort((a, b) => {
    const aInDev = Boolean(a?.inDevelopment);
    const bInDev = Boolean(b?.inDevelopment);
    return aInDev === bInDev ? 0 : aInDev ? 1 : -1;
  });

  return (
    <Modal
      onClick={onClose}
      title={title}
      hasBorder
      fullHeightMobile
      dataCy={'our-projects-modal'}
    >
      {sortedProjects?.map((project: any, index: number) => {
        const isInDev = Boolean(project?.inDevelopment);
        const tooltipId = `proj-tip-${index}`;

        return (
          <div
            key={index}
            {...(isInDev
              ? {
                  'data-tooltip-id': tooltipId,
                  'data-tooltip-content': inDevTxt,
                }
              : {})}
            className={cn(styles.projectWrapper, {
              [styles.inDevelopment]: isInDev,
            })}
          >
            <div className={styles.projectInfo} data-cy="our-projects-content">
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI}${project.image.data.attributes.url}`}
                width={20}
                height={20}
                alt={project.name}
                unoptimized
                className={styles.projectIcon}
              />

              <Link
                href={isInDev ? '#' : project.link || ''}
                target={isInDev ? undefined : '_blank'}
                rel={isInDev ? undefined : 'noopener noreferrer'}
                className={cn(styles.name, {
                  [styles.disabledLink]: isInDev,
                })}
                aria-disabled={isInDev}
                onClick={e => {
                  if (isInDev) e.preventDefault();
                }}
              >
                {project.name}
                <Image
                  src="/assets/project-icons/open-link.png"
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                  className={styles.openLinkIcon}
                />
              </Link>
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(project.description),
              }}
              className={styles.description}
            />

            {isInDev && (
              <ReactTooltip
                opacity={1}
                id={tooltipId}
                place="top"
                className={styles.tooltip}
              />
            )}
          </div>
        );
      })}

      <hr />
      <div className={styles.linksWrapper}>
        <Link
          href={github[0]?.link || ''}
          target={'_blank'}
          className={styles.buttonStyleLink}
        >
          <Image
            src={'/assets/project-icons/github-dark.png'}
            alt={'GitHubIcon'}
            width={20}
            height={20}
            className={styles.darkIcon}
            unoptimized
          />
          <Image
            src={'/assets/project-icons/github-light.png'}
            alt={'GitHubIcon'}
            width={20}
            height={20}
            className={styles.lightIcon}
            unoptimized
          />

          {github[0]?.linkName}
        </Link>
        <Link
          href={api[0]?.link || ''}
          className={styles.buttonStyleLink}
          target={'_blank'}
        >
          <Image
            src={'/assets/project-icons/api-dark.png'}
            alt={'GitHubIcon'}
            width={20}
            height={20}
            className={styles.darkIcon}
            unoptimized
          />
          <Image
            src={'/assets/project-icons/api-light.png'}
            alt={'GitHubIcon'}
            width={20}
            height={20}
            className={styles.lightIcon}
            unoptimized
          />
          {api[0]?.linkName}
        </Link>
      </div>

      <div className={styles.doneBtn}>
        <Button
          label={doneTxt}
          onClick={() => onClose()}
          type={'primary'}
          dataCy={'our-projects-close-button'}
        />
      </div>
    </Modal>
  );
};

export default OurProjectsModal;
