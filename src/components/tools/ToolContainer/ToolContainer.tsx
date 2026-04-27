import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

import { TOOL_CONFIG } from '@constants/tools';

import { useEffectiveDarkTheme } from '@hooks/useEffectiveDarkTheme';
import useGlobals from '@hooks/useGlobals';

import toolsData from '@data/tools';

import BtnBg from '@icons/tools/btn-vg.svg';
import ClaudeIcon from '@icons/tools/claude.svg';
import GptIcon from '@icons/tools/gpt.svg';
import OpenIcon from '@icons/tools/open.svg';

import BorderedPill from '@components/longevity/BorderedPill';
import BobAchievements from '@components/tools/BobAchievements';

import { ToolContainerProps } from './ToolContainer.types';

import styles from './ToolContainer.module.scss';

const ToolContainer: FC<ToolContainerProps> = ({
  id,
  title = 'Pyramids of Operational Needs',
  description = 'Modular management framework for remote-first software development companies, distilled from founding four successful software firms.',
  poweredBy,
  link,
  isDarkTheme = false,
  isInDevelopment = false,
}) => {
  const { locale } = useRouter();
  const { isDarkTheme: globalDarkTheme } = useGlobals()[1];
  const darkTheme = useEffectiveDarkTheme(isDarkTheme || globalDarkTheme);
  const t = toolsData[locale as keyof typeof toolsData] ?? toolsData.en;

  const config = id ? TOOL_CONFIG[id] : undefined;
  const { Icon, hoverColor, darkHoverColor, darkIconFill, isBlank } =
    config ?? {};

  const isClaude = poweredBy === 'Claude';
  const isChatGPT = poweredBy === 'ChatGPT';
  /** Bob vs Tom both use ChatGPT; achievements are Bob-only (see TOOL_CONFIG id 5 vs 6). */
  const isBob = id === 5;

  return (
    <>
      <div
        data-testid="tool-card"
        data-in-development={isInDevelopment ? 'true' : 'false'}
        className={cn(styles.container, {
          [styles.darkTheme]: darkTheme,
        })}
        style={
          {
            '--hover-color': darkTheme ? darkHoverColor : hoverColor,
            '--border-hover-color': darkTheme ? darkHoverColor : hoverColor,
            '--dark-icon-fill': darkIconFill,
          } as React.CSSProperties
        }
      >
        {Icon && <Icon className={styles.backgroundSvg} />}
        <div
          className={cn(styles.content, {
            [styles.contentRu]: locale === 'ru',
          })}
        >
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

          {isChatGPT && isBob && <BobAchievements darkTheme={darkTheme} />}

          <div className={styles.actions}>
            {isClaude ? (
              <Link
                href="/keepsimple_/assets/tools/bob.skill"
                download
                locale={false}
                className={styles.primaryButton}
                aria-disabled={isInDevelopment}
              >
                <BtnBg className={styles.buttonBg} />
                <span className={styles.primaryButtonLabel}>{t.download}</span>
              </Link>
            ) : (
              <Link
                href={link ?? '#'}
                target={isBlank ? '_blank' : undefined}
                rel={isBlank ? 'noopener noreferrer' : undefined}
                className={cn(styles.primaryButton, {
                  [styles.inDevelopment]: isInDevelopment,
                })}
                aria-disabled={isInDevelopment}
              >
                <BtnBg className={styles.buttonBg} />
                <span className={styles.primaryButtonLabel}>
                  {isBlank && <OpenIcon className={styles.blankIcon} />}
                  {isInDevelopment ? t.inDevelopment : t.open}
                </span>
              </Link>
            )}

            {isClaude && (
              <BorderedPill
                as={Link}
                href={link ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                text={'About Claude skills'}
                leftIcon={<OpenIcon className={styles.blankIcon} />}
                className={styles.secondaryButton}
                contentClassName={styles.secondaryButtonContent}
              />
            )}

            {(isClaude || isChatGPT) && (
              <span className={styles.poweredBy}>
                {isClaude ? (
                  <>
                    <ClaudeIcon className={styles.poweredIcon} />
                    {t.poweredBy} Claude
                  </>
                ) : (
                  <>
                    <GptIcon className={styles.poweredIcon} />
                    {t.poweredBy} ChatGPT
                  </>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolContainer;
