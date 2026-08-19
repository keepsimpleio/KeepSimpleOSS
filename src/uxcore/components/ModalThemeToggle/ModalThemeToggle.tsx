import MoonIcon from '@uxcore/assets/icons/MoonIcon';
import SunIcon from '@uxcore/assets/icons/SunIcon';
import useGlobals from '@uxcore/hooks/useGlobals';
import cn from 'classnames';

import styles from './ModalThemeToggle.module.scss';

interface ModalThemeToggleProps {
  className?: string;
}

// Same moon/sun assets and hover treatment as the UX Core navbar toggle
// (ToolHeader), so the modal header and the page header read as one system.
const ModalThemeToggle = ({ className }: ModalThemeToggleProps) => {
  const [{ toggleIsDarkTheme }, { isDarkTheme }] = useGlobals();

  return (
    <button
      type="button"
      className={cn(styles.themeToggle, className)}
      onClick={toggleIsDarkTheme}
      aria-label={
        isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'
      }
      aria-pressed={isDarkTheme}
      data-cy="modal-theme-toggle"
    >
      {isDarkTheme ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ModalThemeToggle;
