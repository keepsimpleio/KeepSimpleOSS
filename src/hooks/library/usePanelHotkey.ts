import { useEffect } from 'react';

// motion-passport: exempt — a keyboard binding; the panel's own fold carries
// the motion.

/**
 * Ctrl+\ folds the Library's info panel away and brings it back (Wolf,
 * 2026-09-10), the same switch the tab at the toolbar's right edge throws.
 *
 * Desktop only, matching the tab: below 1025px the panel is a drawer with a
 * control of its own. The binding stands down while the caret is in a field
 * or a rich-text editor, so a shortcut can never eat a keystroke meant for
 * text, and it takes Meta as well as Control so a Mac keyboard is not left
 * out. `event.code` is read rather than `event.key`: a layout that puts
 * another character on that key still answers.
 */
export default function usePanelHotkey(toggle: () => void): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTyping = (target: EventTarget | null): boolean => {
      const el = target as HTMLElement | null;
      if (!el || typeof el.closest !== 'function') return false;
      return !!el.closest('input, textarea, select, [contenteditable="true"]');
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Backslash') return;
      if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) {
        return;
      }
      if (isTyping(event.target)) return;
      if (!window.matchMedia('(min-width: 1025px)').matches) return;
      event.preventDefault();
      toggle();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);
}
