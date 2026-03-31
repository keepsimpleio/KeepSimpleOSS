import { useEffect, useState } from 'react';

const COOKIE_NAME = 'cookieBoxIsSeen';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getCookie(name: string) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

function getBaseDomain(hostname: string) {
  const parts = hostname.split('.');
  if (parts.length <= 2) return hostname;
  return `.${parts.slice(-2).join('.')}`;
}

export default function useCookieBox() {
  const [cookieBoxIsSeen, setCookieBoxIsSeen] = useState(false);
  const [isCookieStateLoaded, setIsCookieStateLoaded] = useState(false);

  useEffect(() => {
    const isSeen = getCookie(COOKIE_NAME);
    if (isSeen === 'true') setCookieBoxIsSeen(true);
    setIsCookieStateLoaded(true);
  }, []);

  const handleAccept = () => {
    setCookieBoxIsSeen(true);

    const hostname = window.location.hostname;
    const shouldShareAcrossSubdomains = true;
    const cookieDomain = shouldShareAcrossSubdomains
      ? getBaseDomain(hostname)
      : null;
    let cookieString = `${COOKIE_NAME}=true; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;

    if (cookieDomain) cookieString += `; Domain=${cookieDomain}`;
    if (window.location.protocol === 'https:') cookieString += '; Secure';

    document.cookie = cookieString;
  };

  return { isCookieStateLoaded, cookieBoxIsSeen, handleAccept };
}
