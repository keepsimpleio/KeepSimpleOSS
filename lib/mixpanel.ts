import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initMixpanel = () => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN) {
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
  mixpanel.track(eventName, {
    path: path,
    location: location,
    element: element,
  });
};

let bounceTimer: ReturnType<typeof setTimeout> | null = null;

export const trackPageView = (url: string) => {
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
