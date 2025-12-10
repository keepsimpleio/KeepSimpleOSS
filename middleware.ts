import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const supportedLocales = ['en', 'ru', 'hy'];
const defaultLocale = 'en';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skipping public files, _next, api, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  // Only using browser language on "/"
  if (pathname === '/') {
    const acceptLang = request.headers.get('accept-language');
    const preferredLocale = acceptLang
      ? acceptLang.split(',')[0].split('-')[0]
      : defaultLocale;

    const matchedLocale = supportedLocales.includes(preferredLocale)
      ? preferredLocale
      : defaultLocale;

    return NextResponse.redirect(new URL(`/${matchedLocale}`, request.url));
  }

  return NextResponse.next();
}
