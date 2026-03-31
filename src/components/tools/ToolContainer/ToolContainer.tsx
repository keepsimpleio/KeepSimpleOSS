import cn from 'classnames';
import Link from 'next/link';
import { FC } from 'react';

import { DEFAULT_CONFIG, TOOL_CONFIG } from '@constants/tools';

import { useEffectiveDarkTheme } from '@hooks/useEffectiveDarkTheme';
import useGlobals from '@hooks/useGlobals';

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
  isBlank = false,
  isDarkTheme = false,
  isInDevelopment = false,
}) => {
  const { isDarkTheme: globalDarkTheme } = useGlobals()[1];
  const darkTheme = useEffectiveDarkTheme(isDarkTheme || globalDarkTheme);

  const config = (id != null && TOOL_CONFIG[id]) || DEFAULT_CONFIG;
  const { Icon, hoverColor, darkHoverColor, darkIconFill } = config;

  const isClaude = poweredBy === 'Claude';
  const isChatGPT = poweredBy === 'ChatGPT';
  /** Bob vs Tom both use ChatGPT; achievements are Bob-only (see TOOL_CONFIG id 5 vs 6). */
  const isBob = id === 5;

  return (
    <>
      <div
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
        <Icon className={styles.backgroundSvg} />
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

          {isChatGPT && isBob && <BobAchievements darkTheme={darkTheme} />}

          <div className={styles.actions}>
            {isClaude ? (
              <Link
                href="/keepsimple_/assets/tools/bob.skill"
                download
                className={styles.primaryButton}
                aria-disabled={isInDevelopment}
              >
                <BtnBg className={styles.buttonBg} />
                <span className={styles.primaryButtonLabel}>Download</span>
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
                  {isInDevelopment ? 'In Development' : 'Open'}
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
                    Powered by Claude
                  </>
                ) : (
                  <>
                    <GptIcon className={styles.poweredIcon} />
                    Powered by ChatGPT
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
