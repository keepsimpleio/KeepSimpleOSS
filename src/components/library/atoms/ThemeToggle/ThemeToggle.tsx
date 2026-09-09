import classNames from 'classnames';
import React, { JSX } from 'react';

import { useGlobalState } from '@components/Context/library/GlobalStateContext';
import { Tooltip } from '@components/library/atoms/Tooltip';

import styles from './ThemeToggle.module.scss';

interface ThemeToggleProps {
  className?: string;
}

/**
 * The lamp: one square control that turns the Library's light down and up
 * again. Both glyphs are drawn from the start and cross over in place, so the
 * button never changes size with the theme.
 */
export function ThemeToggle({ className }: ThemeToggleProps): JSX.Element {
  const { theme, toggleTheme } = useGlobalState();
  const dark = theme === 'dark';
  const label = dark ? 'Turn the lights on' : 'Turn the lights down';
  return (
    <Tooltip asChild place="bottom" tooltipContent={label}>
      <button
        type="button"
        className={classNames(styles.toggle, className, {
          [styles.dark]: dark,
        })}
        onClick={toggleTheme}
        aria-label={label}
        aria-pressed={dark}
      >
        <svg
          className={classNames(styles.glyph, styles.sun)}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
        </svg>
        <svg
          className={classNames(styles.glyph, styles.moon)}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
        </svg>
      </button>
    </Tooltip>
  );
}
