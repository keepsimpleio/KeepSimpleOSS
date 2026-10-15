import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const supportedLocales = ['en', 'ru', 'hy'];
const defaultLocale = 'en';
const ARTICLE_PATH = /^(?:\/(?:en|ru|hy))?\/articles\/([^/]+)\/?$/;
const ARTICLE_SLUG = /^[A-Za-z0-9_-]+$/;

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

  // Crawlers follow article URLs with a stray encoded tail (`slug%29`,
  // `slug%252529`, ...) that grows by one encoding per hop. Article slugs are
  // [A-Za-z0-9_-] only, so anything after that prefix is cut off with a 301.
  const article = ARTICLE_PATH.exec(pathname);
  if (article && !ARTICLE_SLUG.test(article[1])) {
    const slug = /^[A-Za-z0-9_-]+/.exec(article[1])?.[0];
    if (slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/articles/${slug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|keepsimple_|favicon.ico).*)'],
};
