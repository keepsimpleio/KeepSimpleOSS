import { useCallback } from 'react';

import useGlobals from '@hooks/useGlobals';

import styles from './ThemeToggle.module.scss';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const [{ toggleIsDarkTheme }, { isDarkTheme }] = useGlobals();

  const onClick = useCallback(() => {
    toggleIsDarkTheme();
  }, []);

  return (
    <button
      type="button"
      data-test-id="theme-toggle"
      aria-label={
        isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'
      }
      className={`${styles.toggle}${className ? ` ${className}` : ''}`}
      onClick={onClick}
    />
  );
};

export default ThemeToggle;
