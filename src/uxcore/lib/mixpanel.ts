import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const isMixpanelEnabled = () =>
  typeof window !== 'undefined' && !!MIXPANEL_TOKEN;

export const initMixpanel = () => {
  if (isMixpanelEnabled()) {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV !== 'production',
      ignore_dnt: true,
    });
    mixpanel.track('Mixpanel Initialized');
  }
};

export default mixpanel;

export const handleMixpanelClick = (
  eventName: string,
  path: string,
  location: string,
  element: string,
) => {
  if (!isMixpanelEnabled()) return;
  mixpanel.track(eventName, {
    path: path,
    location: location,
    element: element,
  });
};

export const handleMixpanelSignUp = (source: string) => {
  if (!isMixpanelEnabled()) return;
  mixpanel.track('Sign Up', {
    source: source,
  });
};

let bounceTimer: ReturnType<typeof setTimeout> | null = null;

export const trackPageView = (url: string) => {
  if (!isMixpanelEnabled()) return;

  if (bounceTimer) {
    clearTimeout(bounceTimer);
    bounceTimer = null;
  }

  mixpanel.track('Page View', { page: url });

  bounceTimer = setTimeout(() => {
    mixpanel.track('Bounced', { page: url });
    cleanupListeners();
  }, 30000);

  const cancelBounce = () => {
    if (bounceTimer) {
      clearTimeout(bounceTimer);
      bounceTimer = null;
      mixpanel.track('Engaged', { page: url });
      cleanupListeners();
    }
  };

  const cleanupListeners = () => {
    window.removeEventListener('click', cancelBounce);
    window.removeEventListener('scroll', cancelBounce);
    window.removeEventListener('keydown', cancelBounce);
    window.removeEventListener('mousemove', cancelBounce);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      cancelBounce();
    }
  };

  window.addEventListener('click', cancelBounce);
  window.addEventListener('scroll', cancelBounce);
  window.addEventListener('keydown', cancelBounce);
  window.addEventListener('mousemove', cancelBounce);
  document.addEventListener('visibilitychange', handleVisibilityChange);
};

export const trackLogInSource = (source: string) => {
  if (!isMixpanelEnabled()) return;
  mixpanel.track('Log in Source', {
    signup_source: source,
  });
};
