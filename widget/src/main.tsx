import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AskUxCore } from './AskUxCore';
import css from './styles.css?inline';

const MOUNT_ID = 'ask-ux-core-mount';
const STYLE_ID = 'ask-ux-core-styles';

function detectLang(): 'en' | 'ru' {
  const htmlLang = (document.documentElement.lang || '').toLowerCase();
  if (htmlLang.startsWith('ru')) return 'ru';
  if (window.location.pathname.startsWith('/ru')) return 'ru';
  return 'en';
}

function init() {
  if (document.getElementById(MOUNT_ID)) return;

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  const mount = document.createElement('div');
  mount.id = MOUNT_ID;
  document.body.appendChild(mount);

  createRoot(mount).render(
    <StrictMode>
      <AskUxCore lang={detectLang()} />
    </StrictMode>,
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
