import { useRouter } from 'next/router';

const DISABLE_DARK_ON = '/tools/longevity-protocol';

export function useEffectiveDarkTheme(isDarkTheme: boolean) {
  const router = useRouter();

  const path = (router.asPath || '').split('?')[0].split('#')[0];

  const isExcluded = path.includes(DISABLE_DARK_ON);

  return isExcluded ? false : isDarkTheme;
}
